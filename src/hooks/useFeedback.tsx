import { useContext, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import {
  ActionFunction,
  RequestConfig,
  RequestOutcome,
  MappedRouteConfig,
  ToastContentWithOutcome,
  ApiEndpointKey,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { DialogContext, LoaderContext, TableActionMenuContext, ToastContext } from '../lib/context'
import { getFetchOutcome } from '../lib/error-utils'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useJwt } from './useJwt'

type BasicActionOptions = {
  suppressToast?: Array<RequestOutcome>
  silent?: boolean
  onSuccessDestination?: MappedRouteConfig
}

type ActionOptions = BasicActionOptions & {
  showConfirmDialog?: boolean
}

export type RunActionOutput = {
  response: AxiosResponse | AxiosError
  outcome: RequestOutcome
}

export type RunAction = (
  request: RequestConfig,
  options?: ActionOptions
) => Promise<RunActionOutput | void>

// TEMP REFACTOR: this typing needs to be refactored
export type UserFeedbackHOCProps = {
  runAction: RunAction
  forceRerenderCounter: number
  requestRerender: VoidFunction
}

export const useFeedback = () => {
  const { t } = useTranslation(['toast', 'dialog'])
  const { hasSessionExpired } = useJwt()
  const history = useHistory()
  const { setTableActionMenu } = useContext(TableActionMenuContext)
  const { setLoadingText } = useContext(LoaderContext)
  const { setDialog } = useContext(DialogContext)
  const { setToast } = useContext(ToastContext)
  const [forceRerenderCounter, setForceRerenderCounter] = useState(0)

  // Dialog, toast and counter related functions
  const wrapActionInDialog = async (wrappedAction: ActionFunction, endpointKey: ApiEndpointKey) => {
    const hasDialog = i18next.exists(endpointKey, { ns: 'dialog' })

    if (!hasDialog) {
      throw new Error('This action should have a modal')
    } else {
      return new Promise<void>((resolve) => {
        const title = t(`${endpointKey}.title`, { ns: 'dialog' })
        const description = i18next.exists(`${endpointKey}.description`, { ns: 'dialog' })
          ? t(`${endpointKey}.description`, { ns: 'dialog' })
          : undefined

        const proceedCallback = () => {
          resolve(wrappedAction())
        }

        const close = () => {
          closeDialog()
          resolve()
        }

        setDialog({
          type: 'basic',
          proceedCallback,
          close,
          title,
          description,
        })
      })
    }
  }

  const closeDialog = () => {
    setDialog(null)
  }

  const showToast = (toastContentWithOutcome: ToastContentWithOutcome) => {
    setToast({ ...toastContentWithOutcome, onClose: closeToast })
  }

  const closeToast = () => {
    setToast(null)
  }

  const requestRerender = () => {
    setForceRerenderCounter(forceRerenderCounter + 1)
  }

  /*
   * API calls
   */
  const makeRequestAndGetOutcome = async (
    requestConfig: RequestConfig
  ): Promise<{
    outcome: RequestOutcome
    toastContent: ToastContentWithOutcome
    response: AxiosResponse | AxiosError
  }> => {
    const loadingText = t(`${requestConfig.path.endpoint}.loadingText`, { ns: 'toast' })
    const successMessage = t(`${requestConfig.path.endpoint}.success.message`, { ns: 'toast' })
    const errorMessage = t(`${requestConfig.path.endpoint}.error.message`, { ns: 'toast' })
    const success = { message: successMessage }
    const error = { message: errorMessage }

    // Close modal
    closeDialog()
    // Show loader
    setLoadingText(loadingText)
    // Make request
    const response = await fetchWithLogs(requestConfig)
    // Get the request outcome
    const outcome = getFetchOutcome(response)

    // Set the toast content to error as a default
    let toastContent: ToastContentWithOutcome = { ...error, outcome: 'error' }
    // If success
    if (outcome === 'success') {
      // Set the toast content to success
      toastContent = { ...success, outcome: 'success' }
    }

    return { outcome, toastContent, response }
  }

  const wrapBasicAction =
    (
      request: RequestConfig,
      { suppressToast, silent = false, onSuccessDestination }: BasicActionOptions
    ) =>
    async () => {
      // If this comes from an action in a table, close it
      setTableActionMenu(null)

      // Fetch the data
      const { outcome, toastContent, response } = await makeRequestAndGetOutcome(request)

      // Hide loader
      setLoadingText(null)

      // If the session has expired
      if (outcome === 'error' && hasSessionExpired) {
        // Set the dialog that will redirect to the login page
        setDialog({ type: 'sessionExpired' })
        // Stop here, all that follows is redundant
        return { outcome, response }
      }

      if (outcome === 'success' && onSuccessDestination) {
        // Go to destination path, and optionally display the toast there
        history.push(onSuccessDestination.PATH, { toast: !suppressToast && toastContent })
      } else {
        // Only refresh the view if success (if failure, nothing has happened and there is nothing to re-render)
        if (outcome === 'success' && !silent) {
          // Force refresh the current view if needed
          setForceRerenderCounter(forceRerenderCounter + 1)
        }

        // Show the toast unless it is explicitly hidden
        if (!suppressToast || !suppressToast.includes(outcome)) {
          showToast(toastContent)
        }
      }

      return { outcome, response }
    }

  // The most basic action. Makes request, and displays the outcome
  // While waiting for narrowing return types based using conditional types
  // Track this issue for progress: https://github.com/microsoft/TypeScript/issues/33014
  const runAction = async (
    request: RequestConfig,
    { showConfirmDialog = false, ...options }: ActionOptions = {}
  ): Promise<RunActionOutput | void> => {
    const runBasicAction = wrapBasicAction(request, options)

    if (showConfirmDialog) {
      return await wrapActionInDialog(runBasicAction, request.path.endpoint)
    }

    return await runBasicAction()
  }
  /*
   * End API calls
   */

  return { runAction, forceRerenderCounter, requestRerender }
}
