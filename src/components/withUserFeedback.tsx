// Typing from https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
import React, { useState } from 'react'
import {
  ActionFunction,
  DialogActionKeys,
  DialogProps,
  RequestConfig,
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

export type UserFeedbackHOCProps = {
  runAction: (request: RequestConfig) => Promise<void>
  runFakeAction: (actionName: string) => void
  runCustomAction: (action: any, actionProps: RunActionProps) => Promise<void>
  forceUpdateCounter: number
  wrapActionInDialog: any
  showToast: (toastContent: ToastContentWithOutcome) => void
  setLoadingText: (text: string | undefined) => void
}

export function withUserFeedback<T extends UserFeedbackHOCProps>(
  WrappedComponent: React.ComponentType<T>
) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithUserFeedback = (props: Omit<T, keyof UserFeedbackHOCProps>) => {
    const [loadingText, setLoadingText] = useState<string | undefined>(undefined)
    const [dialog, setDialog] = useState<DialogProps>()
    const [toast, setToast] = useState<ToastProps>()
    const [forceUpdateCounter, setForceUpdateCounter] = useState(0)

    // Dialog and toast related functions
    const wrapActionInDialog =
      (wrappedAction: ActionFunction, endpointKey?: DialogActionKeys) => async (_: any) => {
        const contents = endpointKey ? DIALOG_CONTENTS[endpointKey] : {}
        setDialog({ proceedCallback: wrappedAction, close: closeDialog, ...contents })
      }
    const closeDialog = () => {
      setDialog(undefined)
    }
    const showToast = ({
      outcome = 'success',
      title = 'Operazione conclusa',
      description = 'Operazione conclusa con successo',
    }: ToastContentWithOutcome) => {
      setToast({ outcome, title, description, onClose: closeToast })
    }
    const closeToast = () => {
      setToast(undefined)
    }

    /*
     * API calls
     */
    const runAction = async (request: RequestConfig) => {
      const { loadingText, success, error }: RunActionProps =
        TOAST_CONTENTS[request.path.endpoint as ToastActionKeys]

      closeDialog()
      setLoadingText(loadingText)

      const response = await fetchWithLogs(request.path, request.config)
      const outcome = getFetchOutcome(response)

      let toastContent: ToastContentWithOutcome = { ...error, outcome: 'error' }
      if (outcome === 'success') {
        setForceUpdateCounter(forceUpdateCounter + 1)
        toastContent = { ...success, outcome: 'success' }
      }

      setLoadingText(undefined)
      showToast(toastContent)
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
        setForceUpdateCounter(forceUpdateCounter + 1)
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
          runFakeAction={runFakeAction}
          runCustomAction={runCustomAction}
          forceUpdateCounter={forceUpdateCounter}
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
