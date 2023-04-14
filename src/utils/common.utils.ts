import type { TopSideActions } from '@/components/layout/containers/PageContainer'
import type { ActionItem } from '@/types/common.types'
import type { ButtonProps } from '@mui/material'
import React from 'react'

/**
 * Top side actions are formatted with the first action as a button, and the
 * rest inside of an actionMenu.
 */
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

export function createContext<ContextValue>(name: string, defaultValue: ContextValue) {
  const context = React.createContext<ContextValue>(defaultValue)
  context.displayName = name
  const useContext = () => React.useContext<ContextValue>(context)
  return {
    useContext,
    Provider: context.Provider,
  } as const
}
