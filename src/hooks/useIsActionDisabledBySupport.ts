import React from 'react'

const SupportActionGuardContext = React.createContext(false)

type SupportActionGuardProviderProps = {
  isSupport: boolean
  children: React.ReactNode
}

export const SupportActionGuardProvider: React.FC<SupportActionGuardProviderProps> = ({
  isSupport,
  children,
}) => {
  return React.createElement(SupportActionGuardContext.Provider, { value: isSupport }, children)
}

export function useIsActionDisabledBySupport(disabled?: boolean) {
  const isSupport = useIsSupportActionGuardEnabled()

  return isSupport ? true : disabled
}

export function useIsSupportActionGuardEnabled() {
  return React.useContext(SupportActionGuardContext)
}
