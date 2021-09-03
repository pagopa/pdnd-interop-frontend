import React, { useState } from 'react'
import {
  ActionFunction,
  DialogContent,
  RequestConfig,
  RunActionProps,
  ToastContent,
  ToastProps,
} from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { TOAST_CONTENTS } from '../lib/constants'
import { getFetchOutcome } from '../lib/error-utils'
import { showTempAlert } from '../lib/wip-utils'

export type UserFeedbackHOCProps = {
  runAction: (request: RequestConfig) => Promise<void>
  runFakeAction: (actionName: string) => void
  forceUpdateCounter: number
  wrapActionInDialog: any
  dialog: DialogContent | undefined
  toast: ToastProps | undefined
  actionLoadingText: string | undefined
}

export function withUserFeedback(
  Component: React.FunctionComponent<UserFeedbackHOCProps>,
  props = {}
) {
  return () => {
    const [actionLoadingText, setActionLoadingText] = useState<string | undefined>(undefined)
    const [dialog, setDialog] = useState<DialogContent>()
    const [toast, setToast] = useState<ToastProps>()
    const [forceUpdateCounter, setForceUpdateCounter] = useState(0)

    // Dialog and toast related functions
    const wrapActionInDialog = (wrappedAction: ActionFunction) => async (_: any) => {
      setDialog({ proceedCallback: wrappedAction, close: closeDialog })
    }
    const closeToast = () => {
      setToast(undefined)
    }
    const closeDialog = () => {
      setDialog(undefined)
    }
    const showToast = ({
      title = 'Operazione conclusa',
      description = 'Operazione conclusa con successo',
    }: ToastContent) => {
      setToast({ title, description, onClose: closeToast })
    }

    /*
     * API calls
     */
    const runAction = async (request: RequestConfig) => {
      const { loadingText, success, error }: RunActionProps = TOAST_CONTENTS[request.path.endpoint]

      closeDialog()
      setActionLoadingText(loadingText)

      const response = await fetchWithLogs(request.path, request.config)
      const outcome = getFetchOutcome(response)

      let toastContent: ToastContent = error
      if (outcome === 'success') {
        setForceUpdateCounter(forceUpdateCounter + 1)
        toastContent = success
      }

      setActionLoadingText(undefined)
      showToast(toastContent)
    }

    const runFakeAction = (actionName: string) => {
      closeDialog()
      showTempAlert(actionName)
      showToast({ title: actionName, description: "L'operazione è andata a buon fine" })
    }
    /*
     * End API calls
     */

    return (
      <Component
        {...props}
        runAction={runAction}
        runFakeAction={runFakeAction}
        forceUpdateCounter={forceUpdateCounter}
        wrapActionInDialog={wrapActionInDialog}
        dialog={dialog}
        toast={toast}
        actionLoadingText={actionLoadingText}
      />
    )
  }
}
