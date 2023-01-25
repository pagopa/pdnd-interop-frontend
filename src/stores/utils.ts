import React from 'react'

export function createSafeContext<ContextValue>(name: string, defaultValue: ContextValue) {
  const context = React.createContext<ContextValue>(defaultValue)
  context.displayName = name
  function useContext() {
    const c = React.useContext(context)
    if (c === undefined) {
      throw new Error(`${name} context called outside provider boundary`)
    }
    return c
  }
  return {
    useContext,
    Provider: context.Provider,
  } as const
}
