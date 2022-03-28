import { useContext, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import {
  ActionFunction,
  DialogActionKeys,
  RequestConfig,
  RequestOutcome,
  MappedRouteConfig,
  RunActionProps,
  ToastActionKeys,
  ToastContentWithOutcome,
  ApiEndpointKey,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { DialogContext, LoaderContext, TableActionMenuContext, ToastContext } from '../lib/context'
import { getFetchOutcome } from '../lib/error-utils'
import { DIALOG_CONTENTS } from '../config/dialog'
import { TOAST_CONTENTS } from '../config/toast'

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
  const history = useHistory()
  const { setTableActionMenu } = useContext(TableActionMenuContext)
  const { setLoadingText } = useContext(LoaderContext)
  const { setDialog } = useContext(DialogContext)
  const { setToast } = useContext(ToastContext)
  const [forceRerenderCounter, setForceRerenderCounter] = useState(0)

  // Dialog, toast and counter related functions
  const wrapActionInDialog = (wrappedAction: ActionFunction, endpointKey: ApiEndpointKey) => {
    const hasDialog = Object.keys(DIALOG_CONTENTS).includes(endpointKey)

    if (!hasDialog) {
      throw new Error('This action should have a modal')
    } else {
      setDialog({
        type: 'basic',
        proceedCallback: wrappedAction,
        close: closeDialog,
        ...DIALOG_CONTENTS[endpointKey as DialogActionKeys],
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
    const { loadingText, success, error }: RunActionProps =
      TOAST_CONTENTS[requestConfig.path.endpoint as ToastActionKeys]

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

      if (onSuccessDestination && outcome === 'success') {
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
      wrapActionInDialog(runBasicAction, request.path.endpoint)
    } else {
      return await runBasicAction()
    }
  }
  /*
   * End API calls
   */

  return { runAction, forceRerenderCounter, requestRerender }
}
