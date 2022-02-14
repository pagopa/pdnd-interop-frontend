import React from 'react'
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import {
  AGREEMENT_STATE_LABEL,
  CLIENT_STATE_LABEL,
  ESERVICE_STATE_LABEL,
  PURPOSE_STATE_LABEL,
} from './src/config/labels'
import { SchemaOf } from 'yup'

/*
 * Fetch data and router related types
 */
// export type ApiEndpointKey = keyof typeof API
export type ApiEndpointKey =
  | 'ONBOARDING_GET_AVAILABLE_PARTIES'
  | 'PARTY_GET_PARTY_ID'
  | 'ESERVICE_GET_LIST'
  | 'ESERVICE_GET_LIST_FLAT'
  | 'ESERVICE_GET_SINGLE'
  | 'ESERVICE_DRAFT_CREATE'
  | 'ESERVICE_DRAFT_UPDATE'
  | 'ESERVICE_DRAFT_DELETE'
  | 'ESERVICE_CLONE_FROM_VERSION'
  | 'ESERVICE_VERSION_DRAFT_CREATE'
  | 'ESERVICE_VERSION_DRAFT_UPDATE'
  | 'ESERVICE_VERSION_DRAFT_PUBLISH'
  | 'ESERVICE_VERSION_SUSPEND'
  | 'ESERVICE_VERSION_REACTIVATE'
  | 'ESERVICE_VERSION_DRAFT_DELETE'
  | 'ESERVICE_VERSION_DRAFT_POST_DOCUMENT'
  | 'ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT'
  | 'ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION'
  | 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT'
  | 'ATTRIBUTE_GET_LIST'
  | 'ATTRIBUTE_CREATE'
  | 'AGREEMENT_CREATE'
  | 'AGREEMENT_GET_LIST'
  | 'AGREEMENT_GET_SINGLE'
  | 'AGREEMENT_VERIFY_ATTRIBUTE'
  | 'AGREEMENT_ACTIVATE'
  | 'AGREEMENT_SUSPEND'
  | 'AGREEMENT_UPGRADE'
  | 'PURPOSE_GET_LIST'
  | 'PURPOSE_GET_SINGLE'
  | 'PURPOSE_DRAFT_CREATE'
  | 'PURPOSE_DAILY_CALLS_UPDATE'
  | 'PURPOSE_VERSION_DRAFT_DELETE'
  | 'PURPOSE_VERSION_DRAFT_UPDATE'
  | 'PURPOSE_VERSION_DRAFT_PUBLISH'
  | 'PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD'
  | 'PURPOSE_SUSPEND'
  | 'PURPOSE_ACTIVATE'
  | 'PURPOSE_ARCHIVE'
  | 'CLIENT_GET_LIST'
  | 'CLIENT_GET_SINGLE'
  | 'CLIENT_CREATE'
  | 'CLIENT_SUSPEND'
  | 'CLIENT_ACTIVATE'
  | 'KEY_GET_LIST'
  | 'KEY_GET_SINGLE'
  | 'KEY_POST'
  | 'KEY_DOWNLOAD'
  | 'KEY_DELETE'
  | 'USER_GET_LIST'
  | 'USER_SUSPEND'
  | 'USER_REACTIVATE'
  | 'USER_GET_SINGLE'
  | 'OPERATOR_CREATE'
  | 'OPERATOR_SECURITY_JOIN_WITH_CLIENT'
  | 'OPERATOR_API_GET_SINGLE'
  | 'OPERATOR_SECURITY_GET_LIST'
  | 'OPERATOR_SECURITY_GET_SINGLE'
  | 'OPERATOR_SECURITY_GET_KEYS_LIST'

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

export type RouteAuthLevel = 'any' | Array<UserProductRole>

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
 * Product user and party
 */
export type UserState = 'PENDING' | 'ACTIVE' | 'SUSPENDED'
export type UserRole = 'MANAGER' | 'DELEGATE' | 'OPERATOR'
export type UserProductRole = 'admin' | 'security' | 'api'

type UserContract = {
  version: string
  path: string
}

export type UserOnCreate = {
  name: string
  surname: string
  taxCode: string
  email: string
  role: UserRole
  product: UserProduct
  productRole: UserProductRole
  contract: UserContract
}

export type UserProduct = {
  createdAt: string // actually should be Date
  id: 'interop'
  role: UserProductRole
}

export type JwtUser = {
  id: string // the relationshipId between the user and the current institution
  name: string
  surname: string
  email: string
}

export type User = JwtUser & {
  createdAt: string // actually should be Date
  updatedAt: string // actually should be Date
  from: string // the external uid of the user
  state: UserState
  role: UserRole
  product: UserProduct
}

export type PartyOnCreate = {
  description: string
  institutionId: string
  digitalAddress: string
}

export type Party = PartyOnCreate & {
  partyId?: string
  role: UserRole
  state: UserState
  attributes: Array<string>
  productInfo: UserProduct
}

/*
 * EService
 */
export type EServiceState = keyof typeof ESERVICE_STATE_LABEL
export type EServiceStateLabel = Record<EServiceState, string>

// EServices are subdivided into their write and read type
// The write is for when data is POSTed to the backend
// The read, when data is returned from the backend

// Some types are shared between the two
export type EServiceDocumentKind = 'INTERFACE' | 'DOCUMENT'
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
  state: EServiceState
  descriptors: Array<EServiceDescriptorWrite>
}

export type EServiceDocumentWrite = {
  kind: EServiceDocumentKind
  description: string
  doc: File
}

export type EServiceDescriptorWrite = {
  id: string
  state: EServiceState
  docs: Array<EServiceDocumentWrite>
  interface: EServiceDocumentWrite
  version: string
}

export type EServiceCreateDataType = {
  producerId: string
  name: string
  description: string
  technology: EServiceTechnologyType
  // pop: boolean
}

// Read only
export type EServiceFlatReadType = {
  name: string
  id: string
  producerId: string
  producerName: string
  descriptorId?: string
  state?: EServiceState
  version?: string
  callerSubscribed?: string
  certifiedAttributes: Array<BackendAttribute>
}

export type EServiceFlatDecoratedReadType = EServiceFlatReadType & {
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
  state: EServiceState
  descriptors: Array<EServiceDescriptorRead>
  activeDescriptor?: EServiceDescriptorRead // TEMP REFACTOR : this is added by the client
}

export type EServiceDescriptorRead = {
  id: string
  state: EServiceState
  docs: Array<EServiceDocumentRead>
  interface: EServiceDocumentRead
  version: string
  voucherLifespan: number
  description: string
  audience: Array<string>
  dailyCalls: number
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
export type AgreementState = keyof typeof AGREEMENT_STATE_LABEL

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
  state: EServiceState
  activeDescriptor?: AgreementEService
}

export type AgreementSummary = {
  id: string
  state: AgreementState
  eservice: AgreementEService
  eserviceDescriptorId: string
  consumer: AgreementProducerAndConsumer
  producer: AgreementProducerAndConsumer
  attributes: Array<BackendAttribute>
  suspendedByProducer?: boolean
  suspendedBySubscriber?: boolean
}

/*
 * Purpose
 */
export type PurposeState = keyof typeof PURPOSE_STATE_LABEL

type PurposeYesNoAnswer = 'YES' | 'NO'

type PurposeLegalBasisAnswer =
  | 'CONSENT'
  | 'CONTRACT'
  | 'OBLIGATION'
  | 'SAFEGUARD'
  | 'PUBLIC_INTEREST'
  | 'LEGITIMATE_INTEREST'

type PurposeDataQuantityAnswer =
  | 'QUANTITY_0_TO_100'
  | 'QUANTITY_101_TO_500'
  | 'QUANTITY_500_TO_1000'
  | 'QUANTITY_1001_TO_5000'
  | 'QUANTITY_5001_OVER'

type PurposeDeliveryMethodAnswer = 'CLEARTEXT' | 'AGGREGATE' | 'ANONYMOUS' | 'PSEUDOANONYMOUS'

type PurposePursuitAnswer = 'MERE_CORRECTNESS' | 'NEW_PERSONAL_DATA'

type PurposeRiskAnalysisFormAnswers = {
  purpose: string
  usesPersonalData: PurposeYesNoAnswer
  usesThirdPartyPersonalData?: PurposeYesNoAnswer
  usesConfidentialData?: PurposeYesNoAnswer
  securedDataAccess?: PurposeYesNoAnswer
  legalBasis?: Array<PurposeLegalBasisAnswer>
  legalObligationReference?: string
  publicInterestReference?: string
  knowsAccessedDataCategories?: PurposeYesNoAnswer
  accessDataArt9Gdpr?: PurposeYesNoAnswer
  accessUnderageData?: PurposeYesNoAnswer
  knowsDataQuantity?: PurposeYesNoAnswer
  dataQuantity?: PurposeDataQuantityAnswer
  deliveryMethod?: PurposeDeliveryMethodAnswer
  doneDpia?: PurposeYesNoAnswer
  definedDataRetentionPeriod?: PurposeYesNoAnswer
  purposePursuit?: PurposePursuitAnswer
  checkedExistenceMereCorrectnessInteropCatalogue?: 'YES'
  checkedAllDataNeeded?: PurposeYesNoAnswer
  checkedExistenceMinimalDataInteropCatalogue?: PurposeYesNoAnswer
}

type PurposeRiskAnalysisForm = {
  version: string
  answers: PurposeRiskAnalysisFormAnswers
}

export type PurposeVersion = {
  id: string
  state: PurposeState
  dailyCalls: number
  riskAnalysis: string
  createdAt: string
  approvalDateEstimate?: string
  approvalDate?: string
}

export type Purpose = {
  id: string
  name: string
  description: string
  eservice: Pick<EServiceReadType, 'id' | 'name' | 'producer'>
  eserviceDescriptor: Pick<EServiceDescriptorRead, 'id' | 'version' | 'dailyCalls' | 'state'>
  agreement: Pick<AgreementSummary, 'id' | 'state'>
  riskAnalysisForm: PurposeRiskAnalysisForm
  clients?: Array<Pick<Client, 'id' | 'name' | 'state'>>
  versions: Array<PurposeVersion>
}

// The frontend adds this, currentVersion and mostRecentVersion
// differ if mostRecentVersion's state is WAITING_FOR_APPROVAL
export type DecoratedPurpose = Purpose & {
  mostRecentVersion: PurposeVersion
  currentVersion: PurposeVersion
  awaitingApproval: boolean
}

/*
 * Client
 */
export type ClientState = keyof typeof CLIENT_STATE_LABEL

type ClientEServiceDescriptor = {
  id: string
  state: EServiceState
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
  state: AgreementState
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
  state: ClientState
  agreement: ClientAgreement
  eservice: ClientEService
  purposes: string
}

/*
 * Public keys
 */
export type PublicKeyItem = {
  kid: string
  use: 'SIG' | 'ENC'
  clientId?: string
}

export type PublicKey = {
  key: PublicKeyItem
}

export type PublicKeys = {
  keys: Array<PublicKey>
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

export type DialogContent = {
  title: string
  description?: string
}

export type DialogDefaultProps = {
  close: VoidFunction
  maxWidth?: MUISize
}

export type DialogProps =
  | DialogBasicProps
  | DialogAskExtensionProps
  | DialogSubscribeProps
  | DialogAddSecurityOperatorKeyProps
  | DialogExistingAttributeProps
  | DialogNewAttributeProps
  | DialogAddSecurityOperatorProps
  | DialogAddClientsProps
  | DialogUpdatePurposeDailyCallsProps
  | DialogCreateSecurityOperatorProps

export type DialogCreateSecurityOperatorProps = {
  type: 'createSecurityOperator'
}

export type CreateSecurityOperatorFormInputValues = {
  selected: Array<User>
}

export type DialogUpdatePurposeDailyCallsProps = {
  type: 'updatePurposeDailyCalls'
  onSubmit: (data: DialogUpdatePurposeDailyCallsFormInputValues) => void
  initialValues: DialogUpdatePurposeDailyCallsFormInputValues
  validationSchema: SchemaOf<DialogUpdatePurposeDailyCallsFormInputValues>
}

export type DialogUpdatePurposeDailyCallsFormInputValues = {
  dailyCalls: number
}

export type DialogAddClientsProps = {
  type: 'addClients'
  onSubmit: (data: Array<Client>) => void
  exclude: Array<Client>
}

export type DialogAddSecurityOperatorProps = {
  type: 'addSecurityOperator'
  onSubmit: (data: AddSecurityOperatorFormInputValues) => void
  initialValues: AddSecurityOperatorFormInputValues
}

export type AddSecurityOperatorFormInputValues = {
  selected: Array<User>
}

export type DialogNewAttributeProps = {
  type: 'newAttribute'
  attributeKey: AttributeKey
  onSubmit: (data: NewAttributeFormInputValues) => void
  initialValues: NewAttributeFormInputValues
  validationSchema: SchemaOf<NewAttributeFormInputValues>
}

export type NewAttributeFormInputValues = {
  name: string
  code: string
  origin: string
  description: string
}

export type DialogExistingAttributeProps = {
  type: 'existingAttribute'
  attributeKey: AttributeKey
  onSubmit: (data: ExistingAttributeFormInputValues) => void
  initialValues: ExistingAttributeFormInputValues
}

export type ExistingAttributeVerifiedCondition = {
  attribute: boolean
}

export type ExistingAttributeFormInputValues = {
  verifiedCondition?: ExistingAttributeVerifiedCondition
  selected: Array<CatalogAttribute>
}

export type DialogAddSecurityOperatorKeyProps = {
  type: 'securityOperatorKey'
  onSubmit: (data: SecurityOperatorKeysFormInputValues) => void
  initialValues: SecurityOperatorKeysFormInputValues
  validationSchema: SchemaOf<SecurityOperatorKeysFormInputValues>
}

export type SecurityOperatorKeysFormInputValues = {
  key: string
}

export type DialogSubscribeProps = {
  type: 'subscribe'
  onSubmit: (data: EserviceSubscribeFormInputValues) => void
  initialValues: EserviceSubscribeFormInputValues
  validationSchema: SchemaOf<EserviceSubscribeFormInputValues>
}

export type EserviceSubscribeFormInputValues = {
  agreementHandle: Record<string, boolean>
}

export type DialogAskExtensionProps = {
  type: 'askExtension'
}

export type DialogBasicProps = DialogDefaultProps & {
  type: 'basic'
  title: string
  description?: string
  proceedCallback: ActionFunction
  proceedLabel?: string
  disabled?: boolean
}

export type DialogActionKeys = Exclude<
  ApiEndpointKey,
  | 'ONBOARDING_GET_AVAILABLE_PARTIES'
  | 'PARTY_GET_PARTY_ID'
  | 'ESERVICE_GET_LIST'
  | 'ESERVICE_GET_LIST_FLAT'
  | 'ESERVICE_GET_SINGLE'
  | 'ESERVICE_DRAFT_UPDATE'
  | 'ESERVICE_VERSION_DRAFT_UPDATE'
  | 'ESERVICE_VERSION_DRAFT_POST_DOCUMENT'
  | 'ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT'
  | 'ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION'
  | 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT'
  | 'ATTRIBUTE_GET_LIST'
  | 'ATTRIBUTE_CREATE'
  | 'AGREEMENT_CREATE'
  | 'AGREEMENT_GET_LIST'
  | 'AGREEMENT_GET_SINGLE'
  | 'AGREEMENT_VERIFY_ATTRIBUTE'
  | 'PURPOSE_GET_LIST'
  | 'PURPOSE_GET_SINGLE'
  | 'PURPOSE_DRAFT_CREATE'
  | 'PURPOSE_DAILY_CALLS_UPDATE'
  | 'PURPOSE_VERSION_DRAFT_UPDATE'
  | 'PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD'
  | 'CLIENT_GET_LIST'
  | 'CLIENT_GET_SINGLE'
  | 'CLIENT_CREATE'
  | 'KEY_GET_LIST'
  | 'KEY_GET_SINGLE'
  | 'KEY_POST'
  | 'KEY_DOWNLOAD'
  | 'USER_GET_LIST'
  | 'USER_GET_SINGLE'
  | 'OPERATOR_CREATE'
  | 'OPERATOR_SECURITY_JOIN_WITH_CLIENT'
  | 'OPERATOR_API_GET_SINGLE'
  | 'OPERATOR_SECURITY_GET_LIST'
  | 'OPERATOR_SECURITY_GET_SINGLE'
  | 'OPERATOR_SECURITY_CREATE'
  | 'OPERATOR_SECURITY_GET_KEYS_LIST'
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
  | 'PARTY_GET_PARTY_ID'
  | 'ESERVICE_GET_SINGLE'
  | 'ATTRIBUTE_GET_LIST'
  | 'AGREEMENT_GET_LIST'
  | 'AGREEMENT_GET_SINGLE'
  | 'CLIENT_GET_LIST'
  | 'CLIENT_GET_SINGLE'
  | 'PURPOSE_GET_LIST'
  | 'PURPOSE_GET_SINGLE'
  | 'PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD'
  | 'KEY_GET_LIST'
  | 'KEY_GET_SINGLE'
  | 'USER_GET_LIST'
  | 'USER_GET_SINGLE'
  | 'OPERATOR_API_GET_SINGLE'
  | 'OPERATOR_SECURITY_GET_LIST'
  | 'OPERATOR_SECURITY_GET_SINGLE'
  | 'OPERATOR_SECURITY_GET_KEYS_LIST'
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
export type InputSelectOption = {
  label: string
  value: string | number
}

export type InputRadioOption = {
  label: string
  value: string
}

export type InputCheckboxOption = {
  label: string
  value: string
}

/*
 * MUI related props
 */
export type MUISize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/*
 * MISC
 */
export type RunActionOutput = {
  response: AxiosResponse | AxiosError
  outcome: RequestOutcome
}

export type EServiceInterfaceMimeType = {
  mime: Array<string>
  format: string
}

export type FormikSetFieldValue = (
  field: string,
  value: unknown,
  shouldValidate?: boolean | undefined
) => void
