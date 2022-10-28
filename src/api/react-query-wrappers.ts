import React from 'react'
import { useDialog, useLoadingOverlay, useToastNotification } from '@/contexts'
import { useMutation, useQuery } from '@tanstack/react-query'
import { UseMutationWrapper, UseQueryWrapper } from './react-query-wrapper.types'
import { useJwt } from '@/hooks/useJwt'

export const useQueryWrapper: UseQueryWrapper = (key, queryFn, options) => {
  const { hasSessionExpired } = useJwt()
  const { openDialog } = useDialog()

  if (!options?.skipJwtSessionExpirationCheck && hasSessionExpired()) {
    openDialog({ type: 'sessionExpired' })
  }

  return useQuery(key, queryFn, {
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
        showToast(options.successToastLabel, 'success')
      }
      options?.onSuccess?.(...args)
    },
    onError: (...args) => {
      if (!options?.suppressErrorToast && options?.errorToastLabel) {
        showToast(options.errorToastLabel, 'error')
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
      description: string
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
        })
      })
    },
    [openDialog, closeDialog]
  )

  const optionsLoadingLabel = !options?.suppressLoadingOverlay && options?.loadingLabel
  const confirmationDialogTitle = options?.showConfirmationDialog && options?.dialogConfig.title
  const confirmationDialogDescription =
    options?.showConfirmationDialog && options?.dialogConfig.description

  const mutate: typeof _mutate = React.useCallback(
    async (...args) => {
      if (hasSessionExpired()) {
        openDialog({ type: 'sessionExpired' })
        return
      }

      if (confirmationDialogTitle && confirmationDialogDescription) {
        return await _wrapActionInDialog(
          () => {
            if (optionsLoadingLabel) showOverlay(optionsLoadingLabel)
            _mutate(...args)
          },
          confirmationDialogTitle,
          confirmationDialogDescription
        )
      }
      if (optionsLoadingLabel) showOverlay(optionsLoadingLabel)
      _mutate(...args)
    },
    [
      _mutate,
      showOverlay,
      optionsLoadingLabel,
      confirmationDialogTitle,
      confirmationDialogDescription,
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
      if (confirmationDialogTitle && confirmationDialogDescription) {
        return await _wrapActionInDialog<ReturnType<typeof _mutateAsync>>(
          () => {
            if (optionsLoadingLabel) showOverlay(optionsLoadingLabel)
            return _mutateAsync(...args)
          },
          confirmationDialogTitle,
          confirmationDialogDescription
        )
      }
      if (optionsLoadingLabel) showOverlay(optionsLoadingLabel)

      return _mutateAsync(...args)
    },
    [
      _mutateAsync,
      showOverlay,
      optionsLoadingLabel,
      confirmationDialogTitle,
      confirmationDialogDescription,
      _wrapActionInDialog,
      hasSessionExpired,
      openDialog,
    ]
  )

  return { mutate, mutateAsync, ...rest }
}
