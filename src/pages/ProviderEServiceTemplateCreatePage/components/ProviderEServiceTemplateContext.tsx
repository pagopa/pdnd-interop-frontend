import type { FC, ReactNode } from 'react'
import { useMemo } from 'react'
import { createContext } from '@/utils/common.utils'
import noop from 'lodash/noop'
import type { EServiceMode, EServiceTemplateVersionDetails } from '@/api/api.generatedTypes'

type EServiceTemplateCreateContextType = {
  templateVersion: EServiceTemplateVersionDetails | undefined
  eserviceTemplateMode: EServiceMode
  onEserviceTemplateModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
  areEServiceTemplateGeneralInfoEditable: boolean
}

const initialState: EServiceTemplateCreateContextType = {
  templateVersion: undefined,
  eserviceTemplateMode: 'DELIVER',
  onEserviceTemplateModeChange: noop,
  back: noop,
  forward: noop,
  areEServiceTemplateGeneralInfoEditable: true,
}

const { useContext, Provider } = createContext<EServiceTemplateCreateContextType>(
  'EServiceTemplateCreateContext',
  initialState
)

type EServiceTemplateCreateContextProviderProps = {
  children: ReactNode
  templateVersion: EServiceTemplateVersionDetails | undefined
  eserviceTemplateMode: EServiceMode
  onEserviceTemplateModeChange: (value: EServiceMode) => void
  back: VoidFunction
  forward: VoidFunction
}

const EServiceTemplateCreateContextProvider: FC<EServiceTemplateCreateContextProviderProps> = ({
  children,
  templateVersion,
  eserviceTemplateMode,
  onEserviceTemplateModeChange,
  back,
  forward,
}) => {
  const providerValue = useMemo(() => {
    const areEServiceTemplateGeneralInfoEditable = Boolean(
      // case 1: new e-service template
      !templateVersion ||
        // case 3: already existing service template and version, but version is 1 and still a draft
        (templateVersion && templateVersion.version === 1 && templateVersion.state === 'DRAFT')
    )

    return {
      templateVersion,
      eserviceTemplateMode,
      onEserviceTemplateModeChange,
      areEServiceTemplateGeneralInfoEditable,
      back,
      forward,
    }
  }, [templateVersion, eserviceTemplateMode, onEserviceTemplateModeChange, back, forward])

  return <Provider value={providerValue}>{children}</Provider>
}

export { useContext as useEServiceTemplateCreateContext, EServiceTemplateCreateContextProvider }
