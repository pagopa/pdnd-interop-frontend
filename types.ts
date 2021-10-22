import { AxiosRequestConfig, Method } from 'axios'
import React from 'react'
import {
  AGREEMENT_STATUS_LABEL,
  API,
  ATTRIBUTE_TYPE_LABEL,
  CLIENT_STATUS_LABEL,
  ESERVICE_STATUS_LABEL,
} from './src/lib/constants'

/*
 * Fetch data and router related types
 */
export type ApiEndpointKey = keyof typeof API

export type ApiEndpointContent = {
  URL: string
  METHOD: Method
}

export type Endpoint = {
  endpoint: ApiEndpointKey
  endpointParams?: any
}

export type RequestConfig = {
  path: Endpoint
  config?: AxiosRequestConfig
}

export type RoutesObject = { [key: string]: RouteConfig }

export type RouteAuthLevel = 'any' | UserPlatformRole[]

export type RouteConfig = {
  PATH: string
  LABEL: string
  EXACT?: boolean
  SUBROUTES?: RoutesObject
  COMPONENT: React.FunctionComponent<any>
  PUBLIC: boolean
  AUTH_LEVELS?: RouteAuthLevel
}

export type Image = { src: string; alt: string }
export type RequestOutcome = 'success' | 'error'
export type RequestOutcomeMessage = { title: string; description: JSX.Element[]; img: Image }
export type RequestOutcomeOptions = { [key in RequestOutcome]: RequestOutcomeMessage }

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
  data?: any
}

export type StepperStep = {
  label: string
  component: any
}

export type IPACatalogParty = {
  description: string
  digitalAddress: string
  id: string
  managerName: string
  managerSurname: string
  o?: string
  ou?: string
  aoo?: string
}

/*
 * Platform user and party
 */
// TEMP BACKEND: this weird typing is due to the discrepancies between two data models in the backend
export type UserStatus = 'pending' | 'active' | 'suspended'
export type UserRole = 'Manager' | 'Delegate' | 'Operator'
export type UserPlatformRole = 'admin' | 'security' | 'api'

export type UserOnCreate = {
  name: string
  surname: string
  taxCode: string // This should not be optional, it is temporarily because of the "from" below
  from?: string // This is temporary, part of the API shared with self-care
  email: string
  role: UserRole
  platformRole: UserPlatformRole
}

export type User = UserOnCreate & {
  status: UserStatus
}

export type PartyOnCreate = {
  description: string
  institutionId: string
  digitalAddress: string
}

export type Party = PartyOnCreate & {
  status: UserStatus
  role: UserRole
  platformRole: UserPlatformRole
  partyId?: string
  attributes: string[]
}

/*
 * EService
 */
export type EServiceStatus = keyof typeof ESERVICE_STATUS_LABEL
export type EServiceStatusLabel = Record<EServiceStatus, string>

// EServices are subdivided into their write and read type
// The write is for when data is POSTed to the backend
// The read, when data is returned from the backend

// Some types are shared between the two
export type EServiceDocumentKind = 'interface' | 'document'
export type EServiceTechnologyType = 'REST' | 'SOAP'

// Making this as explicit as possible. It might be that there is an eserviceId,
// but not a descriptorId. This happens when I've just created a new service,
// but not yet created a descriptor for it. This leads to 'prima-bozza' being used
// in the page URL to identify this peculiar case
export type EServiceNoDescriptorId = 'prima-bozza'

// Write only
export type EServiceWriteType = {
  id: string
  name: string
  version: string
  status: EServiceStatus
  descriptors: EServiceDescriptorWrite[]
}

export type EServiceDocumentWrite = {
  kind: EServiceDocumentKind
  description: string
  doc: any // File
}

export type EServiceDescriptorWrite = {
  id: string
  status: EServiceStatus
  docs: EServiceDocumentWrite[]
  interface: EServiceDocumentWrite
  version: string
}

export type EServiceCreateDataType = {
  producerId: string
  name: string
  description: string
  technology: EServiceTechnologyType
  pop: boolean
}

// Read only
export type EServiceFlatReadType = {
  name: string
  id: string
  producerId: string
  producerName: string
  descriptorId?: string
  status?: EServiceStatus
  version?: string
  callerSubscribed?: string
  certifiedAttributes: BackendAttribute[]
}

export type EServiceFlatDecoratedReadType = EServiceFlatReadType & {
  amISubscribed: boolean
  isMine: boolean
}

type EServiceReadProducerType = {
  id: string
  name: string
}

export type EServiceReadType = {
  producer: EServiceReadProducerType
  name: string
  description: string
  technology: EServiceTechnologyType
  attributes: BackendAttributes
  id: string
  status: EServiceStatus
  descriptors: EServiceDescriptorRead[]
  activeDescriptor?: EServiceDescriptorRead // TEMP Refactor : this is added by the client
}

export type EServiceDescriptorRead = {
  id: string
  status: EServiceStatus
  docs: EServiceDocumentRead[]
  interface: EServiceDocumentRead
  version: string
  voucherLifespan: number
  description: string
  audience: string[]
}

export type EServiceDocumentRead = {
  contentType: string
  description: string
  id: string
  name: string
}

/*
 * Agreement
 */
export type AgreementStatus = keyof typeof AGREEMENT_STATUS_LABEL

export type AgreementVerifiableAttribute = {
  id: string
  verificationDate: string
  verified: boolean

  // Backend doesn't send it for now
  name?: string
}

type AgreementProducerAndConsumer = {
  name: string
  id: string
}

type AgreementEService = {
  name: string
  id: string
  descriptorId: string
  version: string
  status?: EServiceStatus
  activeDescriptor: AgreementEService
}

export type AgreementSummary = {
  id: string
  status: AgreementStatus
  eservice: AgreementEService
  eserviceDescriptorId: string
  consumer: AgreementProducerAndConsumer
  producer: AgreementProducerAndConsumer
  attributes: BackendAttribute[]
  suspendedByProducer?: boolean
  suspendedBySubscriber?: boolean
}

/*
 * Client
 */
export type ClientStatus = keyof typeof CLIENT_STATUS_LABEL

type ClientEServiceDescriptor = {
  id: string
  status: EServiceStatus
  version: string
}

type ClientEService = {
  id: string
  name: string
  provider: ClientProvider
  // activeDescriptor will only be available if the e-service has one published version
  // For example, if the latest version of the e-service is suspended (and by default
  // the previous version is deprecated), there will not be an activeDescriptor available
  activeDescriptor?: ClientEServiceDescriptor
}

type ClientAgreement = {
  id: string
  status: AgreementStatus
  descriptor: ClientEServiceDescriptor
}

type ClientProvider = {
  institutionId: string
  description: string
}

export type Client = {
  id: string
  name: string
  description: string
  status: ClientStatus
  agreement: ClientAgreement
  eservice: ClientEService
  purposes: string
}

/*
 * Attributes
 */
export type AttributeModalTemplate = 'add' | 'create'

export type AttributeType = keyof typeof ATTRIBUTE_TYPE_LABEL

// Backend attribute is the attribute as it is expected when POSTed to the backend
export type BackendAttributeContent = {
  id: string
  explicitAttributeVerification: boolean
  verified: boolean
  origin: string
  code: string
  name: string
  description: string
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
 * Dialog, loader and toast components typings
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
  isMock: boolean // TEMP PoC
}

export type DialogProps = DialogContent & {
  proceedCallback: ActionFunction
  close: VoidFunction
  disabled?: boolean
}

export type DialogContent = {
  title?: string
  children?: React.ReactNode
}

export type DialogActionKeys = Exclude<
  ApiEndpointKey,
  'AGREEMENT_VERIFY_ATTRIBUTE' | 'AGREEMENT_CREATE'
>

export type ToastContent = {
  title?: string
  description?: string | JSX.Element
}

export type ToastContentWithOutcome = ToastContent & {
  outcome: RequestOutcome
}

export type ToastProps = ToastContentWithOutcome & {
  onClose: VoidFunction
}

export type ToastActionKeys = ApiEndpointKey // Exclude<ApiEndpointKey, ''>

export type LoaderType = 'global' | 'contextual'

/*
 * Action buttons in tables
 */
export type ActionWithTooltipBtn = {
  onClick: ActionFunction
  icon?: string
  label: string
  isMock?: boolean
}
export type ActionWithTooltipLink = {
  to: string
  icon?: string
  label: string
  isMock?: boolean
}
export type ActionWithTooltipProps = ActionWithTooltipBtn | ActionWithTooltipLink
