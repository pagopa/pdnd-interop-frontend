import React from 'react'
import type { TopSideActions } from '@/components/layout/containers/PageContainer'
import type { ActionItem, OneTrustContent } from '@/types/common.types'
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

/**
 * Check if the session has expired.
 * @param exp The exp value of the JWT token
 * @returns True if the session has expired, otherwise false
 */
export function hasSessionExpired(exp?: number) {
  return exp && new Date() > new Date(exp * 1000)
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

/**
 * This function is used to parse the html json to a ReactNode.
 * We use this approach to avoid the use of dangerouslySetInnerHTML.
 * @param json the html json
 * @param route the current route
 * @returns the ReactNode
 */
export const parseHtmlJsonToReactNode = (
  json: OneTrustContent.Node,
  route: string
): React.ReactNode => {
  function decodeHtml(html: string): string {
    const txt = document.createElement('textarea')
    txt.innerHTML = html
    return txt.value
  }

  switch (json.node) {
    case 'root':
      return React.createElement(
        React.Fragment,
        {},
        json.child.map((item) => parseHtmlJsonToReactNode(item, route))
      )
    case 'element':
      const filteredAttr: Record<string, unknown> = {
        id: json.attr?.id,
        href: json.attr?.href,
        target: json.attr?.target,
        rel: Array.isArray(json.attr?.rel) ? json.attr?.rel.join(' ') : json.attr?.rel,
      }
      /**
       * During the anchor navigation the root path will be lost.
       * To avoid that behaviour we put the path behind the anchor in the href
       */
      if (filteredAttr.href && (filteredAttr.href as string).startsWith('#', 0)) {
        if (route.startsWith('/', 0)) {
          const path = route.substring(1)
          filteredAttr.href = `${path}${filteredAttr.href}`
        }
      }
      return React.createElement(
        json.tag,
        /**
         * We can accept here to use a random number as a node key because we are generating
         * static content and we don't expect to have much re-rendering (if any).
         */
        { ...filteredAttr, key: Math.random() },
        json.child ? json.child.map((item) => parseHtmlJsonToReactNode(item, route)) : undefined
      )
    case 'text':
      return decodeHtml(json.text)
    default:
      break
  }
}
