import React from 'react'
import { useDialog, useLoadingOverlay, useToastNotification } from '@/contexts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UseMutationWrapper } from './react-query-wrappers.types'
import { useJwt } from '@/hooks/useJwt'
import { ExponentialBackoffTimeout } from './react-query-wrappers.utils'

/**
 * Due to the backend's eventual consistency, after each mutation success, all the active queries are polled.
 * This variable contains the single active instance of the ExponentialBackoffTimeout class that contains the polling logic.
 * */
let activeQueriesPolling: ExponentialBackoffTimeout | undefined

/**
 * This react-query's useMutation wrapper takes care of most of what's needed for the application mutations:
 * toast notifications, loading overlay, confirmation dialog, session expiration checks, and query polling.
 *
 * It adds the following options:
 *
 * - `successToastLabel` - Required only if `suppressSuccessToast` is `false` or `undefined`.
 * - `suppressSuccessToast` - If `true`, does not show success toast.
 * - `errorToastLabel` - Required only if `suppressErrorToast` is `false` or `undefined`.
 * - `suppressErrorToast` - If `true`, does not show error toast.
 * - `loadingOverlayLabel` - Required only if `suppressLoadingOverlay` is `false` or `undefined`.
 * - `suppressLoadingOverlay` - If `true`, does not show loading overlay.
 * - `showConfirmationDialog` - If `true` shows the confirmation dialog when the mutation function is called.
 * - `dialogConfig` - Options for dialog's title, description and button proceed label.
 *
 * On each label property, both function or string can be passed.
 * The function will receive as a parameter the object passed to the mutate function,
 * and only for the `successToastLabel` property, also the mutation's result data.
 *
 * @example
 * const { mutate } = useMutationWrapper(..., {
 *   ...,
 *   successToastLabel: (data, variables) => {
 *     console.log(data) // The data returned from the server on mutation call
 *     console.log(variables) // The variables passed to the mutation function call
 *     return t(`mutation-feedback.success`, { name: variables.eserviceName })
 *   },
 *   errorToastLabel: "ERROR",
 *   loadingOverlay: (variables) => {
 *     return t(`mutation-feedback.loading`, { name: variables.eserviceName })
 *   },
 * })
 * ...
 * mutate({ ..., eserviceName: "TEST" })
 *
 */
export const useMutationWrapper: UseMutationWrapper = (mutationFn, options) => {
  const { showToast } = useToastNotification()
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { openDialog, closeDialog } = useDialog()
  const { hasSessionExpired } = useJwt()
  const queryClient = useQueryClient()

  const requestPolling = React.useCallback(() => {
    const refetchActiveQueries = () => {
      queryClient.refetchQueries({ type: 'active' })
    }

    activeQueriesPolling?.cancel()
    activeQueriesPolling = new ExponentialBackoffTimeout(refetchActiveQueries, 20 * 1000)
  }, [queryClient])

  /**
   * Wraps the react-query's onSuccess option property. Handles the success toast notification and the starts refetch/polling.
   */
  const _wrappedOnSuccess: typeof options.onSuccess = (...args) => {
    if (!options?.suppressSuccessToast && options?.successToastLabel) {
      const successLabel =
        typeof options.successToastLabel === 'function'
          ? options.successToastLabel(...args)
          : options?.successToastLabel

      showToast(successLabel, 'success')
    }
    requestPolling()
    options?.onSuccess?.(...args)
  }

  /**
   * Wraps the react-query's onError option property. Handles the error toast notification.
   */
  const _wrappedOnError: typeof options.onError = (...args) => {
    if (!options?.suppressErrorToast && options.errorToastLabel) {
      const errorLabel =
        typeof options.errorToastLabel === 'function'
          ? options.errorToastLabel(args[1], args[2])
          : options?.errorToastLabel

      showToast(errorLabel, 'error')
    }
    options?.onError?.(...args)
  }

  /**
   * Wraps the react-query's onSettled option property. Hides the loading overlay.
   */
  const _wrappedOnSettled: typeof options.onSettled = (...args) => {
    hideOverlay()
    options?.onSettled?.(...args)
  }

  const {
    mutate: _mutate,
    mutateAsync: _mutateAsync,
    ...rest
  } = useMutation(mutationFn, {
    ...options,
    onSuccess: _wrappedOnSuccess,
    onError: _wrappedOnError,
    onSettled: _wrappedOnSettled,
  })

  /**
   * Wraps the passed action in a dialog.
   * @returns a Promise that resolves only if the dialog's proceed button is pressed
   */
  const _wrapActionInDialog = React.useCallback(
    async <T>(
      action: (...args: unknown[]) => T,
      title: string,
      description: string,
      proceedLabel?: string
    ): Promise<T> => {
      return new Promise((resolve) => {
        const proceedCallback = () => {
          resolve(action())
          closeDialog()
        }

        openDialog({
          type: 'basic',
          proceedCallback,
          title,
          description,
          proceedLabel,
        })
      })
    },
    [openDialog, closeDialog]
  )

  const hasConfirmationDialogTitle = !!(
    options?.showConfirmationDialog && options?.dialogConfig?.title
  )
  const hasConfirmationDialogDescription = !!(
    options?.showConfirmationDialog && options?.dialogConfig?.description
  )

  const handleLoadingOverlay = React.useCallback(
    (args: Parameters<typeof _mutate | typeof _mutateAsync>) => {
      const hasLoadingOverlay = !!(!options?.suppressLoadingOverlay && options?.loadingLabel)
      if (hasLoadingOverlay) {
        const loadingLabel =
          typeof options.loadingLabel === 'function'
            ? options.loadingLabel(args[0])
            : options.loadingLabel

        showOverlay(loadingLabel)
      }
    },
    [showOverlay, options]
  )

  const getDialogConfig = React.useCallback(
    (args: Parameters<typeof _mutate | typeof _mutateAsync>) => {
      const confirmationDialogTitle =
        typeof options.dialogConfig?.title === 'function'
          ? options.dialogConfig.title(args[0])
          : options.dialogConfig?.title ?? ''

      const confirmationDialogDescription =
        typeof options.dialogConfig?.description === 'function'
          ? options.dialogConfig?.description(args[0])
          : options.dialogConfig?.description ?? ''

      const proceedLabel = options.dialogConfig?.proceedLabel

      return { confirmationDialogTitle, confirmationDialogDescription, proceedLabel }
    },
    [options.dialogConfig]
  )

  const mutate: typeof _mutate = React.useCallback(
    async (...args) => {
      if (hasSessionExpired()) {
        openDialog({ type: 'sessionExpired' })
        return
      }

      if (hasConfirmationDialogTitle && hasConfirmationDialogDescription) {
        const { confirmationDialogTitle, confirmationDialogDescription, proceedLabel } =
          getDialogConfig(args)
        return await _wrapActionInDialog(
          () => {
            handleLoadingOverlay(args)
            _mutate(...args)
          },
          confirmationDialogTitle,
          confirmationDialogDescription,
          proceedLabel
        )
      }
      handleLoadingOverlay(args)
      _mutate(...args)
    },
    [
      _mutate,
      handleLoadingOverlay,
      getDialogConfig,
      hasConfirmationDialogTitle,
      hasConfirmationDialogDescription,
      _wrapActionInDialog,
      hasSessionExpired,
      openDialog,
    ]
  )

  const mutateAsync: typeof _mutateAsync = React.useCallback(
    async (...args) => {
      if (hasSessionExpired()) {
        openDialog({ type: 'sessionExpired' })
        return Promise.reject()
      }

      if (hasConfirmationDialogTitle && hasConfirmationDialogDescription) {
        const { confirmationDialogTitle, confirmationDialogDescription, proceedLabel } =
          getDialogConfig(args)

        return await _wrapActionInDialog(
          () => {
            handleLoadingOverlay(args)
            return _mutateAsync(...args)
          },
          confirmationDialogTitle,
          confirmationDialogDescription,
          proceedLabel
        )
      }
      handleLoadingOverlay(args)
      return _mutateAsync(...args)
    },
    [
      _mutateAsync,
      handleLoadingOverlay,
      getDialogConfig,
      hasConfirmationDialogTitle,
      hasConfirmationDialogDescription,
      _wrapActionInDialog,
      hasSessionExpired,
      openDialog,
    ]
  )

  return { mutate, mutateAsync, ...rest }
}
