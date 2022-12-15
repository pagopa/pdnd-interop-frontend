import React from 'react'
import { DialogProps } from '@/types/dialog.types'
import noop from 'lodash/noop'
import { createSafeContext } from './utils'
import { Dialog } from '@/components/dialogs'

type DialogContextType = {
  dialog: DialogProps | null
  openDialog: (dialogState: DialogProps) => void
  closeDialog: () => void
}

const { useContext, Provider } = createSafeContext<DialogContextType>('DialogContext', {
  dialog: null,
  openDialog: noop,
  closeDialog: noop,
})

const DialogContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialog, setDialog] = React.useState<DialogProps | null>(null)

  const openDialog = React.useCallback((dialogState: DialogProps) => {
    setDialog(dialogState)
  }, [])

  const closeDialog = React.useCallback(() => {
    setDialog(null)
  }, [])

  const value = React.useMemo(
    () => ({ dialog, openDialog, closeDialog }),
    [dialog, openDialog, closeDialog]
  )

  return (
    <Provider value={value}>
      {children}
      {dialog && <Dialog {...dialog} />}
    </Provider>
  )
}

export { useContext as useDialog, DialogContextProvider }
