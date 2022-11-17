import React from 'react'
import { useDialog, useLoadingOverlay, useToastNotification } from '@/contexts'
import { useMutation, useQuery } from '@tanstack/react-query'
import { UseMutationWrapper, UseQueryWrapper } from './react-query-wrapper.types'
import { useJwt } from '@/hooks/useJwt'
import { NotFoundError } from '@/utils/errors.utils'

export const useQueryWrapper: UseQueryWrapper = (key, queryFn, options) => {
  const { hasSessionExpired, jwt } = useJwt()
  const { openDialog } = useDialog()

  if (!options?.skipJwtSessionExpirationCheck && hasSessionExpired()) {
    openDialog({ type: 'sessionExpired' })
  }

  return useQuery(key, queryFn, {
    useErrorBoundary: (error) => {
      if (options?.skipThrowOn404Error && error instanceof NotFoundError) {
        return false
      }
      return true
    },
    enabled: !!jwt && (options?.enabled ?? true),
    ...options,
  })
}

export const useMutationWrapper: UseMutationWrapper = (mutationFn, options) => {
  const { showToast } = useToastNotification()
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { openDialog, closeDialog } = useDialog()
  const { hasSessionExpired } = useJwt()

  const {
    mutate: _mutate,
    mutateAsync: _mutateAsync,
    ...rest
  } = useMutation(mutationFn, {
    ...options,
    onSuccess: (...args) => {
      if (!options?.suppressSuccessToast && options?.successToastLabel) {
        const successLabel =
          typeof options.successToastLabel === 'function'
            ? options.successToastLabel(...args)
            : options?.successToastLabel

        showToast(successLabel, 'success')
      }
      options?.onSuccess?.(...args)
    },
    onError: (...args) => {
      if (!options?.suppressErrorToast && options.errorToastLabel) {
        const errorLabel =
          typeof options.errorToastLabel === 'function'
            ? options.errorToastLabel(args[1], args[2])
            : options?.errorToastLabel

        showToast(errorLabel, 'error')
      }
      options?.onError?.(...args)
    },
    onSettled: (...args) => {
      hideOverlay()
      options?.onSettled?.(...args)
    },
  })

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

  const hasLoadingOverlay = !!(!options?.suppressLoadingOverlay && options?.loadingLabel)
  const hasConfirmationDialogTitle = !!(
    options?.showConfirmationDialog && options?.dialogConfig?.title
  )
  const hasConfirmationDialogDescription = !!(
    options?.showConfirmationDialog && options?.dialogConfig?.description
  )

  const mutate: typeof _mutate = React.useCallback(
    async (...args) => {
      if (hasSessionExpired()) {
        openDialog({ type: 'sessionExpired' })
        return
      }

      if (hasConfirmationDialogTitle && hasConfirmationDialogDescription) {
        const confirmationDialogTitle =
          typeof options.dialogConfig?.title === 'function'
            ? options.dialogConfig.title(args[0])
            : options.dialogConfig?.title ?? ''

        const confirmationDialogDescription =
          typeof options.dialogConfig?.description === 'function'
            ? options.dialogConfig?.description(args[0])
            : options.dialogConfig?.description ?? ''

        const proceedLabel = options.dialogConfig?.proceedLabel

        return await _wrapActionInDialog(
          () => {
            if (hasLoadingOverlay) {
              const loadingLabel =
                typeof options.loadingLabel === 'function'
                  ? options.loadingLabel(args[0])
                  : options.loadingLabel

              showOverlay(loadingLabel)
            }
            _mutate(...args)
          },
          confirmationDialogTitle,
          confirmationDialogDescription,
          proceedLabel
        )
      }
      if (hasLoadingOverlay) {
        const loadingLabel =
          typeof options.loadingLabel === 'function'
            ? options.loadingLabel(args[0])
            : options.loadingLabel

        showOverlay(loadingLabel)
      }
      _mutate(...args)
    },
    [
      _mutate,
      showOverlay,
      hasLoadingOverlay,
      hasConfirmationDialogTitle,
      hasConfirmationDialogDescription,
      _wrapActionInDialog,
      hasSessionExpired,
      openDialog,
      options,
    ]
  )

  const mutateAsync: typeof _mutateAsync = React.useCallback(
    async (...args) => {
      if (hasSessionExpired()) {
        openDialog({ type: 'sessionExpired' })
        return Promise.reject()
      }

      if (hasConfirmationDialogTitle && hasConfirmationDialogDescription) {
        const confirmationDialogTitle =
          typeof options.dialogConfig?.title === 'function'
            ? options.dialogConfig?.title(args[0])
            : options.dialogConfig?.title ?? ''

        const confirmationDialogDescription =
          typeof options.dialogConfig?.description === 'function'
            ? options.dialogConfig?.description(args[0])
            : options.dialogConfig?.description ?? ''

        const proceedLabel = options.dialogConfig?.proceedLabel

        return await _wrapActionInDialog(
          () => {
            if (hasLoadingOverlay) {
              const loadingLabel =
                typeof options.loadingLabel === 'function'
                  ? options.loadingLabel(args[0])
                  : options.loadingLabel

              showOverlay(loadingLabel)
            }
            return _mutateAsync(...args)
          },
          confirmationDialogTitle,
          confirmationDialogDescription,
          proceedLabel
        )
      }
      if (hasLoadingOverlay) {
        const loadingLabel =
          typeof options.loadingLabel === 'function'
            ? options.loadingLabel(args[0])
            : options.loadingLabel

        showOverlay(loadingLabel)
      }
      return _mutateAsync(...args)
    },
    [
      _mutateAsync,
      showOverlay,
      hasLoadingOverlay,
      hasConfirmationDialogTitle,
      hasConfirmationDialogDescription,
      _wrapActionInDialog,
      hasSessionExpired,
      openDialog,
      options,
    ]
  )

  return { mutate, mutateAsync, ...rest }
}
