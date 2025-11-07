import React from 'react'
import { createContext } from '@/utils/common.utils'

type PurposeType = 'creator' | 'consumer'
type PurposeCreateContextType = {
  type?: PurposeType
  isFromPurposeTemplate?: boolean
}

const { useContext, Provider } = createContext<PurposeCreateContextType>('PurposeCreateContext', {})

type PurposeCreateContextProviderProps = {
  children: React.ReactNode
  type?: PurposeType
  isFromPurposeTemplate?: boolean
}

const PurposeCreateContextProvider: React.FC<PurposeCreateContextProviderProps> = ({
  children,
  isFromPurposeTemplate,
  type,
}) => {
  const providerValue = React.useMemo(
    () => ({
      type,
      isFromPurposeTemplate,
    }),
    [isFromPurposeTemplate, type]
  )

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as usePurposeCreateContext, PurposeCreateContextProvider }
