import { useContext } from 'react'
import { DialogContext, TableActionMenuContext } from '../lib/context'

export const useCloseDialog = () => {
  const { setDialog } = useContext(DialogContext)
  const { setTableActionMenu } = useContext(TableActionMenuContext)

  const closeDialog = () => {
    setDialog(null)
    // Close any table action that might be open
    setTableActionMenu(null)
  }

  return { closeDialog }
}
