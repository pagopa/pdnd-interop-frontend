// Typing from https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
import { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  ActionFunction,
  DialogActionKeys,
  DialogProps,
  RequestConfig,
  RouteConfig,
  RunActionProps,
  ToastActionKeys,
  ToastContentWithOutcome,
  ToastProps,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { DIALOG_CONTENTS, TOAST_CONTENTS } from '../lib/constants'
import { getFetchOutcome } from '../lib/error-utils'
import { showTempAlert } from '../lib/wip-utils'
import { LoadingOverlay } from './LoadingOverlay'
import { StyledDialog } from './StyledDialog'
import { StyledToast } from './StyledToast'

type ActionOptions = { suppressToast: boolean }

type CallbackActionOptions = ActionOptions & {
  callback: (response: AxiosResponse) => void
}

type DestinationActionOptions = ActionOptions & {
  destination: RouteConfig
}

// TEMP REFACTOR: this typing needs to be refactored
export type UserFeedbackHOCProps = {
  runAction: (request: RequestConfig, options: ActionOptions) => Promise<void>
  runActionWithDestination: (
    request: RequestConfig,
    options: DestinationActionOptions
  ) => Promise<void>
  runActionWithCallback: (request: RequestConfig, options: CallbackActionOptions) => Promise<void>
  runFakeAction: (actionName: string) => void
  runCustomAction: (action: any, actionProps: RunActionProps) => Promise<void>
  forceRerenderCounter: number
  requestRerender: VoidFunction
  wrapActionInDialog: any
  showToast: (toastContent: ToastContentWithOutcome) => void
  setLoadingText: (text: string | undefined) => void
}

export function withUserFeedback<T extends UserFeedbackHOCProps>(
  WrappedComponent: React.ComponentType<T>
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithUserFeedback = (props: Omit<T, keyof UserFeedbackHOCProps>) => {
    const history = useHistory()
    const [loadingText, setLoadingText] = useState<string | undefined>(undefined)
    const [dialog, setDialog] = useState<DialogProps>()
    const [toast, setToast] = useState<ToastProps>()
    const [forceRerenderCounter, setForceRerenderCounter] = useState(0)

    // Dialog, toast and counter related functions
    const wrapActionInDialog =
      (wrappedAction: ActionFunction, endpointKey?: DialogActionKeys) => async (_: any) => {
        const contents = endpointKey ? DIALOG_CONTENTS[endpointKey] : {}
        setDialog({ proceedCallback: wrappedAction, close: closeDialog, ...contents })
      }

    const closeDialog = () => {
      setDialog(undefined)
    }

    const showToast = (toastContentWithOutcome: ToastContentWithOutcome) => {
      setToast({ ...toastContentWithOutcome, onClose: closeToast })
    }

    const closeToast = () => {
      setToast(undefined)
    }

    const requestRerender = () => {
      setForceRerenderCounter(forceRerenderCounter + 1)
    }

    /*
     * API calls
     */
    const makeRequestAndGetOutcome = async (request: RequestConfig) => {
      const { loadingText, success, error }: RunActionProps =
        TOAST_CONTENTS[request.path.endpoint as ToastActionKeys]

      // Close modal
      closeDialog()
      // Show loader
      setLoadingText(loadingText)
      // Make request
      const response = await fetchWithLogs(request.path, request.config)
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
      const { outcome, toastContent } = await makeRequestAndGetOutcome(request)

      if (outcome === 'success') {
        // Force refresh the current view if needed
        setForceRerenderCounter(forceRerenderCounter + 1)
      }

      // Hide loader
      setLoadingText(undefined)

      if (!suppressToast) {
        showToast(toastContent)
      }
    }

    // This action invokes a callback after a successful request/response cycle
    const runActionWithCallback = async (
      request: RequestConfig,
      { callback, suppressToast }: CallbackActionOptions
    ) => {
      const { outcome, toastContent, response } = await makeRequestAndGetOutcome(request)

      // Here, we are making a big assumption: callback kills the current view,
      // so no state can be set after it, just like in runActionWithDestination
      if (outcome === 'success') {
        callback(response as AxiosResponse)
      }

      // Hide loader
      setLoadingText(undefined)

      if (!suppressToast) {
        showToast(toastContent)
      }
    }

    // This action goes to another view after a successful request/response cycle, triggering a pushState
    const runActionWithDestination = async (
      request: RequestConfig,
      { destination, suppressToast }: DestinationActionOptions
    ) => {
      const { outcome, toastContent } = await makeRequestAndGetOutcome(request)

      if (outcome === 'success') {
        // Go to destination path, and optionally display the toast
        history.push(destination.PATH, { toast: !suppressToast && toastContent })
      }
    }

    const runCustomAction = async (
      actionToRun: () => Promise<any>,
      { loadingText, success, error }: RunActionProps
    ) => {
      closeDialog()
      setLoadingText(loadingText)

      const response = await actionToRun()
      const outcome = getFetchOutcome(response)

      let toastContent: ToastContentWithOutcome = { ...error, outcome: 'error' }
      if (outcome === 'success') {
        setForceRerenderCounter(forceRerenderCounter + 1)
        toastContent = { ...success, outcome: 'success' }
      }

      setLoadingText(undefined)
      showToast(toastContent)
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

    return (
      <React.Fragment>
        <WrappedComponent
          {...(props as T)}
          runAction={runAction}
          runActionWithCallback={runActionWithCallback}
          runActionWithDestination={runActionWithDestination}
          runFakeAction={runFakeAction}
          runCustomAction={runCustomAction}
          forceRerenderCounter={forceRerenderCounter}
          requestRerender={requestRerender}
          showToast={showToast}
          setLoadingText={setLoadingText}
          wrapActionInDialog={wrapActionInDialog}
        />

        {dialog && <StyledDialog {...dialog} />}
        {toast && <StyledToast {...toast} />}
        {loadingText && <LoadingOverlay loadingText={loadingText} />}
      </React.Fragment>
    )
  }

  ComponentWithUserFeedback.displayName = `withUserFeedback(${displayName})`

  return ComponentWithUserFeedback
}
