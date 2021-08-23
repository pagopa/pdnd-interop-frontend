import React from 'react'
import { API, ESERVICE_STATUS } from './src/lib/constants'

export type UserRole = 'manager' | 'delegate'

export type User = {
  name: string
  surname: string
  taxCode: string
  email: string
  role?: UserRole
}

export type Party = {
  status: 'Pending'
  description: string
  institutionId: string
  digitalAddress: string
}

export type Provider = 'provider'
export type Subscriber = 'subscriber'
export type ProviderOrSubscriber = Provider | Subscriber

export type ApiEndpointKey = keyof typeof API
export type RoutesObject = { [key: string]: RouteConfig }
export type RouteConfig = {
  PATH: string
  LABEL: string
  EXACT?: boolean
  SUBROUTES?: RoutesObject
  COMPONENT?: React.FunctionComponent<any>
}

export type StepperStepComponentProps = {
  forward?: any
  back?: () => void
  updateFormData?: React.Dispatch<React.SetStateAction<any>>
}

export type StepperStep = {
  label: string
  Component: React.FunctionComponent<StepperStepComponentProps>
}

export type IPAParty = {
  description: string
  digitalAddress: string
  id: string
  managerName: string
  managerSurname: string
  o: string
  ou: string
}

export type SingleLogType = 'Router' | 'API'
export type DisplayLogsType = null | 'all' | SingleLogType[]

export type Image = { src: string; alt: string }
export type Outcome = { title: string; description: JSX.Element[]; img: Image }
export type Outcomes = { [key: number]: Outcome }

export type EServiceStatus = keyof typeof ESERVICE_STATUS
export type EServiceStatusLabel = Record<EServiceStatus, string>

export type EServiceSummary = {
  id: string
  name: string
  version: number
  status: EServiceStatus
}

export type StyledInputTextType = 'text' | 'email'

export type EServiceDocumentKind = 'interface' | 'document'
export type EServiceDocumentType = {
  kind: EServiceDocumentKind
  description?: string
  file: any // File
}

export type EServiceDataType = {
  name?: string
  version?: number
  audience: string[]
  description?: string
  // serviceId?: string
  technology: 'REST' | 'SOAP'
  pop: boolean
  voucherLifespan: number
}

export type EServiceDataTypeKeys =
  | 'name'
  | 'version' /* | 'serviceId' */
  | 'technology'
  | 'pop'
  | 'voucherLifespan'

export type EServiceAttribute =
  | {
      simple: string
    }
  | {
      group: string[]
    }

export type EServiceAttributes = {
  certified: EServiceAttribute[]
  declared: EServiceAttribute[]
  verified: EServiceAttribute[]
}
