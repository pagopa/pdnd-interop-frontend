import React from 'react'
import { createContext } from '@/utils/common.utils'
import type { EServiceDescriptorProvider, EServiceRead } from '@/types/eservice.types'
import noop from 'lodash/noop'

type EServiceCreateContextType = {
  eservice: EServiceRead | EServiceDescriptorProvider['eservice'] | undefined
  descriptor: EServiceDescriptorProvider | undefined
  isNewEService: boolean
  back: VoidFunction
  forward: VoidFunction
}

const initialState: EServiceCreateContextType = {
  eservice: undefined,
  descriptor: undefined,
  isNewEService: false,
  back: noop,
  forward: noop,
}

const { useContext, Provider } = createContext<EServiceCreateContextType>(
  'EServiceCreateContext',
  initialState
)

type EServiceCreateContextProviderProps = {
  children: React.ReactNode
  eservice: EServiceRead | EServiceDescriptorProvider['eservice'] | undefined
  descriptor: EServiceDescriptorProvider | undefined
  isNewEService: boolean
  back: VoidFunction
  forward: VoidFunction
}

const EServiceCreateContextProvider: React.FC<EServiceCreateContextProviderProps> = ({
  children,
  eservice,
  descriptor,
  isNewEService,
  back,
  forward,
}) => {
  const providerValue = React.useMemo(() => {
    return { eservice, descriptor, isNewEService, back, forward }
  }, [eservice, descriptor, isNewEService, back, forward])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceCreateContext, EServiceCreateContextProvider }
