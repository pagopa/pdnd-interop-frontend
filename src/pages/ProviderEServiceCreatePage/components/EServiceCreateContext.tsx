import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type { ProducerEServiceDescriptor, ProducerEServiceDetails } from '@/api/api.generatedTypes'

type EServiceCreateContextType = {
  eservice: ProducerEServiceDetails | ProducerEServiceDescriptor['eservice'] | undefined
  descriptor: ProducerEServiceDescriptor | undefined
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
  eservice: ProducerEServiceDetails | ProducerEServiceDescriptor['eservice'] | undefined
  descriptor: ProducerEServiceDescriptor | undefined
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
