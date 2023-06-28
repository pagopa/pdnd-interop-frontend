import React from 'react'
import type { TopSideActions } from '@/components/layout/containers/PageContainer'
import type { ActionItem } from '@/types/common.types'
import type { ButtonProps } from '@mui/material'
import { getKeys } from '@/utils/array.utils'
import isEqual from 'lodash/isEqual'

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

/**
 * Compare the first object with the second passed object.
 * If all the values in the first object are equal to the values in the second object
 * at the same key, return true, otherwise false.
 *
 * @param object
 * @param objectToCompare
 * @returns True if the second object has the same keys and values as the first object, otherwise false
 */
export function compareObjects<
  TObjectToCompare extends object,
  TObject extends { [TKey in keyof TObjectToCompare]?: unknown }
>(object: TObject, objectToCompare: TObjectToCompare) {
  return getKeys(object).every((key) =>
    isEqual(object[key], objectToCompare[key as keyof TObjectToCompare])
  )
}
