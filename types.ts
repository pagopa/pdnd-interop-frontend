import React, { FunctionComponent } from 'react'
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import { API } from './src/config/api-endpoints'
import {
  AGREEMENT_STATUS_LABEL,
  CLIENT_STATUS_LABEL,
  ESERVICE_STATUS_LABEL,
} from './src/config/labels'
import { Control, FieldValues, UseFormGetValues, UseFormWatch } from 'react-hook-form'

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
  endpointParams?: Record<string, string | number | null | undefined>
}

export type RequestConfig = {
  path: Endpoint
  config?: AxiosRequestConfig
}

export type RouteAuthLevel = 'any' | Array<UserPlatformRole>

export type BasicRouteConfig = {
  PATH: string
  LABEL: string
  EXACT?: boolean
  COMPONENT: React.FunctionComponent<unknown>
  REDIRECT?: string
  PUBLIC: boolean
  AUTH_LEVELS?: RouteAuthLevel
}

export type RouteConfig = BasicRouteConfig & {
  SUBROUTES?: Record<string, RouteConfig>
  SPLIT_PATH: Array<string>
  PARENTS?: Array<RouteConfig>
}

export type Image = { src: string; alt: string }
export type RequestOutcome = 'success' | 'error'
export type RequestOutcomeMessage = { title: string; description: JSX.Element; img: Image }
export type RequestOutcomeOptions = Record<RequestOutcome, RequestOutcomeMessage>

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
  forward: (e?: React.SyntheticEvent, data?: Record<string, unknown>) => void
  back: () => void
  data: Record<string, unknown>
}

export type StepperStep = {
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ElementType<StepperStepComponentProps & any>
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

type UserExtraInfo = {
  email: string
  birthDate: string
}

export type UserOnCreate = {
  name: string
  surname: string
  externalId: string
  certification: string
  extras: UserExtraInfo

  // All the below should disappear, now keeping them while WIP upgrading all the API calls
  taxCode?: string
  from?: string
  email?: string
  role?: UserRole
  platformRole?: UserPlatformRole
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
  attributes: Array<string>
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
  descriptors: Array<EServiceDescriptorWrite>
}

export type EServiceDocumentWrite = {
  kind: EServiceDocumentKind
  description: string
  doc: File
}

export type EServiceDescriptorWrite = {
  id: string
  status: EServiceStatus
  docs: Array<EServiceDocumentWrite>
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
  certifiedAttributes: Array<BackendAttribute>
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
  descriptors: Array<EServiceDescriptorRead>
  activeDescriptor?: EServiceDescriptorRead // TEMP Refactor : this is added by the client
}

export type EServiceDescriptorRead = {
  id: string
  status: EServiceStatus
  docs: Array<EServiceDocumentRead>
  interface: EServiceDocumentRead
  version: string
  voucherLifespan: number
  description: string
  audience: Array<string>
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
  status: EServiceStatus
  activeDescriptor?: AgreementEService
}

export type AgreementSummary = {
  id: string
  status: AgreementStatus
  eservice: AgreementEService
  eserviceDescriptorId: string
  consumer: AgreementProducerAndConsumer
  producer: AgreementProducerAndConsumer
  attributes: Array<BackendAttribute>
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
 * Public keys
 */
export type SecurityOperatorPublicKey = {
  kid: string
}

/*
 * Attributes
 */
export type AttributeKey = 'certified' | 'verified' | 'declared'

export type AttributeModalTemplate = 'add' | 'create'

// Backend attribute is the attribute as it is expected when POSTed to the backend
// The "explicitAttributeVerification" and "verified" parameters
// are only relevant for "verified" attributes. The explicitAttributeVerification
// is not actively used by the frontend. The provider sets it the first time it creates an e-service,
// and then it is only used as a read only value. In each Agreement, a verified attributes whose
// "verified" value is set to null, identifies an attribute which needs to be manually validated
// by the provider before an agreement can be activated. The only exception is for a GroupBackendAttribute,
// where it is enough that one of the attributes has the "verified" flag set to true.
// If an attribute has a "verified" parameter explicitly set to false, it means that the attribute validation
// was rejected by the e-service provider, which means that this Agreement can never be activated
export type BackendAttributeContent = {
  id: string
  explicitAttributeVerification: boolean
  verified: boolean | null
  origin: string
  code: string
  name: string
  description: string
}
export type SingleBackendAttribute = {
  single: BackendAttributeContent
}
export type GroupBackendAttribute = {
  group: Array<BackendAttributeContent>
}
export type BackendAttribute = SingleBackendAttribute | GroupBackendAttribute
export type BackendAttributes = Record<AttributeKey, Array<BackendAttribute>>

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
  attributes: Array<CatalogAttribute>
  explicitAttributeVerification: boolean
}
export type FrontendAttributes = Record<AttributeKey, Array<FrontendAttribute>>

/*
 * Dialog, loader and toast components typings
 * Here because they reflect onto React state updates
 */
export type ActionFunction = any // eslint-disable-line @typescript-eslint/no-explicit-any

export type RunActionProps = {
  loadingText: string
  success?: ToastContent
  error?: ToastContent
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
  maxWidth?: MUISize
}

export type DialogContent = {
  title?: string
  // Use this field if it's only a textual description
  description?: string
  // Use this other field if you must pass a component
  // (e.g. put a form to validate inside the dialog)
  Contents?: FunctionComponent<RHFProps>
}

export type DialogActionKeys = Exclude<
  ApiEndpointKey,
  | 'AGREEMENT_VERIFY_ATTRIBUTE'
  | 'AGREEMENT_CREATE'
  | 'ONBOARDING_GET_AVAILABLE_PARTIES'
  | 'ONBOARDING_GET_SEARCH_PARTIES'
  | 'ONBOARDING_POST_LEGALS'
  | 'ONBOARDING_COMPLETE_REGISTRATION'
  | 'ESERVICE_GET_LIST'
  | 'ESERVICE_GET_LIST_FLAT'
  | 'ESERVICE_GET_SINGLE'
  | 'OPERATOR_API_GET_LIST'
  | 'OPERATOR_API_GET_SINGLE'
  | 'OPERATOR_API_CREATE'
  | 'ATTRIBUTES_GET_LIST'
  | 'ATTRIBUTE_CREATE'
  | 'PARTY_GET_PARTY_ID'
  | 'AGREEMENT_GET_LIST'
  | 'AGREEMENT_GET_SINGLE'
  | 'CLIENT_GET_LIST'
  | 'CLIENT_GET_SINGLE'
  | 'CLIENT_CREATE'
  | 'OPERATOR_SECURITY_GET_LIST'
  | 'OPERATOR_SECURITY_GET_SINGLE'
  | 'OPERATOR_SECURITY_CREATE'
  | 'OPERATOR_SECURITY_KEYS_GET'
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
  autoHideDuration?: number
}

export type ToastActionKeys = Exclude<
  ApiEndpointKey,
  | 'ONBOARDING_GET_AVAILABLE_PARTIES'
  | 'ONBOARDING_GET_SEARCH_PARTIES'
  | 'ONBOARDING_POST_LEGALS'
  | 'ONBOARDING_COMPLETE_REGISTRATION'
  | 'ESERVICE_GET_SINGLE'
  | 'ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION'
  | 'ATTRIBUTES_GET_LIST'
  | 'AGREEMENT_GET_LIST'
  | 'AGREEMENT_GET_SINGLE'
  | 'OPERATOR_API_GET_LIST'
  | 'OPERATOR_API_GET_SINGLE'
  | 'PARTY_GET_PARTY_ID'
  | 'CLIENT_GET_LIST'
  | 'CLIENT_GET_SINGLE'
  | 'OPERATOR_SECURITY_GET_LIST'
  | 'OPERATOR_SECURITY_GET_SINGLE'
  | 'OPERATOR_SECURITY_CREATE'
  | 'OPERATOR_SECURITY_KEYS_GET'
  | 'OPERATOR_SECURITY_KEYS_POST'
  | 'OPERATOR_SECURITY_KEY_DOWNLOAD'
  | 'OPERATOR_SECURITY_KEY_DELETE'
>

export type LoaderType = 'global' | 'contextual'

/*
 * Action buttons in tables
 */
export type ActionProps = {
  onClick: ActionFunction
  label: string
  isMock?: boolean
}

/*
 * Input field related types
 */
export type SelectOption = {
  label: string
  value: string | number
}

/*
 * MUI related props
 */
export type MUISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/*
 * MISC
 */
export type CustomDialogContentsProps = {
  control: Control<FieldValues, Record<string, unknown>>
  errors: Record<string, unknown>
  getValues?: UseFormGetValues<FieldValues>
  watch?: UseFormWatch<FieldValues>
}

export type RunActionOutput = {
  response: AxiosResponse | AxiosError
  outcome: RequestOutcome
}

export type EServiceInterfaceMimeType = {
  mime: Array<string>
  format: string
}

export type RHFProps = {
  control: Control<FieldValues, Record<string, unknown>>
  errors: Record<string, unknown>
  watch: UseFormWatch<FieldValues>
  getValues: UseFormGetValues<FieldValues>
}
