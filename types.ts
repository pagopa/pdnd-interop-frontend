import { AxiosRequestConfig } from 'axios'
import React from 'react'
import { AGREEMENT_STATUS, API, ESERVICE_STATUS } from './src/lib/constants'

/*
 * EService
 */
export type EServiceStatus = keyof typeof ESERVICE_STATUS
export type EServiceStatusLabel = Record<EServiceStatus, string>

export type EServiceSummary = {
  id: string
  name: string
  version: number
  status: EServiceStatus
  descriptors: EServiceDescriptor[]
}

export type EServiceDocumentKind = 'interface' | 'document'
export type EServiceDocumentType = {
  kind: EServiceDocumentKind
  description?: string
  doc: any // File
}

export type EServiceDescriptor = {
  id: string
  status: EServiceStatus
  docs: EServiceDocumentType[]
  version: string
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
  | 'version'
  | 'audience'
  | 'technology'
  | 'pop'
  | 'voucherLifespan'
  | 'description'

/*
 * Agreement
 */
export type AgreementStatus = keyof typeof AGREEMENT_STATUS

export type AgreementVerifiableAttribute = {
  id: string
  verificationDate: string
  verified: boolean

  // Backend doesn't send it for now
  name?: string
}

export type AgreementSummary = {
  id: string
  status: AgreementStatus
  eserviceId: string
  consumerId: string
  producerId: string
  verifiedAttributes: AgreementVerifiableAttribute[]

  // Backend doesn't send them for now
  producerName?: string
  consumerName?: string
  eserviceName?: string
  eserviceVersion?: string
}

/*
 * Client
 */
export type Client = {
  id: string
  name: string
  description: string
  providerName: string
  serviceName: string
  serviceId: string
  serviceDescriptorId: string
  serviceVersion: string
  serviceStatus: EServiceStatus
  agreementStatus: AgreementStatus
}

/*
 * Attributes
 */
export type AttributeModalTemplate = 'add' | 'create'

export type AttributeType = 'certified' | 'verified' | 'declared'

// Backend attribute is the attribute as it is expected when POSTed to the backend
export type BackendAttributeContent = {
  id: string
  explicitAttributeVerification: boolean
}
export type SingleBackendAttribute = {
  single: BackendAttributeContent
}
export type GroupBackendAttribute = {
  group: BackendAttributeContent[]
}
export type BackendAttribute = SingleBackendAttribute | GroupBackendAttribute
export type BackendAttributes = {
  [key in AttributeType]: BackendAttribute[]
}

// Catalog attribute as it comes from the attributes catalog
export type CatalogAttribute = {
  certified: boolean
  creationTime: string
  description: string
  id: string
  name: string
  code?: string
  origin?: 'IPA'
}

// Frontend attribute as it is needed to display it in the UI
// (basically the id used by the backend is not enough, it also needs the description, etc).
// Also, it needs to be in array form to display it into a table, and the explicitAttributeVerification
// must only come once per group
export type FrontendAttribute = {
  attributes: CatalogAttribute[]
  explicitAttributeVerification: boolean
}
export type FrontendAttributes = {
  [key in AttributeType]: FrontendAttribute[]
}

/*
 * Dialog and toast components typings
 * Here because they reflect onto React state updates
 */
export type ActionFunction = ((event?: any) => Promise<void>) | VoidFunction

export type RunActionProps = {
  loadingText: string
  success: ToastContent
  error: ToastContent
}

export type WrappableAction = {
  proceedCallback: ActionFunction
  label: string
  isMock: boolean // Temp to mark which actions are still to be developed
}

export type DialogContent = {
  proceedCallback: ActionFunction
  close: VoidFunction
}

export type ToastContent = {
  title: string
  description: string | JSX.Element
}

export type ToastProps = ToastContent & {
  onClose: VoidFunction
}

/*
 * Action buttons in tables
 */
export type TableActionBtn = {
  onClick: ActionFunction
  icon: string
  label: string
  isMock?: boolean
}
export type TableActionLink = {
  to: string
  icon: string
  label: string
  isMock?: boolean
}
export type TableActionProps = TableActionBtn | TableActionLink

/*
 * Fetch data and router related types
 */
export type ApiEndpointKey = keyof typeof API

export type Endpoint = {
  endpoint: ApiEndpointKey
  endpointParams?: any
}

export type RequestConfig = {
  path: Endpoint
  config: AxiosRequestConfig
}

export type RoutesObject = { [key: string]: RouteConfig }

export type RouteConfig = {
  PATH: string
  LABEL: string
  EXACT?: boolean
  SUBROUTES?: RoutesObject
  COMPONENT?: React.FunctionComponent<any>
}

export type Image = { src: string; alt: string }
export type RequestOutcome = 'success' | 'error'
export type RequestOutcomeMessage = { title: string; description: JSX.Element[]; img: Image }
export type RequestOutcomeOptions = { [key in RequestOutcome]: RequestOutcomeMessage }

/*
 * Logs
 */
export type SingleLogType = 'Router' | 'API'
export type DisplayLogsType = null | 'all' | SingleLogType[]

/*
 * Mode
 */
export type Provider = 'provider'
export type Subscriber = 'subscriber'
export type ProviderOrSubscriber = Provider | Subscriber

/*
 * Onboarding component
 */
export type StepperStepComponentProps = {
  forward?: any
  back?: VoidFunction
  updateFormData?: React.Dispatch<React.SetStateAction<any>>
}

export type StepperStep = {
  label: string
  Component: React.FunctionComponent<StepperStepComponentProps>
}

export type IPACatalogParty = {
  description: string
  digitalAddress: string
  id: string
  managerName: string
  managerSurname: string
  o: string
  ou: string
}

/*
 * Platform user and party
 */
export type UserStatus = 'active' | 'suspended'
export type UserRole = 'Manager' | 'Delegate'
export type UserPlatformRole = 'admin' | 'security' | 'api'

export type User = {
  name: string
  surname: string
  taxCode: string
  email: string
  role?: UserRole
  platformRole: UserPlatformRole
  status: UserStatus
}

export type Party = {
  status: 'Pending'
  description: string
  institutionId: string
  digitalAddress: string
  partyId?: string
  role?: UserPlatformRole
}
