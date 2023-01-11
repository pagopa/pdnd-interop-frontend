import { TopSideActions } from '@/components/layout/containers/PageContainer'
import { FE_LOGIN_URL, isDevelopment } from '@/config/env'
import { ActionItem } from '@/types/common.types'
import { ButtonProps } from '@mui/material'
import noop from 'lodash/noop'

export function goToLoginPage() {
  window.location.assign(FE_LOGIN_URL)
  return
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

export async function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const logger = Object.keys(console).reduce((prev, next) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return { ...prev, [next]: isDevelopment ? console[next] : noop }
}, {}) as Console
