import React from 'react'
import { AxiosRequestConfig, Method } from 'axios'
import { SchemaOf } from 'yup'
import { RunAction } from './src/hooks/useFeedback'

/*
 * Fetch data and router related types
 */
// export type ApiEndpointKey = keyof typeof API
export type ApiEndpointKey =
  | 'AUTH_HEALTH_CHECK'
  | 'AUTH_OBTAIN_SESSION_TOKEN'
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
  | 'ATTRIBUTE_GET_CERTIFIED_LIST'
  | 'ATTRIBUTE_GET_VERIFIED_LIST'
  | 'ATTRIBUTE_GET_DECLARED_LIST'
  | 'ATTRIBUTE_GET_LIST'
  | 'ATTRIBUTE_GET_SINGLE'
  | 'ATTRIBUTE_CREATE'
  | 'AGREEMENT_DRAFT_CREATE'
  | 'AGREEMENT_DRAFT_SUBMIT'
  | 'AGREEMENT_DRAFT_DELETE'
  | 'AGREEMENT_DRAFT_DOCUMENT_DOWNLOAD'
  | 'AGREEMENT_DRAFT_DOCUMENT_UPLOAD'
  | 'AGREEMENT_DRAFT_DOCUMENT_DELETE'
  | 'AGREEMENT_GET_LIST'
  | 'AGREEMENT_GET_SINGLE'
  | 'AGREEMENT_VERIFY_ATTRIBUTE'
  | 'AGREEMENT_REVOKE_VERIFIED_ATTRIBUTE'
  | 'AGREEMENT_ACTIVATE'
  | 'AGREEMENT_REJECT'
  | 'AGREEMENT_SUSPEND'
  | 'AGREEMENT_UPGRADE'
  | 'AGREEMENT_CONTRACT_DOWNLOAD'
  | 'PURPOSE_GET_LIST'
  | 'PURPOSE_GET_SINGLE'
  | 'PURPOSE_DRAFT_CREATE'
  | 'PURPOSE_DRAFT_UPDATE'
  | 'PURPOSE_DRAFT_DELETE'
  | 'PURPOSE_VERSION_DRAFT_CREATE'
  | 'PURPOSE_VERSION_DRAFT_UPDATE'
  | 'PURPOSE_VERSION_WAITING_FOR_APPROVAL_UPDATE'
  | 'PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD'
  | 'PURPOSE_VERSION_SUSPEND'
  | 'PURPOSE_VERSION_ACTIVATE'
  | 'PURPOSE_VERSION_ARCHIVE'
  | 'PURPOSE_VERSION_DELETE'
  | 'CLIENT_GET_LIST'
  | 'CLIENT_GET_SINGLE'
  | 'CLIENT_CREATE'
  | 'CLIENT_DELETE'
  | 'CLIENT_INTEROP_M2M_CREATE'
  | 'CLIENT_JOIN_WITH_PURPOSE'
  | 'CLIENT_REMOVE_FROM_PURPOSE'
  | 'KEY_GET_LIST'
  | 'KEY_GET_SINGLE'
  | 'KEY_POST'
  | 'KEY_DOWNLOAD'
  | 'KEY_DELETE'
  | 'USER_GET_LIST'
  | 'OPERATOR_GET_SINGLE'
  | 'OPERATOR_SECURITY_JOIN_WITH_CLIENT'
  | 'OPERATOR_SECURITY_REMOVE_FROM_CLIENT'
  | 'OPERATOR_SECURITY_GET_LIST'
  | 'OPERATOR_SECURITY_GET_KEYS_LIST'
  | 'ATTRIBUTE_CONFIRM_DECLARED'
  | 'ATTRIBUTE_REVOKE_DECLARED'

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

export type LangCode = 'it' | 'en'

export type RouteConfig = {
  PATH: Record<LangCode, string>
  LABEL: Record<LangCode, string>
  REDIRECT?: Record<LangCode, string>
  EXACT?: boolean
  COMPONENT: React.FunctionComponent<unknown>
  PUBLIC: boolean
  AUTH_LEVELS?: RouteAuthLevel
}

export type MappedRouteConfig = {
  PATH: string
  LABEL: string
  REDIRECT?: string
  EXACT?: boolean
  COMPONENT: React.FunctionComponent<unknown>
  PUBLIC: boolean
  AUTH_LEVELS?: RouteAuthLevel

  SUBROUTES?: Record<string, MappedRouteConfig>
  SPLIT_PATH: Array<string>
  PARENTS?: Array<MappedRouteConfig>
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

type JwtOrgRole = {
  partyRole: UserRole
  role: UserProductRole
}

type JwtOrg = {
  name: string
  roles: Array<JwtOrgRole>
  fiscal_code: string
}

export type JwtUser = {
  aud: string
  exp: number
  iat: number
  iss: string
  jti: string
  nbf: number
  organization: JwtOrg
  selfcareId: string
  uid: string // the relationshipId between the user and the current institution
  name: string
  family_name: string
  organizationId: string
}

export type SelfCareUser = {
  createdAt: string
  familyName: string
  from: string
  id: string
  name: string
  product: {
    createdAt: string // Date
    id: string
    role: UserProductRole
  }
  role: UserRole
  state: UserState
  taxCode: string
  to: string
  updatedAt: string // Date

  relationshipId: string // Existing when there is a relationship between a user and an Interop client
}

/*
 * EService
 */
export type EServiceState = 'PUBLISHED' | 'DRAFT' | 'SUSPENDED' | 'ARCHIVED' | 'DEPRECATED'
export type EServiceStateLabel = Record<EServiceState, string>

// EServices are subdivided into their write and read type
// The write is for when data is POSTed to the backend
// The read, when data is returned from the backend

// Some types are shared between the two
export type EServiceDocumentKind = 'INTERFACE' | 'DOCUMENT'
export type EServiceTechnologyType = 'REST' | 'SOAP'

// Write only
export type EServiceCreateType = {
  id: string
  name: string
  version: string
  state: EServiceState
  descriptors: Array<EServiceDescriptorWrite>
}

export type EServiceDocumentWrite = {
  prettyName: string
  kind: EServiceDocumentKind
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
  description: string
  id: string
  producerId: string
  producerName: string
  descriptorId?: string
  state?: EServiceState
  version?: string
  agreement?: {
    id: string
    state: AgreementState
  }
  certifiedAttributes: Array<BackendAttribute>
}

export type EServiceFlatDecoratedReadType = EServiceFlatReadType & {
  isMine: boolean
}

type EServiceReadProducerType = {
  id: string
  name: string
}

export type SingleBackendAttribute = {
  single: BackendAttributeContent
}
export type GroupBackendAttribute = {
  group: Array<BackendAttributeContent>
}
export type BackendAttribute = SingleBackendAttribute | GroupBackendAttribute
export type BackendAttributes = Record<AttributeKey, Array<BackendAttribute>>

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
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
  agreementApprovalPolicy: 'MANUAL' | 'AUTOMATIC'
}

export type EServiceDocumentRead = {
  contentType: string
  id: string
  name: string
  prettyName: string
}

/*
 * Agreement
 */
export type AgreementState =
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'PENDING'
  | 'ARCHIVED'
  | 'DRAFT'
  | 'REJECTED'
  | 'MISSING_CERTIFIED_ATTRIBUTES'

export type AgreementVerifiableAttribute = {
  id: string
  verificationDate: string
  verified: boolean

  // Backend doesn't send it for now
  name?: string
}

type AgreementProducer = {
  name: string
  id: string
}
type AgreementConsumer = {
  name: string
  id: string
  attributes: Array<
    Record<
      AttributeKey,
      DeclaredTenantAttribute | CertifiedTenantAttribute | VerifiedTenantAttribute
    >
  >
}

type AgreementEService = {
  name: string
  id: string
  descriptorId: string
  version: string
  state: EServiceState
  activeDescriptor?: AgreementEService
}

export type VerifiedAttribute = {
  id: string
  description: string
  name: string
  creationTime: string
}

export type CertifiedAttribute = {
  id: string
  description: string
  name: string
  creationTime: string
}

export type DeclaredAttribute = {
  id: string
  description: string
  name: string
  creationTime: string
}

export type AgreementSummary = {
  id: string
  state: AgreementState
  eservice: AgreementEService
  descriptorId: string
  consumer: AgreementConsumer
  producer: AgreementProducer
  verifiedAttributes: Array<VerifiedAttribute>
  certifiedAttributes: Array<CertifiedAttribute>
  declaredAttributes: Array<DeclaredAttribute>
  suspendedByProducer?: boolean
  suspendedByConsumer?: boolean
  suspendedByPlatform?: boolean
  consumerNotes?: string
  consumerDocuments: Array<EServiceDocumentRead>
  createdAt: string
  updatedAt?: string
  rejectionReason?: string
}

/*
 * Purpose
 */
export type PurposeState = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'WAITING_FOR_APPROVAL' | 'ARCHIVED'

type PurposeYesNoAnswer = 'YES' | 'NO'

export type PurposeLegalBasisAnswer =
  | 'CONSENT'
  | 'CONTRACT'
  | 'LEGAL_OBLIGATION'
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

export type PurposeRiskAnalysisFormAnswers = {
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

export type PurposeRiskAnalysisForm = {
  version: string
  answers: PurposeRiskAnalysisFormAnswers
}

type PurposeRiskAnalysisDocument = {
  contentType: string
  createdAt: string
  id: string
}

export type PurposeVersion = {
  id: string
  state: PurposeState
  dailyCalls: number
  riskAnalysis: PurposeRiskAnalysisDocument
  createdAt: string
  expectedApprovalDate?: string
  firstActivationAt?: string
}

export type Purpose = {
  consumer: {
    id: string
    name: string
  }
  id: string
  title: string
  description: string
  eservice: Pick<EServiceReadType, 'id' | 'name' | 'producer'> & {
    descriptor: Pick<
      EServiceDescriptorRead,
      // TEMP PIN-1194
      'id' | 'version' | 'state'
    > & { dailyCalls: number }
  }
  agreement: Pick<AgreementSummary, 'id' | 'state'>
  riskAnalysisForm: PurposeRiskAnalysisForm
  clients: Array<Pick<Client, 'id' | 'name'>>
  versions: Array<PurposeVersion>
}

// The frontend adds this, currentVersion and mostRecentVersion
// differ if mostRecentVersion's state is WAITING_FOR_APPROVAL
export type DecoratedPurpose = Purpose & {
  mostRecentVersion: PurposeVersion | null
  currentVersion: PurposeVersion | null
  awaitingApproval: boolean
}

/*
 * Client
 */
type ClientRelationshipState = 'ACTIVE' | 'INACTIVE'

type ClientPurposeAgreement = {
  id: string
  eservice: {
    id: string
    name: string
  }
  descriptor: {
    id: string
    version: string
  }
}

export type ClientPurpose = {
  purposeId: string
  states: {
    agreement: {
      consumerId: string
      eserviceId: string
      state: ClientRelationshipState
    }
    eservice: {
      audience: Array<string>
      eserviceId: string
      state: ClientRelationshipState
      voucherLifespan: number
    }
    purpose: {
      purposeId: string
      state: ClientRelationshipState
    }
    id: string
  }
  agreement: ClientPurposeAgreement
  title: string
}

export type Client = {
  id: string
  name: string
  description: string
  operators: Array<SelfCareUser>
  kind: ClientKind
  purposes: Array<ClientPurpose>
  consumer: {
    description: string
    institutionId: string
  }
}

export type ClientKind = 'CONSUMER' | 'API'

/*
 * Public keys
 */
export type PublicKeyItem = {
  kid: string
  use: 'SIG' | 'ENC'
  clientId?: string
}

export type PublicKey = {
  name: string
  createdAt: string
  key: PublicKeyItem
  operator: SelfCareUser
}

export type PublicKeys = {
  keys: Array<PublicKey>
}

/*
 * Attributes
 */
export type AttributeKind = 'CERTIFIED' | 'VERIFIED' | 'DECLARED'

export type AttributeKey = 'certified' | 'verified' | 'declared'

export type AttributeModalTemplate = 'add' | 'create'

export type PartyAttribute = {
  origin: string
  code: string
  description: string
}

export type BasicAttribute = PartyAttribute & {
  id: string
  name: string
  creationTime: string
}

export type BackendAttributeContent = BasicAttribute & {
  explicitAttributeVerification: boolean
  verified?: boolean
  verificationDate?: string
}

export type ConsumerAttributes = Record<AttributeKey, Array<ConsumerAttribute>>

export type ConsumerAttribute = {
  id: string
  name: string
  state: 'ACTIVE' | 'REVOKED'
}

export type DeclaredTenantAttribute = {
  id: string
  name: string
  assignmentTimestamp: string
  revocationTimestamp?: string
}

export type CertifiedTenantAttribute = {
  id: string
  name: string
  assignmentTimestamp: string
  revocationTimestamp?: string
}

export type VerifiedTenantAttribute = {
  id: string
  name: string
  assignmentTimestamp: string
  revocationTimestamp?: string
  renewal: 'REVOKE_ON_EXPIRATION' | 'AUTOMATIC_RENEWAL'
  verifiedBy: Array<{
    id: string
    verificationDate: string
    expirationDate?: string
    extentionDate?: string
  }>
  revokedBy: Array<{
    id: string
    verificationDate: string
    expirationDate?: string
    extentionDate?: string
    revocationDate: string
  }>
}

export type TenantAttribute = {
  certified?: CertifiedTenantAttribute
  verified?: VerifiedTenantAttribute
  declared?: DeclaredTenantAttribute
}

// Catalog attribute as it comes from the attributes catalog
export type CatalogAttribute = {
  kind: AttributeKind
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
export type ActionFunction = () => void

// export type RunActionProps = {
//   loadingText: string
//   success?: ToastContent
//   error?: ToastContent
// }

export type WrappableAction = {
  proceedCallback: ActionFunction
  label: string
}

export type DialogContent = {
  title: string
  description?: string
}

export type DialogDefaultProps = {
  maxWidth?: MUISize
}

export type DialogProps =
  | DialogBasicProps
  | DialogAskExtensionProps
  | DialogAddSecurityOperatorKeyProps
  | DialogExistingAttributeProps
  | DialogNewAttributeProps
  | DialogAttributeDetailsProps
  | DialogAddSecurityOperatorProps
  | DialogAddClientsProps
  | DialogUpdatePurposeDailyCallsProps
  | DialogSetPurposeExpectedApprovalDateProps
  | DialogRejectAgreementProps
  | DialogSessionExpiredProps

export type DialogSessionExpiredProps = {
  type: 'sessionExpired'
}

export type DialogSetPurposeExpectedApprovalDateProps = {
  type: 'setPurposeExpectedApprovalDate'
  purposeId: string
  versionId: string
  approvalDate?: string
  runAction: RunAction
}

export type DialogRejectAgreementProps = {
  type: 'rejectAgreement'
  onSubmit: (data: DialogRejectAgreementFormInputValues) => void
  initialValues: DialogRejectAgreementFormInputValues
  validationSchema: SchemaOf<DialogRejectAgreementFormInputValues>
}

export type DialogRejectAgreementFormInputValues = {
  reason: string
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
  exclude: Array<Client> | Array<Pick<Client, 'id' | 'name'>>
}

export type DialogAddSecurityOperatorProps = {
  type: 'addSecurityOperator'
  onSubmit: (data: AddSecurityOperatorFormInputValues) => void
  initialValues: AddSecurityOperatorFormInputValues
  excludeIdsList?: Array<string>
}

export type AddSecurityOperatorFormInputValues = {
  selected: Array<SelfCareUser>
}

export type DialogNewAttributeProps = {
  type: 'createNewAttribute'
  attributeKey: AttributeKey
  onSubmit: (data: NewAttributeFormInputValues) => void
  initialValues: NewAttributeFormInputValues
  validationSchema: SchemaOf<NewAttributeFormInputValues>
}

export type DialogAttributeDetailsProps = {
  type: 'showAttributeDetails'
  attributeId: string
  name: string
}

export type NewAttributeFormInputValues = {
  name: string
  code: string
  origin: string
  description: string
}

export type DialogExistingAttributeProps = {
  type: 'addExistingAttribute'
  attributeKey: AttributeKey
  onSubmit: (data: ExistingAttributeFormInputValues) => void
  selectedIds: Array<string>
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
  type: 'addSecurityOperatorKey'
  onSubmit: (data: SecurityOperatorKeysFormInputValues) => void
  initialValues: SecurityOperatorKeysFormInputValues
  validationSchema: SchemaOf<SecurityOperatorKeysFormInputValues>
}

export type SecurityOperatorKeysFormInputValues = {
  name: string
  key: string
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

// export type DialogActionKeys = Exclude<
//   ApiEndpointKey,
//   | 'AUTH_HEALTH_CHECK'
//   | 'AUTH_OBTAIN_SESSION_TOKEN'
//   | 'ESERVICE_GET_LIST_FLAT'
//   | 'ESERVICE_GET_SINGLE'
//   | 'ESERVICE_DRAFT_UPDATE'
//   | 'ESERVICE_VERSION_DRAFT_UPDATE'
//   | 'ESERVICE_VERSION_DRAFT_POST_DOCUMENT'
//   | 'ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT'
//   | 'ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION'
//   | 'ESERVICE_VERSION_DOWNLOAD_DOCUMENT'
//   | 'ATTRIBUTE_GET_LIST'
//   | 'ATTRIBUTE_GET_SINGLE'
//   | 'ATTRIBUTE_CREATE'
//   | 'AGREEMENT_DRAFT_CREATE'
//   | 'AGREEMENT_DRAFT_SUBMIT'
//   | 'AGREEMENT_DRAFT_DELETE
//   | 'AGREEMENT_DRAFT_DOCUMENT_DOWNLOAD'
//   | 'AGREEMENT_DRAFT_DOCUMENT_UPLOAD'
//   | 'AGREEMENT_DRAFT_DOCUMENT_DELETE'
//   | 'AGREEMENT_GET_LIST'
//   | 'AGREEMENT_GET_SINGLE'
//   | 'AGREEMENT_VERIFY_ATTRIBUTE'
//   | 'PURPOSE_GET_LIST'
//   | 'PURPOSE_GET_SINGLE'
//   | 'PURPOSE_DRAFT_UPDATE'
//   | 'PURPOSE_DRAFT_CREATE'
//   | 'PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD'
//   | 'PURPOSE_VERSION_DRAFT_CREATE'
//   | 'PURPOSE_VERSION_DRAFT_UPDATE'
//   | 'PURPOSE_VERSION_WAITING_FOR_APPROVAL_UPDATE'
//   | 'CLIENT_GET_LIST'
//   | 'CLIENT_GET_SINGLE'
//   | 'CLIENT_CREATE'
//   | 'CLIENT_INTEROP_M2M_CREATE'
//   | 'CLIENT_JOIN_WITH_PURPOSE'
//   | 'KEY_GET_LIST'
//   | 'KEY_GET_SINGLE'
//   | 'KEY_POST'
//   | 'KEY_DOWNLOAD'
//   | 'USER_GET_LIST'
//   | 'OPERATOR_GET_SINGLE'
//   | 'OPERATOR_SECURITY_JOIN_WITH_CLIENT'
//   | 'OPERATOR_SECURITY_GET_LIST'
//   | 'OPERATOR_SECURITY_CREATE'
//   | 'OPERATOR_SECURITY_GET_KEYS_LIST'
// >

export type ToastContent = {
  message?: string | JSX.Element
}

export type ToastContentWithOutcome = ToastContent & {
  outcome: RequestOutcome
}

export type ToastProps = ToastContentWithOutcome & {
  onClose: VoidFunction
  autoHideDuration?: number
}

// export type ToastActionKeys = Exclude<
//   ApiEndpointKey,
//   | 'AUTH_HEALTH_CHECK'
//   | 'AUTH_OBTAIN_SESSION_TOKEN'
//   | 'ESERVICE_GET_SINGLE'
//   | 'ATTRIBUTE_GET_LIST'
//   | 'ATTRIBUTE_GET_SINGLE'
//   | 'AGREEMENT_GET_LIST'
//   | 'AGREEMENT_GET_SINGLE'
//   | 'CLIENT_GET_LIST'
//   | 'CLIENT_GET_SINGLE'
//   | 'PURPOSE_GET_LIST'
//   | 'PURPOSE_GET_SINGLE'
//   | 'PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD'
//   | 'KEY_GET_LIST'
//   | 'KEY_GET_SINGLE'
//   | 'USER_GET_LIST'
//   | 'OPERATOR_GET_SINGLE'
//   | 'OPERATOR_SECURITY_GET_LIST'
//   | 'OPERATOR_SECURITY_GET_KEYS_LIST'
// >

/*
 * Action buttons in tables
 */
export type ActionProps = {
  onClick: ActionFunction
  label: string
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
export type FormikSetFieldValue = (
  field: string,
  value: unknown,
  shouldValidate?: boolean | undefined
) => void

export type MUIColor =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning'
  | undefined

export type ExtendedMUIColor = MUIColor | 'disabled' | 'inherit' | 'action'

export type PagoPAEnvVars = {
  AGREEMENT_PROCESS_URL: string
  AUTHORIZATION_PROCESS_URL: string
  CATALOG_PROCESS_URL: string
  PURPOSE_PROCESS_URL: string
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL: string
  BACKEND_FOR_FRONTEND_URL: string
  SELFCARE_LOGIN_URL: string
  INTEROP_RESOURCES_BASE_URL: string
  MIXPANEL_PROJECT_ID: string
  API_GATEWAY_INTEFACE_URL: string
  ONETRUST_DOMAIN_SCRIPT_ID: string
  CLIENT_ASSERTION_JWT_AUDIENCE: string
  WELL_KNOWN_URLS: string
}
export type ExtendedWindow = Window & {
  pagopa_env: PagoPAEnvVars
  OptanonWrapper: unknown
  nonce: string
}
