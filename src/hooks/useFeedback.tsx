import { useContext, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import {
  ActionFunction,
  DialogActionKeys,
  RequestConfig,
  RequestOutcome,
  MappedRouteConfig,
  RunActionOutput,
  RunActionProps,
  ToastActionKeys,
  ToastContentWithOutcome,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { DialogContext, LoaderContext, TableActionMenuContext, ToastContext } from '../lib/context'
import { getFetchOutcome } from '../lib/error-utils'
import { DIALOG_CONTENTS } from '../config/dialog'
import { TOAST_CONTENTS } from '../config/toast'

type ActionOptions = {
  suppressToast?: boolean
  silent?: boolean
  onSuccessDestination?: MappedRouteConfig
}

type CallbackActionOptions = ActionOptions & {
  callback: (response: AxiosResponse) => void
}

export type RunAction = (
  request: RequestConfig,
  options: ActionOptions
) => Promise<{ outcome: RequestOutcome; response: AxiosResponse | AxiosError }>

// TEMP REFACTOR: this typing needs to be refactored
export type UserFeedbackHOCProps = {
  runAction: RunAction
  runActionWithCallback: (request: RequestConfig, options: CallbackActionOptions) => Promise<void>
  forceRerenderCounter: number
  requestRerender: VoidFunction
  wrapActionInDialog: Promise<void>
  showToast: (toastContent: ToastContentWithOutcome) => void
  setLoadingText: (text: string | undefined) => void
}

export const useFeedback = () => {
  const history = useHistory()
  const { setTableActionMenu } = useContext(TableActionMenuContext)
  const { setLoadingText } = useContext(LoaderContext)
  const { setDialog } = useContext(DialogContext)
  const { setToast } = useContext(ToastContext)
  const [forceRerenderCounter, setForceRerenderCounter] = useState(0)

  // Dialog, toast and counter related functions
  const wrapActionInDialog =
    (wrappedAction: ActionFunction, endpointKey?: DialogActionKeys) => async () => {
      const contents = endpointKey ? DIALOG_CONTENTS[endpointKey] : null
      if (contents) {
        setDialog({
          type: 'basic',
          proceedCallback: wrappedAction,
          close: closeDialog,
          ...contents,
        })
      } else {
        throw new Error('La dialog richiesta non esiste')
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

  // The most basic action. Makes request, and displays the outcome
  const runAction = async (
    request: RequestConfig,
    { suppressToast = false, silent = false, onSuccessDestination }: ActionOptions
  ): Promise<RunActionOutput> => {
    const { outcome, toastContent, response } = await makeRequestAndGetOutcome(request)

    // Hide loader
    setLoadingText(null)

    // If this comes from an action in a table, close it
    setTableActionMenu(null)

    if (onSuccessDestination && outcome === 'success') {
      // Go to destination path, and optionally display the toast there
      history.push(onSuccessDestination.PATH, { toast: !suppressToast && toastContent })
    } else {
      // Only refresh the view if success (if failure, nothing has happened and there is nothing to re-render)
      if (outcome === 'success' && !silent) {
        // Force refresh the current view if needed
        setForceRerenderCounter(forceRerenderCounter + 1)
      }

      if (!suppressToast) {
        showToast(toastContent)
      }
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

    // If this comes from an action in a table, close it
    setTableActionMenu(null)

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
  /*
   * End API calls
   */

  return {
    runAction,
    runActionWithCallback,
    forceRerenderCounter,
    requestRerender,
    showToast,
    setLoadingText,
    wrapActionInDialog,
  }
}
