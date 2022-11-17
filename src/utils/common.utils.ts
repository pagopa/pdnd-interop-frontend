import { TopSideActions } from '@/components/layout/containers/PageContainer'
import { FE_LOGIN_URL } from '@/config/env'
import { ActionItem } from '@/types/common.types'
import { ButtonProps } from '@mui/material'

export function goToLoginPage() {
  window.location.assign(FE_LOGIN_URL)
  return
}

export function downloadFile(responseData: string, filename = 'download') {
  const blob = new Blob([responseData], { type: 'application/octet-stream' })
  // Create a pointer to the local memory where the blob is temporarily stored
  const href = window.URL.createObjectURL(blob)
  // Create link to append to the DOM, it will be clicked programmatically
  // to initiate file download
  const link = document.createElement('a')
  link.setAttribute('download', filename)
  // Set the link href to the local memory pointer
  link.setAttribute('href', href)
  document.body.appendChild(link)
  link.click()
  // Remove link
  document.body.removeChild(link)
  // Release memory
  URL.revokeObjectURL(link.href)
}

export function formatTopSideActions(
  actions: Array<ActionItem>,
  buttonProps?: Omit<ButtonProps, keyof ActionItem | 'onClick'>
): TopSideActions | undefined {
  return actions.length > 0
    ? {
        buttons: [{ ...actions[0], ...buttonProps }],
        actionMenu: actions.slice(1).length > 0 ? actions.slice(1) : undefined,
      }
    : undefined
}
