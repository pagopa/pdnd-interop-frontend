import React from 'react'
import { createSafeContext } from '@/contexts/utils'
import { EServiceReadType } from '@/types/eservice.types'
import noop from 'lodash/noop'

type EServiceCreateContextType = {
  eservice: EServiceReadType | undefined
  isNewEService: boolean
  back: VoidFunction
  forward: VoidFunction
}

const initialState: EServiceCreateContextType = {
  eservice: undefined,
  isNewEService: false,
  back: noop,
  forward: noop,
}

const { useContext, Provider } = createSafeContext<EServiceCreateContextType>(
  'EServiceCreateContext',
  initialState
)

type EServiceCreateContextProviderProps = {
  children: React.ReactNode
  eservice: EServiceReadType | undefined
  isNewEService: boolean
  back: VoidFunction
  forward: VoidFunction
}

const EServiceCreateContextProvider: React.FC<EServiceCreateContextProviderProps> = ({
  children,
  eservice,
  isNewEService,
  back,
  forward,
}) => {
  const providerValue = React.useMemo(() => {
    return { eservice, isNewEService, back, forward }
  }, [eservice, isNewEService, back, forward])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceCreateContext, EServiceCreateContextProvider }
