import React from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type { ProducerEServiceDescriptor, ProducerEServiceDetails } from '@/api/api.generatedTypes'

type EServiceCreateContextType = {
  eservice: ProducerEServiceDetails | ProducerEServiceDescriptor['eservice'] | undefined
  descriptor: ProducerEServiceDescriptor | undefined
  back: VoidFunction
  forward: VoidFunction
}

const initialState: EServiceCreateContextType = {
  eservice: undefined,
  descriptor: undefined,
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
  back: VoidFunction
  forward: VoidFunction
}

const EServiceCreateContextProvider: React.FC<EServiceCreateContextProviderProps> = ({
  children,
  eservice,
  descriptor,
  back,
  forward,
}) => {
  const providerValue = React.useMemo(() => {
    return { eservice, descriptor, back, forward }
  }, [eservice, descriptor, back, forward])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceCreateContext, EServiceCreateContextProvider }
