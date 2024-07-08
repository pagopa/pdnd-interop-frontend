import { useDialogStore, useLoadingOverlayStore, useToastNotificationStore } from '@/stores'
import { clearExponentialInterval, setExponentialInterval } from '@/utils/common.utils'
import { NotFoundError } from '@/utils/errors.utils'
import {
  type Mutation,
  type QueryClientConfig,
  type MutationMeta,
  QueryClient,
} from '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface MutationMeta<
    TData = unknown,
    TError = unknown,
    TVariables = unknown,
    TContext = unknown,
  > {
    loadingLabel?: string | ((variables: TVariables) => string)
    successToastLabel?: string | ((data: TData, variables: TVariables, context: TContext) => string)
    errorToastLabel?: string | ((error: TError, variables: TVariables, context: TContext) => string)
    confirmationDialog?: {
      title: string | ((variables: TVariables) => string)
      description?: string | ((variables: TVariables) => string)
      proceedLabel?: string
    }
  }
}

// 1000, 2000, 4000, 8000, 16000, with a maximum of 30 seconds
const exponentialBackoffRetry = (attemptIndex: number) => {
  return Math.min(1000 * 2 ** attemptIndex, 30 * 1000)
}

const { showToast } = useToastNotificationStore.getState()
const { showOverlay, hideOverlay } = useLoadingOverlayStore.getState()
const { openDialog } = useDialogStore.getState()

const resolveMeta = (query: {
  mutation: Mutation<unknown, unknown, unknown>
  data?: unknown
  error?: unknown
  variables?: unknown
  context?: unknown
}) => {
  const { mutation, data, error, variables, context } = query
  const meta = mutation.meta as MutationMeta | undefined

  if (!meta) return {}

  const loadingLabel =
    typeof meta.loadingLabel === 'function' ? meta.loadingLabel(variables) : meta.loadingLabel

  const successToastLabel =
    typeof meta.successToastLabel === 'function'
      ? meta.successToastLabel(data, variables, context)
      : meta.successToastLabel

  const errorToastLabel =
    typeof meta.errorToastLabel === 'function'
      ? meta.errorToastLabel(error, variables, context)
      : meta.errorToastLabel

  const confirmationDialog = meta.confirmationDialog

  const title =
    typeof confirmationDialog?.title === 'function'
      ? confirmationDialog?.title(variables)
      : confirmationDialog?.title

  const description =
    typeof confirmationDialog?.description === 'function'
      ? confirmationDialog?.description(variables)
      : confirmationDialog?.description

  const proceedLabel = confirmationDialog?.proceedLabel

  return {
    loadingLabel,
    successToastLabel,
    errorToastLabel,
    confirmationDialog: confirmationDialog
      ? { title: title as string, description, proceedLabel }
      : undefined,
  }
}

const waitForUserConfirmation = (confirmationDialog: {
  title: string
  description?: string
  proceedLabel?: string
}) => {
  return new Promise((resolve) => {
    openDialog({
      type: 'basic',
      title: confirmationDialog.title,
      description: confirmationDialog.description,
      proceedLabel: confirmationDialog.proceedLabel,
      onProceed: () => {
        resolve(true)
      },
      onCancel: () => {
        resolve(false)
      },
    })
  })
}

/**
 * Error thrown when a mutation is cancelled by the user in the confirmation dialog.
 */
class CancellationError extends Error {
  constructor() {
    super('Mutation cancelled')
  }
}

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // suspense: true,
      throwOnError: true,
      retryDelay: exponentialBackoffRetry,
    },
    mutations: {
      throwOnError: false,
      retry: (attemptIndex, error) => {
        /**
         * Retry only on 404 error mutation. This is needed
         * for eventual consistency reasons.
         */
        if (error instanceof NotFoundError) {
          return attemptIndex < 4
        }
        return false
      },
      retryDelay: exponentialBackoffRetry,
    },
  },
}

const queryClient = new QueryClient(queryClientConfig)
const mutationCache = queryClient.getMutationCache()

/**
 * Due to the backend's eventual consistency, after each mutation success, all the active queries are polled.
 * This variable contains the instance id of the active exponential interval.
 * */
let activeQueriesPollingIntervalId: string | undefined

const requestPolling = () => {
  const refetchActiveQueries = () => {
    queryClient.refetchQueries({ type: 'active', stale: true })
  }

  clearExponentialInterval(activeQueriesPollingIntervalId)
  activeQueriesPollingIntervalId = setExponentialInterval(refetchActiveQueries, 20 * 1000)
}

mutationCache.config.onMutate = async (variables, mutation) => {
  const meta = resolveMeta({ mutation, variables })
  if (meta.confirmationDialog) {
    const confirmed = await waitForUserConfirmation(meta.confirmationDialog)
    if (!confirmed) return Promise.reject(new CancellationError())
  }
  if (meta.loadingLabel) showOverlay(meta.loadingLabel)
}

mutationCache.config.onSuccess = (data, variables, context, mutation) => {
  const meta = resolveMeta({ mutation, data, variables, context })
  if (meta.successToastLabel) showToast(meta.successToastLabel, 'success')
  requestPolling()
}

mutationCache.config.onError = (error, variables, context, mutation) => {
  // If the error is due to the user cancelling the mutation, do nothing.
  if (error instanceof CancellationError) return

  const meta = resolveMeta({ mutation, error, variables, context })
  if (meta.errorToastLabel) showToast(meta.errorToastLabel, 'error')
}

mutationCache.config.onSettled = (data, error, variables, context, mutation) => {
  const meta = resolveMeta({ mutation, data, error, variables, context })
  if (meta.loadingLabel) hideOverlay()
}

export { queryClient }
