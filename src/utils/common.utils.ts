import React from 'react'
import type { OneTrustContent } from '@/types/common.types'
import { getKeys } from '@/utils/array.utils'
import isEqual from 'lodash/isEqual'
import { STAGE } from '@/config/env'

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
  TObject extends { [TKey in keyof TObjectToCompare]?: unknown },
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

class ExponentialInterval {
  #action: VoidFunction
  #duration: number

  #isActive = true
  #numRetry = 1
  #totalWaitTime = 0
  #_promise: Promise<void> | undefined

  constructor(action: VoidFunction, duration: number) {
    this.#action = action
    this.#duration = duration

    this.#_promise = this.#start()
  }

  #getTimeoutMs() {
    return 2 ** (this.#numRetry + 1) * 100
  }

  async #start() {
    while (this.#isActive && this.#totalWaitTime < this.#duration) {
      const timeoutMs = this.#getTimeoutMs()
      this.#totalWaitTime += timeoutMs
      await waitFor(timeoutMs)
      if (!this.#isActive) return
      this.#numRetry += 1
      this.#action()
    }
  }

  cancel() {
    this.#isActive = false
  }
}

const exponentialIntervalInstances = new Map()

export function setExponentialInterval(action: VoidFunction, duration: number) {
  const instanceId = crypto.randomUUID()
  const newInstance = new ExponentialInterval(action, duration)
  exponentialIntervalInstances.set(instanceId, newInstance)
  return instanceId
}

export function clearExponentialInterval(instanceId: string | undefined) {
  if (!instanceId) return
  const instance = exponentialIntervalInstances.get(instanceId)

  if (instance) {
    instance.cancel()
    exponentialIntervalInstances.delete(instanceId)
  }
}

export function getCurrentSelfCareProductId() {
  switch (STAGE) {
    case 'PROD':
      return 'prod-interop'
    case 'ATT':
      return 'prod-interop-atst'
    case 'UAT':
      return 'prod-interop-coll'
    // DEV and QA are actually irrelevant. They are set to "prod-interop"
    // just to avoid breaking the product dropdown in the UI
    case 'DEV':
    case 'QA':
      return 'prod-interop'
    // If the STAGE value is unmapped here, log a warning and
    // set the value to "prod-interop" to avoid breaking the UI
    default:
      console.warn(`The value "${STAGE}" of STAGE is not mapped`)
      return 'prod-interop'
  }
}
