import { useContext, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import {
  ActionFunction,
  DialogActionKeys,
  RequestConfig,
  RequestOutcome,
  RouteConfig,
  RunActionProps,
  ToastActionKeys,
  ToastContentWithOutcome,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { DIALOG_CONTENTS, TOAST_CONTENTS } from '../lib/constants'
import { DialogContext, LoaderContext, ToastContext } from '../lib/context'
import { getFetchOutcome } from '../lib/error-utils'
import { showTempAlert } from '../lib/wip-utils'

type ActionOptions = { suppressToast: boolean }

type CallbackActionOptions = ActionOptions & {
  callback: (response: AxiosResponse) => void
}

type DestinationActionOptions = ActionOptions & {
  destination: RouteConfig
}

// TEMP REFACTOR: this typing needs to be refactored
export type UserFeedbackHOCProps = {
  runAction: (
    request: RequestConfig,
    options: ActionOptions
  ) => Promise<{ outcome: RequestOutcome; response: AxiosResponse | AxiosError }>
  runActionWithDestination: (
    request: RequestConfig,
    options: DestinationActionOptions
  ) => Promise<void>
  runActionWithCallback: (request: RequestConfig, options: CallbackActionOptions) => Promise<void>
  runFakeAction: (actionName: string) => void
  forceRerenderCounter: number
  requestRerender: VoidFunction
  wrapActionInDialog: any
  showToast: (toastContent: ToastContentWithOutcome) => void
  setLoadingText: (text: string | undefined) => void
}

export const useFeedback = () => {
  const history = useHistory()
  const { setLoadingText } = useContext(LoaderContext)
  const { setDialog } = useContext(DialogContext)
  const { setToast } = useContext(ToastContext)
  const [forceRerenderCounter, setForceRerenderCounter] = useState(0)

  // Dialog, toast and counter related functions
  const wrapActionInDialog =
    (wrappedAction: ActionFunction, endpointKey?: DialogActionKeys) => async (_: any) => {
      const contents = endpointKey ? DIALOG_CONTENTS[endpointKey] : {}
      setDialog({ proceedCallback: wrappedAction, close: closeDialog, ...contents })
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

  // The most basic action. Makes request, and displays the outcome
  const runAction = async (request: RequestConfig, { suppressToast }: ActionOptions) => {
    const { outcome, toastContent, response } = await makeRequestAndGetOutcome(request)

    if (outcome === 'success') {
      // Force refresh the current view if needed
      setForceRerenderCounter(forceRerenderCounter + 1)
    }

    // Hide loader
    setLoadingText(null)

    if (!suppressToast) {
      showToast(toastContent)
    }

    return { outcome, response }
  }

  // This action invokes a callback after a successful request/response cycle
  const runActionWithCallback = async (
    request: RequestConfig,
    { callback, suppressToast }: CallbackActionOptions
  ) => {
    const { outcome, toastContent, response } = await makeRequestAndGetOutcome(request)

    // Hide loader
    setLoadingText(null)

    // Here, we are making a big assumption: callback kills the current view,
    // so no state can be set after it, just like in runActionWithDestination.
    // All state changes are in the "else" clause
    if (outcome === 'success') {
      callback(response as AxiosResponse)
    } else {
      if (!suppressToast) {
        showToast(toastContent)
      }
    }
  }

  // This action goes to another view after a successful request/response cycle, triggering a pushState
  const runActionWithDestination = async (
    request: RequestConfig,
    { destination, suppressToast }: DestinationActionOptions
  ) => {
    const { outcome, toastContent } = await makeRequestAndGetOutcome(request)

    // Hide loader
    setLoadingText(null)

    if (outcome === 'success') {
      // Go to destination path, and optionally display the toast
      history.push(destination.PATH, { toast: !suppressToast && toastContent })
    }
  }

  const runFakeAction = (actionName: string) => {
    closeDialog()
    showTempAlert(actionName)
    showToast({
      outcome: 'success',
      title: actionName,
      description: "L'operazione è andata a buon fine",
    })
  }
  /*
   * End API calls
   */

  return {
    runAction,
    runActionWithCallback,
    runActionWithDestination,
    runFakeAction,
    forceRerenderCounter,
    requestRerender,
    showToast,
    setLoadingText,
    wrapActionInDialog,
  }
}
