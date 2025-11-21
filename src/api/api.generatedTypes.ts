/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** models the reject payload for this purpose version. */
export interface RejectPurposeVersionPayload {
  rejectionReason: string
}

export interface GoogleSAMLPayload {
  /** SAML response */
  SAMLResponse: string
  RelayState?: string | null
}

export interface SAMLTokenRequest {
  /** SAML */
  saml2: string
  /**
   * tenant id
   * @format uuid
   */
  tenantId: string
}

export interface AccessTokenRequest {
  /** @example "e58035ce-c753-4f72-b613-46f8a17b71cc" */
  client_id?: string
  /** @format jws */
  client_assertion: string
  client_assertion_type: string
  grant_type: string
}

export interface PrivacyNotice {
  /** @format uuid */
  id: string
  /** @format uuid */
  userId: string
  /** Consent Type */
  consentType: ConsentType
  firstAccept: boolean
  isUpdated: boolean
  /** @format uuid */
  latestVersionId: string
}

/** Consent Type */
export type ConsentType = 'PP' | 'TOS'

export interface PrivacyNoticeSeed {
  /** @format uuid */
  latestVersionId: string
}

export interface RiskAnalysisFormConfig {
  version: string
  questions: FormConfigQuestion[]
  /** @format date-time */
  expiration?: string
}

export interface FormConfigQuestion {
  id: string
  label: LocalizedText
  infoLabel?: LocalizedText
  /** Data Type Question */
  dataType: DataType
  required: boolean
  dependencies: Dependency[]
  visualType: string
  defaultValue: string[]
  hideOption?: Record<string, HideOption[]>
  validation?: ValidationOption
  options?: LabeledValue[]
}

export interface ValidationOption {
  /** @format int32 */
  maxLength?: number
}

export interface HasCertifiedAttributes {
  hasCertifiedAttributes: boolean
}

export interface HideOption {
  id: string
  value: string
}

export interface LabeledValue {
  label: LocalizedText
  value: string
}

export interface LocalizedText {
  it: string
  en: string
}

/** Data Type Question */
export type DataType = 'SINGLE' | 'MULTI' | 'FREETEXT'

export interface Dependency {
  id: string
  value: string
}

export interface UpdateEServiceSeed {
  name: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  /** Risk Analysis Mode */
  mode: EServiceMode
  isSignalHubEnabled?: boolean
  isConsumerDelegable?: boolean
  isClientAccessDelegable?: boolean
  personalData?: boolean
}

export interface UpdateEServiceTemplateInstanceSeed {
  isSignalHubEnabled?: boolean
  isConsumerDelegable?: boolean
  isClientAccessDelegable?: boolean
}

export interface EServiceSeed {
  name: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  /** Risk Analysis Mode */
  mode: EServiceMode
  isSignalHubEnabled?: boolean
  isConsumerDelegable?: boolean
  isClientAccessDelegable?: boolean
  personalData?: boolean
}

export interface UpdateEServiceDescriptorQuotas {
  /**
   * @format int32
   * @min 60
   * @max 86400
   */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal: number
}

export interface UpdateEServiceTemplateInstanceDescriptorQuotas {
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal: number
}

export interface UpdateEServiceDescriptorAgreementApprovalPolicySeed {
  /**
   * EService Descriptor policy for new Agreements approval.
   * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
   * MANUAL - the Producer must approve every agreement for this Descriptor.
   */
  agreementApprovalPolicy: AgreementApprovalPolicy
}

export interface UpdateEServiceDescriptorSeed {
  description?: string
  audience: string[]
  /** @format int32 */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal: number
  /**
   * EService Descriptor policy for new Agreements approval.
   * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
   * MANUAL - the Producer must approve every agreement for this Descriptor.
   */
  agreementApprovalPolicy: AgreementApprovalPolicy
  attributes: DescriptorAttributesSeed
}

export interface UpdateEServiceDescriptorTemplateInstanceSeed {
  audience: string[]
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal: number
  /**
   * EService Descriptor policy for new Agreements approval.
   * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
   * MANUAL - the Producer must approve every agreement for this Descriptor.
   */
  agreementApprovalPolicy: AgreementApprovalPolicy
}

export interface Mail {
  address: string
  description?: string
}

export interface EServiceDescriptionUpdateSeed {
  description: string
}

export interface EServiceDelegationFlagsUpdateSeed {
  isConsumerDelegable: boolean
  isClientAccessDelegable: boolean
}

export interface EServiceNameUpdateSeed {
  name: string
}

export interface EServiceSignalHubUpdateSeed {
  isSignalHubEnabled: boolean
}

export interface EServicePersonalDataFlagUpdateSeed {
  personalData: boolean
}

export interface RejectDelegatedEServiceDescriptorSeed {
  rejectionReason: string
}

export interface CatalogEServiceDescriptor {
  /** @format uuid */
  id: string
  version: string
  description?: string
  interface?: EServiceDoc
  docs: EServiceDoc[]
  attributes: DescriptorAttributes
  /** EService Descriptor State */
  state: EServiceDescriptorState
  audience: string[]
  /** @format int32 */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal: number
  /**
   * EService Descriptor policy for new Agreements approval.
   * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
   * MANUAL - the Producer must approve every agreement for this Descriptor.
   */
  agreementApprovalPolicy: AgreementApprovalPolicy
  eservice: CatalogDescriptorEService
  /** @format date-time */
  publishedAt?: string
  /** @format date-time */
  suspendedAt?: string
  /** @format date-time */
  deprecatedAt?: string
  /** @format date-time */
  archivedAt?: string
}

/** Models Client details */
export interface Client {
  /** @format uuid */
  id: string
  /** @format date-time */
  createdAt: string
  consumer: CompactOrganization
  /** Contains some details about user */
  admin?: CompactUser
  name: string
  purposes: ClientPurpose[]
  description?: string
  kind: ClientKind
}

export interface ClientPurpose {
  /** @format uuid */
  purposeId: string
  title: string
  eservice: CompactEService
}

export interface PurposeCloneSeed {
  /** @format uuid */
  eserviceId: string
}

export interface CatalogDescriptorEService {
  /** @format uuid */
  id: string
  name: string
  producer: CompactOrganization
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  /** Risk Analysis Mode */
  mode: EServiceMode
  riskAnalysis: EServiceRiskAnalysis[]
  descriptors: CompactDescriptor[]
  agreement?: CompactAgreement
  isMine: boolean
  /**
   * True in case:
   *   - the requester has the certified attributes required to consume the eservice, or
   *   - the requester is the delegated consumer for the eservice and
   *     the delegator has the certified attributes required to consume the eservice
   */
  hasCertifiedAttributes: boolean
  isSubscribed: boolean
  activeDescriptor?: CompactDescriptor
  mail?: Mail
  isSignalHubEnabled?: boolean
  isConsumerDelegable?: boolean
  isClientAccessDelegable?: boolean
  personalData?: boolean
}

export interface ProducerEServiceDetails {
  /** @format uuid */
  id: string
  name: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  /** Risk Analysis Mode */
  mode: EServiceMode
  riskAnalysis: EServiceRiskAnalysis[]
  isSignalHubEnabled?: boolean
  isConsumerDelegable?: boolean
  isClientAccessDelegable?: boolean
  personalData?: boolean
}

/** Risk Analysis Mode */
export type EServiceMode = 'RECEIVE' | 'DELIVER'

export interface EServiceRiskAnalysisSeed {
  name: string
  riskAnalysisForm: RiskAnalysisFormSeed
}

export interface EServiceTemplateRiskAnalysisSeed {
  name: string
  riskAnalysisForm: RiskAnalysisFormSeed
  tenantKind: TenantKind
}

export interface EServiceRiskAnalysis {
  /** @format uuid */
  id: string
  name: string
  riskAnalysisForm: RiskAnalysisForm
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  rulesetExpiration?: string
}

export interface EServiceTemplateRiskAnalysis {
  /** @format uuid */
  id: string
  name: string
  riskAnalysisForm: RiskAnalysisForm
  tenantKind: TenantKind
  /** @format date-time */
  createdAt: string
}

export interface ProducerEServiceDescriptor {
  /** @format uuid */
  id: string
  version: string
  description?: string
  interface?: EServiceDoc
  docs: EServiceDoc[]
  /** EService Descriptor State */
  state: EServiceDescriptorState
  audience: string[]
  /** @format int32 */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal: number
  /**
   * EService Descriptor policy for new Agreements approval.
   * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
   * MANUAL - the Producer must approve every agreement for this Descriptor.
   */
  agreementApprovalPolicy: AgreementApprovalPolicy
  eservice: ProducerDescriptorEService
  attributes: DescriptorAttributes
  /** @format date-time */
  publishedAt?: string
  /** @format date-time */
  deprecatedAt?: string
  /** @format date-time */
  archivedAt?: string
  /** @format date-time */
  suspendedAt?: string
  rejectionReasons?: DescriptorRejectionReason[]
  serverUrls?: string[]
  templateRef?: EServiceTemplateRef
  delegation?: DelegationWithCompactTenants
}

export interface ProducerDescriptorEService {
  /** @format uuid */
  id: string
  name: string
  description: string
  producer: ProducerDescriptorEServiceProducer
  /** EService Descriptor State */
  technology: EServiceTechnology
  /** Risk Analysis Mode */
  mode: EServiceMode
  riskAnalysis: EServiceRiskAnalysis[]
  descriptors: CompactDescriptor[]
  draftDescriptor?: CompactDescriptor
  mail?: Mail
  isSignalHubEnabled?: boolean
  isConsumerDelegable?: boolean
  isClientAccessDelegable?: boolean
  personalData?: boolean
}

export interface ProducerDescriptorEServiceProducer {
  /** @format uuid */
  id: string
  tenantKind?: TenantKind
}

export interface EServiceTemplateRef {
  /** @format uuid */
  templateId: string
  /** @format uuid */
  templateVersionId?: string
  templateName: string
  templateInterface?: EServiceDoc
  interfaceMetadata?: TemplateInstanceInterfaceMetadata
  isNewTemplateVersionAvailable?: boolean
}

export interface EServiceDoc {
  /** @format uuid */
  id: string
  name: string
  contentType: string
  prettyName: string
  checksum: string
}

export interface UpdateEServiceDescriptorDocumentSeed {
  prettyName: string
}

export interface UpdateRiskAnalysisTemplateAnswerAnnotationDocumentSeed {
  prettyName: string
}

export interface DescriptorRejectionReason {
  rejectionReason: string
  /** @format date-time */
  rejectedAt: string
}

/**
 * EService Descriptor policy for new Agreements approval.
 * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
 * MANUAL - the Producer must approve every agreement for this Descriptor.
 */
export type AgreementApprovalPolicy = 'AUTOMATIC' | 'MANUAL'

export interface Agreement {
  /** @format uuid */
  id: string
  /** @format uuid */
  descriptorId: string
  delegation?: {
    /** @format uuid */
    id: string
    delegate: CompactOrganization
  }
  producer: CompactOrganization
  consumer: Tenant
  eservice: AgreementsEService
  /** Agreement State */
  state: AgreementState
  /** set of the verified attributes belonging to this agreement, if any. */
  verifiedAttributes: VerifiedAttribute[]
  /** set of the certified attributes belonging to this agreement, if any. */
  certifiedAttributes: CertifiedAttribute[]
  /** set of the declared attributes belonging to this agreement, if any. */
  declaredAttributes: DeclaredAttribute[]
  suspendedByConsumer?: boolean
  suspendedByProducer?: boolean
  suspendedByPlatform?: boolean
  isContractPresent: boolean
  consumerNotes?: string
  rejectionReason?: string
  consumerDocuments: Document[]
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt?: string
  /** @format date-time */
  suspendedAt?: string
  isDocumentReady: boolean
}

export interface Agreements {
  results: AgreementListEntry[]
  pagination: Pagination
}

/** contains the information for agreement creation. */
export interface AgreementPayload {
  /** @format uuid */
  eserviceId: string
  /** @format uuid */
  descriptorId: string
  /** @format uuid */
  delegationId?: string
}

/** contains the information for agreement update. */
export interface AgreementUpdatePayload {
  consumerNotes: string
}

/** contains the information for agreement creation. */
export interface AgreementSubmissionPayload {
  consumerNotes?: string
}

/** contains the information for agreement rejection. */
export interface AgreementRejectionPayload {
  reason: string
}

export interface CatalogEServices {
  results: CatalogEService[]
  pagination: Pagination
}

export interface CatalogEService {
  /** @format uuid */
  id: string
  name: string
  description: string
  producer: CompactOrganization
  agreement?: CompactAgreement
  isMine: boolean
  activeDescriptor?: CompactDescriptor
  /** Indicates if there are unread notifications for this e-service */
  hasUnreadNotifications?: boolean
}

export type ClientKind = 'API' | 'CONSUMER'

export interface CompactClients {
  results: CompactClient[]
  pagination: Pagination
}

export interface AgreementListEntry {
  /** @format uuid */
  id: string
  consumer: CompactOrganization
  eservice: CompactEService
  /** Agreement State */
  state: AgreementState
  canBeUpgraded: boolean
  suspendedByConsumer?: boolean
  suspendedByProducer?: boolean
  suspendedByPlatform?: boolean
  descriptor: CompactDescriptor
  delegation?: DelegationWithCompactTenants
  /** Indicates if there are unread notifications for this agreement */
  hasUnreadNotifications: boolean
}

export interface CompactAttribute {
  /** @format uuid */
  id: string
  name: string
}

export interface CompactAgreement {
  /** @format uuid */
  id: string
  /** Agreement State */
  state: AgreementState
  canBeUpgraded: boolean
}

export interface CompactDescriptor {
  /** @format uuid */
  id: string
  /** EService Descriptor State */
  state: EServiceDescriptorState
  version: string
  audience: string[]
  /** @format uuid */
  templateVersionId?: string
}

export interface TemplateInstanceInterfaceRESTSeed {
  contactName: string
  /** @format email */
  contactEmail: string
  /** @format uri */
  contactUrl?: string
  /** @format uri */
  termsAndConditionsUrl?: string
  serverUrls: string[]
}

export interface TemplateInstanceInterfaceSOAPSeed {
  serverUrls: string[]
}

export interface TemplateInstanceInterfaceMetadata {
  contactName?: string
  /** @format email */
  contactEmail?: string
  /** @format uri */
  contactUrl?: string
  /** @format uri */
  termsAndConditionsUrl?: string
}

export interface CompactEService {
  /** @format uuid */
  id: string
  name: string
  producer: CompactOrganization
}

export interface CompactEServices {
  results: CompactEService[]
  pagination: Pagination
}

export interface CompactPurposeEService {
  /** @format uuid */
  id: string
  name: string
  producer: CompactOrganization
  descriptor: CompactDescriptor
  /** Risk Analysis Mode */
  mode: EServiceMode
  personalData?: boolean
}

export interface CompactPurposeTemplateEService {
  /** @format uuid */
  id: string
  name: string
  producer: CompactOrganization
  description?: string
}

/** contains the expected payload for purpose version creation. */
export interface PurposeVersionSeed {
  /**
   * maximum number of daily calls that this version can perform.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCalls: number
}

/** contains the expected payload for purpose creation. */
export interface PurposeSeed {
  /** @format uuid */
  eserviceId: string
  /** @format uuid */
  consumerId: string
  riskAnalysisForm?: RiskAnalysisFormSeed
  title: string
  description: string
  isFreeOfCharge: boolean
  freeOfChargeReason?: string
  /**
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCalls: number
}

/** contains the expected payload for purpose creation from a purpose template */
export interface PurposeFromTemplateSeed {
  /** @format uuid */
  eserviceId: string
  /** @format uuid */
  consumerId: string
  riskAnalysisForm?: RiskAnalysisFormSeed
  title: string
  /**
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCalls: number
}

/** Contains the expected payload for purpose update from template */
export interface PatchPurposeUpdateFromTemplateContent {
  title?: string
  /**
   * Optional in the purpose model, but a purpose cannot exist without a risk analysis.
   * There is no practical use in letting the user remove it, we don't make it nullable.
   */
  riskAnalysisForm?: RiskAnalysisFormSeed
  /**
   * Maximum number of daily calls that this version can perform
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCalls?: number
}

/** contains the expected payload for purpose creation. */
export interface PurposeEServiceSeed {
  /** @format uuid */
  eserviceId: string
  /** @format uuid */
  consumerId: string
  /** @format uuid */
  riskAnalysisId: string
  title: string
  description: string
  isFreeOfCharge: boolean
  freeOfChargeReason?: string
  /**
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCalls: number
}

export interface CompactOrganization {
  /** @format uuid */
  id: string
  name: string
  kind?: TenantKind
  contactMail?: Mail
  /** Indicates if there are unread notifications for this organization */
  hasUnreadNotifications?: boolean
}

export type TenantKind = 'PA' | 'PRIVATE' | 'GSP' | 'SCP'

export interface CompactOrganizations {
  results: CompactOrganization[]
  pagination: Pagination
}

export interface CompactEServiceLight {
  /** @format uuid */
  id: string
  name: string
}

export interface CompactEServicesLight {
  results: CompactEServiceLight[]
  pagination: Pagination
}

/** Agreement State */
export type AgreementState =
  | 'DRAFT'
  | 'ACTIVE'
  | 'ARCHIVED'
  | 'PENDING'
  | 'SUSPENDED'
  | 'MISSING_CERTIFIED_ATTRIBUTES'
  | 'REJECTED'

export interface IdentityToken {
  /** @format jws */
  identity_token: string
}

export interface SessionToken {
  /** @format jws */
  session_token: string
}

export interface Pagination {
  /** @format int32 */
  offset: number
  /** @format int32 */
  limit: number
  /** @format int32 */
  totalCount: number
}

export interface PresignedUrl {
  /** @format uri */
  url: string
}

export interface CompactProducerDescriptor {
  /** @format uuid */
  id: string
  /** EService Descriptor State */
  state: EServiceDescriptorState
  version: string
  audience: string[]
  requireCorrections?: boolean
}

export interface ProducerEService {
  /** @format uuid */
  id: string
  name: string
  /** Risk Analysis Mode */
  mode: EServiceMode
  activeDescriptor?: CompactProducerDescriptor
  draftDescriptor?: CompactProducerDescriptor
  delegation?: DelegationWithCompactTenants
  isTemplateInstance: boolean
  isNewTemplateVersionAvailable?: boolean
  /** Indicates if there are unread notifications for this e-service */
  hasUnreadNotifications?: boolean
}

export interface ProducerEServices {
  results: ProducerEService[]
  pagination: Pagination
}

export interface SelfcareProduct {
  id: string
  name: string
}

export interface SelfcareInstitution {
  /**
   * Institution's unique internal Id
   * @format uuid
   */
  id: string
  /** Institution's legal name */
  description: string
  /** User's roles on product */
  userProductRoles: string[]
  /** The name of the root parent */
  parent?: string
}

export interface Purpose {
  /** @format uuid */
  id: string
  title: string
  description: string
  consumer: CompactOrganization
  riskAnalysisForm?: RiskAnalysisForm
  eservice: CompactPurposeEService
  agreement: CompactAgreement
  /** business representation of a purpose version */
  currentVersion?: PurposeVersion
  versions: PurposeVersion[]
  clients: CompactClient[]
  /** business representation of a purpose version */
  waitingForApprovalVersion?: PurposeVersion
  /** business representation of a purpose version */
  rejectedVersion?: PurposeVersion
  suspendedByConsumer?: boolean
  suspendedByProducer?: boolean
  isFreeOfCharge: boolean
  freeOfChargeReason?: string
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal: number
  delegation?: DelegationWithCompactTenants
  /** Indicates if there are unread notifications for this purpose */
  hasUnreadNotifications: boolean
  /** Contains some information about the purpose template */
  purposeTemplate?: CompactPurposeTemplate
  isDocumentReady: boolean
  /** @format date-time */
  rulesetExpiration?: string
}

export interface PurposeAdditionDetailsSeed {
  /** @format uuid */
  purposeId: string
}

/** Contains some information about the purpose template */
export interface CompactPurposeTemplate {
  /** @format uuid */
  id: string
  purposeTitle: string
}

/** Business representation of a purpose template */
export interface PurposeTemplate {
  /** @format uuid */
  id: string
  targetDescription: string
  targetTenantKind: TenantKind
  /** @format uuid */
  creatorId: string
  /** Purpose Template State */
  state: PurposeTemplateState
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt?: string
  purposeTitle: string
  purposeDescription: string
  purposeRiskAnalysisForm?: RiskAnalysisFormTemplate
  purposeIsFreeOfCharge: boolean
  purposeFreeOfChargeReason?: string
  /**
   * @format int32
   * @min 1
   * @max 1000000000
   */
  purposeDailyCalls?: number
  handlesPersonalData: boolean
}

/** Purpose Template State */
export type PurposeTemplateState = 'PUBLISHED' | 'DRAFT' | 'SUSPENDED' | 'ARCHIVED'

/** a purpose template with its creator and a list for the answer annotation documents */
export interface PurposeTemplateWithCompactCreator {
  /** @format uuid */
  id: string
  targetDescription: string
  targetTenantKind: TenantKind
  creator: CompactOrganization
  /** Purpose Template State */
  state: PurposeTemplateState
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt?: string
  purposeTitle: string
  purposeDescription: string
  purposeRiskAnalysisForm?: RiskAnalysisFormTemplate
  purposeIsFreeOfCharge: boolean
  purposeFreeOfChargeReason?: string
  /**
   * @format int32
   * @min 1
   * @max 1000000000
   */
  purposeDailyCalls?: number
  annotationDocuments?: RiskAnalysisTemplateAnswerAnnotationDocument[]
  handlesPersonalData: boolean
}

export interface PurposeTemplateSeed {
  /**
   * @minLength 10
   * @maxLength 250
   */
  targetDescription: string
  targetTenantKind: TenantKind
  /**
   * @minLength 5
   * @maxLength 60
   */
  purposeTitle: string
  /**
   * @minLength 10
   * @maxLength 250
   */
  purposeDescription: string
  purposeRiskAnalysisForm?: RiskAnalysisFormTemplateSeed
  purposeIsFreeOfCharge: boolean
  purposeFreeOfChargeReason?: string
  /**
   * @format int32
   * @min 1
   * @max 1000000000
   */
  purposeDailyCalls?: number
  handlesPersonalData: boolean
}

export interface RiskAnalysisFormTemplate {
  /**
   * @minLength 1
   * @maxLength 250
   */
  version: string
  answers: any
}

export interface RiskAnalysisFormTemplateSeed {
  /**
   * @minLength 1
   * @maxLength 250
   */
  version: string
  answers: any
}

export interface RiskAnalysisTemplateAnswer {
  /** @format uuid */
  id: string
  values: string[]
  editable: boolean
  annotation?: RiskAnalysisTemplateAnswerAnnotation
  suggestedValues: string[]
}

/** A single risk analysis answer with explicit key and data */
export interface RiskAnalysisTemplateAnswerRequest {
  /** The identifier of the risk analysis answer */
  answerKey: string
  answerData: RiskAnalysisTemplateAnswerSeed
}

export interface RiskAnalysisTemplateAnswerSeed {
  values: string[]
  editable: boolean
  annotation?: RiskAnalysisTemplateAnswerAnnotationSeed
  suggestedValues: string[]
}

export interface RiskAnalysisTemplateAnswerAnnotation {
  /** @format uuid */
  id: string
  text: string
  docs: RiskAnalysisTemplateAnswerAnnotationDocument[]
}

export interface RiskAnalysisTemplateAnswerAnnotationSeed {
  /**
   * @minLength 1
   * @maxLength 2000
   */
  text: string
}

export interface EServiceDescriptorPurposeTemplate {
  /** @format uuid */
  purposeTemplateId: string
  /** @format uuid */
  eserviceId: string
  /** @format uuid */
  descriptorId: string
  /** @format date-time */
  createdAt: string
}

export interface CreatorPurposeTemplate {
  /** @format uuid */
  id: string
  targetTenantKind: TenantKind
  purposeTitle: string
  /** Purpose Template State */
  state: PurposeTemplateState
}

export interface CreatorPurposeTemplates {
  results: CreatorPurposeTemplate[]
  pagination: Pagination
}

export interface CatalogPurposeTemplate {
  /** @format uuid */
  id: string
  targetTenantKind: TenantKind
  purposeTitle: string
  purposeDescription: string
  creator: CompactOrganization
}

export interface CatalogPurposeTemplates {
  results: CatalogPurposeTemplate[]
  pagination: Pagination
}

export interface RiskAnalysisTemplateAnswerResponse {
  /** @format uuid */
  id: string
  values: string[]
  editable: boolean
  annotation?: RiskAnalysisTemplateAnswerAnnotation
  suggestedValues: string[]
}

export interface RiskAnalysisTemplateAnswerAnnotationDocument {
  /** @format uuid */
  id: string
  name: string
  contentType: string
  prettyName: string
  path: string
  /** @format date-time */
  createdAt: string
  checksum: string
}

export type CompactUsers = CompactUser[]

/** Models the seed for a public key to be persisted */
export interface KeySeed {
  /** Base64 UTF-8 encoding of a public key in PEM format */
  key: string
  /** Represents the Use field of key */
  use: KeyUse
  /** The algorithm type of the key. */
  alg: string
  /**
   * Name given to the current key.
   * @minLength 5
   * @maxLength 60
   */
  name: string
}

/** Represents the Use field of key */
export type KeyUse = 'SIG' | 'ENC'

export interface EncodedClientKey {
  /** base64 encoded key */
  key: string
}

/** Client creation request body */
export interface ClientSeed {
  name: string
  description?: string
  members: string[]
}

export interface CompactClient {
  /** @format uuid */
  id: string
  name: string
  hasKeys: boolean
  /** Contains some details about user */
  admin?: CompactUser
  /** Indicates if there are unread notifications for this client */
  hasUnreadNotifications?: boolean
}

/** Producer keychain creation request body */
export interface ProducerKeychainSeed {
  /**
   * @minLength 5
   * @maxLength 60
   */
  name: string
  /**
   * @minLength 10
   * @maxLength 250
   */
  description: string
  members: string[]
}

export interface CompactProducerKeychain {
  /** @format uuid */
  id: string
  name: string
  hasKeys: boolean
  /** Indicates if there are unread notifications for this keychain */
  hasUnreadNotifications?: boolean
}

export interface CompactProducerKeychains {
  results: CompactProducerKeychain[]
  pagination: Pagination
}

/** Models Producer keychain details */
export interface ProducerKeychain {
  /** @format uuid */
  id: string
  /** @format date-time */
  createdAt: string
  producer: CompactOrganization
  name: string
  eservices: CompactEService[]
  description: string
}

export interface EServiceAdditionDetailsSeed {
  /** @format uuid */
  eserviceId: string
}

/** contains the expected payload for purpose update. */
export interface PurposeUpdateContent {
  title: string
  description: string
  isFreeOfCharge: boolean
  freeOfChargeReason?: string
  riskAnalysisForm?: RiskAnalysisFormSeed
  /**
   * maximum number of daily calls that this version can perform.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCalls: number
}

/** contains the expected payload for purpose update. */
export interface ReversePurposeUpdateContent {
  title: string
  description: string
  isFreeOfCharge: boolean
  freeOfChargeReason?: string
  /**
   * maximum number of daily calls that this version can perform.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCalls: number
}

export interface Purposes {
  results: Purpose[]
  pagination: Pagination
}

export interface DelegationWithCompactTenants {
  /** @format uuid */
  id: string
  delegate: CompactOrganization
  delegator: CompactOrganization
}

/** business representation of a purpose version */
export interface PurposeVersion {
  /** @format uuid */
  id: string
  /** Purpose State */
  state: PurposeVersionState
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  suspendedAt?: string
  /** @format date-time */
  updatedAt?: string
  /** @format date-time */
  firstActivationAt?: string
  /**
   * maximum number of daily calls that this version can perform.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCalls: number
  riskAnalysisDocument?: PurposeVersionDocument
  rejectionReason?: string
}

export interface PurposeVersionDocument {
  /** @format uuid */
  id: string
  contentType: string
  /** @format date-time */
  createdAt: string
}

/** contains the purposeId and the versionId of the created resource */
export interface PurposeVersionResource {
  /** @format uuid */
  purposeId: string
  /** @format uuid */
  versionId: string
}

/** Purpose State */
export type PurposeVersionState =
  | 'ACTIVE'
  | 'DRAFT'
  | 'SUSPENDED'
  | 'REJECTED'
  | 'WAITING_FOR_APPROVAL'
  | 'ARCHIVED'

export interface User {
  /** @format uuid */
  userId: string
  /** @format uuid */
  tenantId: string
  name: string
  familyName: string
  roles: string[]
}

export type Users = User[]

export interface RiskAnalysisForm {
  version: string
  answers: any
  /** @format uuid */
  riskAnalysisId?: string
}

export interface RiskAnalysisFormSeed {
  version: string
  answers: any
}

/** contains the id of the created resource */
export interface CreatedResource {
  /** @format uuid */
  id: string
}

/** sets the delegation ID in order to operate as a delegate for a specific active delegation */
export interface DelegationRef {
  /** @format uuid */
  delegationId?: string
}

/** contains the id of the created resource with the descriptorId */
export interface CreatedEServiceDescriptor {
  /** @format uuid */
  id: string
  /** @format uuid */
  descriptorId: string
}

export interface Document {
  /** @format uuid */
  id: string
  name: string
  prettyName: string
  contentType: string
  /** @format date-time */
  createdAt: string
}

export interface AgreementsEService {
  /** @format uuid */
  id: string
  name: string
  version: string
  activeDescriptor?: CompactDescriptor
}

/** EService Descriptor State */
export type EServiceDescriptorState =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'DEPRECATED'
  | 'SUSPENDED'
  | 'ARCHIVED'
  | 'WAITING_FOR_APPROVAL'

/** EService Descriptor State */
export type EServiceTechnology = 'REST' | 'SOAP'

export interface DescriptorAttributes {
  certified: DescriptorAttribute[][]
  declared: DescriptorAttribute[][]
  verified: DescriptorAttribute[][]
}

export interface DescriptorAttribute {
  /** @format uuid */
  id: string
  name: string
  description: string
  explicitAttributeVerification: boolean
}

export interface DescriptorAttributesSeed {
  certified: DescriptorAttributeSeed[][]
  declared: DescriptorAttributeSeed[][]
  verified: DescriptorAttributeSeed[][]
}

export interface DescriptorAttributeSeed {
  /** @format uuid */
  id: string
  explicitAttributeVerification: boolean
}

/**
 * AttributeSeed
 * Models the attribute registry entry as payload response
 */
export interface CertifiedAttributeSeed {
  description: string
  name: string
}

/**
 * AttributeSeed
 * Models the attribute registry entry as payload response
 */
export interface AttributeSeed {
  description: string
  name: string
}

/**
 * Attribute
 * Models the attribute registry entry as payload response
 */
export interface Attribute {
  /**
   * uniquely identifies the attribute on the registry
   * @format uuid
   */
  id: string
  /** identifies the unique code of this attribute on the origin registry */
  code?: string
  kind: AttributeKind
  description: string
  /** represents the origin of this attribute (e.g.: IPA, Normattiva, etc.) */
  origin?: string
  name: string
  /** @format date-time */
  creationTime: string
}

/**
 * VerifiedAttribute
 * represents the details of a verified attribute bound to the agreement.
 */
export interface VerifiedAttribute {
  /**
   * uniquely identifies the attribute on the registry
   * @format uuid
   */
  id: string
  description: string
  name: string
  /** @format date-time */
  creationTime: string
}

/**
 * DeclaredAttribute
 * represents the details of a declared attribute bound to the agreement.
 */
export interface DeclaredAttribute {
  /**
   * uniquely identifies the attribute on the registry
   * @format uuid
   */
  id: string
  description: string
  name: string
  /** @format date-time */
  creationTime: string
}

export interface RequesterCertifiedAttribute {
  /** @format uuid */
  tenantId: string
  tenantName: string
  /** @format uuid */
  attributeId: string
  attributeName: string
}

export interface RequesterCertifiedAttributes {
  results: RequesterCertifiedAttribute[]
  pagination: Pagination
}

/**
 * CertifiedAttribute
 * Models a certified attribute registry entry as payload response
 */
export interface CertifiedAttribute {
  /**
   * uniquely identifies the attribute on the registry
   * @format uuid
   */
  id: string
  description: string
  name: string
  /** @format date-time */
  creationTime: string
}

/** CertifiedAttributesResponse */
export interface CertifiedAttributesResponse {
  attributes: CertifiedTenantAttribute[]
}

/** DeclaredAttributesResponse */
export interface DeclaredAttributesResponse {
  attributes: DeclaredTenantAttribute[]
}

/** VerifiedAttributesResponse */
export interface VerifiedAttributesResponse {
  attributes: VerifiedTenantAttribute[]
}

export type AttributeKind = 'CERTIFIED' | 'DECLARED' | 'VERIFIED'

/** Attributes */
export interface Attributes {
  pagination: Pagination
  results: CompactAttribute[]
}

export interface ExternalId {
  origin: string
  value: string
}

export interface FileResource {
  filename: string
  /** @format uri */
  url: string
}

export type MailKind = 'CONTACT_EMAIL' | 'DIGITAL_ADDRESS'

/** A specific kind of mail */
export interface MailSeed {
  kind: MailKind
  address: string
  description?: string
}

/** Tenants */
export interface Tenants {
  results: CompactTenant[]
  pagination: Pagination
}

export type TenantFeatureType = 'PERSISTENT_CERTIFIER' | 'DELEGATED_PRODUCER' | 'DELEGATED_CONSUMER'

export type TenantFeature =
  | {
      /** Certifier Tenant Feature */
      certifier?: Certifier
    }
  | {
      /** Delegated producer Tenant Feature */
      delegatedProducer?: DelegatedProducer
    }
  | {
      /** Delegated consumer Tenant Feature */
      delegatedConsumer?: DelegatedConsumer
    }

/** Certifier Tenant Feature */
export interface Certifier {
  certifierId: string
}

/** Delegated producer Tenant Feature */
export interface DelegatedProducer {
  /** @format date-time */
  availabilityTimestamp: string
}

/** Delegated consumer Tenant Feature */
export interface DelegatedConsumer {
  /** @format date-time */
  availabilityTimestamp: string
}

export interface CompactTenant {
  /** @format uuid */
  id: string
  selfcareId?: string
  name: string
  logoUrl?: string
}

export interface Tenant {
  /** @format uuid */
  id: string
  /** @format uuid */
  selfcareId?: string
  kind?: TenantKind
  externalId: ExternalId
  features: TenantFeature[]
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt?: string
  name: string
  attributes: TenantAttributes
  contactMail?: Mail
  /** @format date-time */
  onboardedAt?: string
  subUnitType?: TenantUnitType
}

export type TenantUnitType = 'AOO' | 'UO'

export interface TenantAttributes {
  declared: DeclaredTenantAttribute[]
  certified: CertifiedTenantAttribute[]
  verified: VerifiedTenantAttribute[]
}

export interface DeclaredTenantAttribute {
  /** @format uuid */
  id: string
  name: string
  description: string
  /** @format date-time */
  assignmentTimestamp: string
  /** @format date-time */
  revocationTimestamp?: string
  /** @format uuid */
  delegationId?: string
}

export interface DeclaredTenantAttributeSeed {
  /** @format uuid */
  id: string
  /** @format uuid */
  delegationId?: string
}

export interface UpdateVerifiedTenantAttributeSeed {
  /** @format date-time */
  expirationDate?: string
}

export interface VerifiedTenantAttributeSeed {
  /** @format uuid */
  id: string
  /** @format uuid */
  agreementId: string
  /** @format date-time */
  expirationDate?: string
}

export interface TenantDelegatedFeaturesFlagsUpdateSeed {
  isDelegatedConsumerFeatureEnabled: boolean
  isDelegatedProducerFeatureEnabled: boolean
}

export interface CertifiedTenantAttribute {
  /** @format uuid */
  id: string
  name: string
  description: string
  /** @format date-time */
  assignmentTimestamp: string
  /** @format date-time */
  revocationTimestamp?: string
}

export interface VerifiedTenantAttribute {
  /** @format uuid */
  id: string
  name: string
  description: string
  /** @format date-time */
  assignmentTimestamp: string
  verifiedBy: TenantVerifier[]
  revokedBy: TenantRevoker[]
}

export interface TenantVerifier {
  /** @format uuid */
  id: string
  /** @format date-time */
  verificationDate: string
  /** @format date-time */
  expirationDate?: string
  /** @format date-time */
  extensionDate?: string
  /** @format uuid */
  delegationId?: string
}

export interface TenantRevoker {
  /** @format uuid */
  id: string
  /** @format date-time */
  verificationDate: string
  /** @format date-time */
  expirationDate?: string
  /** @format date-time */
  extensionDate?: string
  /** @format date-time */
  revocationDate: string
  /** @format uuid */
  delegationId?: string
}

export interface TokenGenerationValidationResult {
  clientKind?: ClientKind
  steps: TokenGenerationValidationSteps
  eservice?: TokenGenerationValidationEService
}

export interface TokenGenerationValidationSteps {
  clientAssertionValidation: TokenGenerationValidationEntry
  publicKeyRetrieve: TokenGenerationValidationEntry
  clientAssertionSignatureVerification: TokenGenerationValidationEntry
  platformStatesVerification: TokenGenerationValidationEntry
}

export interface TokenGenerationValidationEntry {
  /** Token Generation Validation Step RESULT */
  result: TokenGenerationValidationStepResult
  failures: TokenGenerationValidationStepFailure[]
}

/** Token Generation Validation Step RESULT */
export type TokenGenerationValidationStepResult = 'PASSED' | 'SKIPPED' | 'FAILED'

export interface TokenGenerationValidationStepFailure {
  code: string
  reason: string
}

export interface TokenGenerationValidationEService {
  /** @format uuid */
  id: string
  /** @format uuid */
  descriptorId: string
  version: string
  name: string
}

export interface PublicKey {
  keyId: string
  name: string
  /** Contains some details about user */
  user: CompactUser
  /** @format date-time */
  createdAt: string
  isOrphan: boolean
}

/** Contains some details about user */
export interface CompactUser {
  /** @format uuid */
  userId: string
  name: string
  familyName: string
}

export interface PublicKeys {
  keys: PublicKey[]
  pagination: Pagination
}

export interface CertifiedTenantAttributeSeed {
  /** @format uuid */
  id: string
}

/** Delegation State */
export type DelegationKind = 'DELEGATED_PRODUCER' | 'DELEGATED_CONSUMER'

/** Delegation State */
export type DelegationState = 'WAITING_FOR_APPROVAL' | 'ACTIVE' | 'REJECTED' | 'REVOKED'

export interface DelegationTenant {
  /** @format uuid */
  id: string
  name: string
}

export interface DelegationTenants {
  results: DelegationTenant[]
  pagination: Pagination
}

export interface DelegationEService {
  /** @format uuid */
  id: string
  name: string
  description?: string
  /** @format uuid */
  producerId: string
  producerName: string
  descriptors: CompactDescriptor[]
}

export interface Delegation {
  /** @format uuid */
  id: string
  eservice?: DelegationEService
  delegate: DelegationTenant
  delegator: DelegationTenant
  activationContract?: Document
  revocationContract?: Document
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt?: string
  rejectionReason?: string
  /** Delegation State */
  state: DelegationState
  /** Delegation State */
  kind: DelegationKind
  isDocumentReady: boolean
}

export interface CompactDelegation {
  /** @format uuid */
  id: string
  eservice?: CompactEServiceLight
  delegate: DelegationTenant
  delegator: DelegationTenant
  /** Delegation State */
  state: DelegationState
  /** Delegation State */
  kind: DelegationKind
  /** Indicates if there are unread notifications for this delegation */
  hasUnreadNotifications?: boolean
}

export interface CompactDelegations {
  results: CompactDelegation[]
  pagination: Pagination
}

export interface DelegationSeed {
  /** @format uuid */
  eserviceId: string
  /** @format uuid */
  delegateId: string
}

export interface RejectDelegationPayload {
  rejectionReason: string
}

export interface EServiceTemplateNameUpdateSeed {
  name: string
}

export interface EServiceTemplateDescriptionUpdateSeed {
  description: string
}

export interface EServiceTemplateIntendedTargetUpdateSeed {
  intendedTarget: string
}

/** EService Descriptor State */
export type EServiceTemplateVersionState = 'DRAFT' | 'PUBLISHED' | 'DEPRECATED' | 'SUSPENDED'

export interface CompactEServiceTemplateVersion {
  /** @format uuid */
  id: string
  /** @format int32 */
  version: number
  /** EService Descriptor State */
  state: EServiceTemplateVersionState
}

export interface EServiceTemplateDetails {
  /** @format uuid */
  id: string
  creator: CompactOrganization
  name: string
  intendedTarget: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  versions: CompactEServiceTemplateVersion[]
  riskAnalysis: EServiceTemplateRiskAnalysis[]
  /** Risk Analysis Mode */
  mode: EServiceMode
  isSignalHubEnabled?: boolean
  personalData?: boolean
  draftVersion?: CompactEServiceTemplateVersion
}

export interface EServiceTemplateVersionDetails {
  /** @format uuid */
  id: string
  /** @format int32 */
  version: number
  description?: string
  /** @format int32 */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford per consumer.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer?: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal?: number
  interface?: EServiceDoc
  docs: EServiceDoc[]
  /** EService Descriptor State */
  state: EServiceTemplateVersionState
  /**
   * EService Descriptor policy for new Agreements approval.
   * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
   * MANUAL - the Producer must approve every agreement for this Descriptor.
   */
  agreementApprovalPolicy?: AgreementApprovalPolicy
  attributes: DescriptorAttributes
  eserviceTemplate: EServiceTemplateDetails
  isAlreadyInstantiated: boolean
  hasRequesterRiskAnalysis?: boolean
  personalData?: boolean
}

export interface EServiceTemplateVersionQuotasUpdateSeed {
  /**
   * @format int32
   * @min 60
   * @max 86400
   */
  voucherLifespan: number
  /**
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer?: number
  /**
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal?: number
}

/** contains the id of the created resource with the versionId */
export interface CreatedEServiceTemplateVersion {
  /** @format uuid */
  id: string
  /** @format uuid */
  versionId: string
}

export interface UpdateEServiceTemplateSeed {
  /**
   * @minLength 5
   * @maxLength 60
   */
  name: string
  /**
   * @minLength 10
   * @maxLength 250
   */
  intendedTarget: string
  /**
   * @minLength 10
   * @maxLength 250
   */
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  /** Risk Analysis Mode */
  mode: EServiceMode
  isSignalHubEnabled?: boolean
  personalData?: boolean
}

export interface EServiceTemplateSeed {
  /**
   * @minLength 5
   * @maxLength 60
   */
  name: string
  /**
   * @minLength 10
   * @maxLength 250
   */
  intendedTarget: string
  /**
   * @minLength 10
   * @maxLength 250
   */
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  /** Risk Analysis Mode */
  mode: EServiceMode
  version?: VersionSeedForEServiceTemplateCreation
  isSignalHubEnabled?: boolean
  personalData?: boolean
}

export interface InstanceEServiceSeed {
  isSignalHubEnabled?: boolean
  isConsumerDelegable?: boolean
  isClientAccessDelegable?: boolean
}

export interface VersionSeedForEServiceTemplateCreation {
  /**
   * @minLength 10
   * @maxLength 250
   */
  description?: string
  /**
   * @format int32
   * @min 60
   * @max 86400
   */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer?: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal?: number
  /**
   * EService Descriptor policy for new Agreements approval.
   * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
   * MANUAL - the Producer must approve every agreement for this Descriptor.
   */
  agreementApprovalPolicy?: AgreementApprovalPolicy
}

export interface EServiceTemplateInstance {
  /** @format uuid */
  id: string
  name: string
  /** @format uuid */
  producerId: string
  producerName: string
  latestDescriptor?: CompactDescriptor
  descriptors: CompactDescriptor[]
}

export interface EServiceTemplateInstances {
  results: EServiceTemplateInstance[]
  pagination: Pagination
}

export interface CatalogEServiceTemplate {
  /** @format uuid */
  id: string
  name: string
  description: string
  creator: CompactOrganization
  publishedVersion: CompactEServiceTemplateVersion
}

export interface ProducerEServiceTemplate {
  /** @format uuid */
  id: string
  name: string
  /** Risk Analysis Mode */
  mode: EServiceMode
  activeVersion?: CompactEServiceTemplateVersion
  draftVersion?: CompactEServiceTemplateVersion
  /** Indicates if there are unread notifications for this e-service template */
  hasUnreadNotifications: boolean
}

export interface CatalogEServiceTemplates {
  results: CatalogEServiceTemplate[]
  pagination: Pagination
}

export interface ProducerEServiceTemplates {
  results: ProducerEServiceTemplate[]
  pagination: Pagination
}

export interface Problem {
  /** URI reference of type definition */
  type: string
  /**
   * The HTTP status code generated by the origin server for this occurrence of the problem.
   * @format int32
   * @min 100
   * @max 600
   * @exclusiveMax true
   * @example 503
   */
  status: number
  /**
   * A short, summary of the problem type. Written in english and readable
   * @maxLength 64
   * @pattern ^[ -~]{0,64}$
   * @example "Service Unavailable"
   */
  title: string
  /**
   * Unique identifier of the request
   * @maxLength 64
   * @example "53af4f2d-0c87-41ef-a645-b726a821852b"
   */
  correlationId?: string
  /**
   * A human readable explanation of the problem.
   * @maxLength 4096
   * @pattern ^.{0,1024}$
   * @example "Request took too long to complete."
   */
  detail?: string
  /** @minItems 1 */
  errors: ProblemError[]
}

export interface UpdateEServiceTemplateVersionSeed {
  /**
   * @minLength 10
   * @maxLength 250
   */
  description?: string
  /**
   * @format int32
   * @min 60
   * @max 86400
   */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsPerConsumer?: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 1
   * @max 1000000000
   */
  dailyCallsTotal?: number
  /**
   * EService Descriptor policy for new Agreements approval.
   * AUTOMATIC - the agreement will be automatically approved if Consumer attributes are met
   * MANUAL - the Producer must approve every agreement for this Descriptor.
   */
  agreementApprovalPolicy?: AgreementApprovalPolicy
  attributes: EServiceTemplateAttributesSeed
}

export interface EServiceTemplateAttributesSeed {
  certified: EServiceTemplateVersionAttributeSeed[][]
  declared: EServiceTemplateVersionAttributeSeed[][]
  verified: EServiceTemplateVersionAttributeSeed[][]
}

export interface EServiceTemplateVersionAttributeSeed {
  /** @format uuid */
  id: string
  explicitAttributeVerification: boolean
}

export interface EServiceTemplatePersonalDataFlagUpdateSeed {
  personalData: boolean
}

export interface UpdateEServiceTemplateVersionDocumentSeed {
  /**
   * @minLength 5
   * @maxLength 60
   */
  prettyName: string
}

export interface Notifications {
  results: Notification[]
  pagination: Pagination
}

export interface Notification {
  /**
   * Unique identifier of the notification
   * @format uuid
   */
  id: string
  /**
   * ID of the user
   * @format uuid
   */
  userId: string
  /**
   * ID of the tenant
   * @format uuid
   */
  tenantId: string
  /** Content of the notification */
  body: string
  /** Deep link to the notification */
  deepLink: string
  /** Category of the notification */
  category: string
  /**
   * Timestamp when the notification was read
   * @format date-time
   */
  readAt?: string | null
  /**
   * Timestamp when the notification was created
   * @format date-time
   */
  createdAt: string
}

export interface NotificationConfig {
  agreementSuspendedUnsuspendedToProducer: boolean
  agreementManagementToProducer: boolean
  clientAddedRemovedToProducer: boolean
  purposeStatusChangedToProducer: boolean
  templateStatusChangedToProducer: boolean
  agreementSuspendedUnsuspendedToConsumer: boolean
  eserviceStateChangedToConsumer: boolean
  agreementActivatedRejectedToConsumer: boolean
  purposeActivatedRejectedToConsumer: boolean
  purposeSuspendedUnsuspendedToConsumer: boolean
  newEserviceTemplateVersionToInstantiator: boolean
  eserviceTemplateNameChangedToInstantiator: boolean
  eserviceTemplateStatusChangedToInstantiator: boolean
  delegationApprovedRejectedToDelegator: boolean
  eserviceNewVersionSubmittedToDelegator: boolean
  eserviceNewVersionApprovedRejectedToDelegate: boolean
  delegationSubmittedRevokedToDelegate: boolean
  certifiedVerifiedAttributeAssignedRevokedToAssignee: boolean
  clientKeyAndProducerKeychainKeyAddedDeletedToClientUsers: boolean
}

export interface TenantNotificationConfig {
  enabled: boolean
}

export interface UserNotificationConfig {
  inAppNotificationPreference: boolean
  emailNotificationPreference: 'ENABLED' | 'DISABLED' | 'DIGEST'
  inAppConfig: NotificationConfig
  emailConfig: NotificationConfig
}

export interface TenantNotificationConfigUpdateSeed {
  enabled: boolean
}

export interface UserNotificationConfigUpdateSeed {
  inAppNotificationPreference: boolean
  emailNotificationPreference: 'ENABLED' | 'DISABLED' | 'DIGEST'
  inAppConfig: NotificationConfig
  emailConfig: NotificationConfig
}

export interface EServiceDescriptorsPurposeTemplate {
  results: EServiceDescriptorPurposeTemplateWithCompactEServiceAndDescriptor[]
  pagination: Pagination
}

export interface EServiceDescriptorPurposeTemplateWithCompactEServiceAndDescriptor {
  /** @format uuid */
  purposeTemplateId: string
  eservice: CompactPurposeTemplateEService
  descriptor: CompactDescriptor
  /** @format date-time */
  createdAt: string
}

export interface NotificationsCountBySection {
  erogazione: {
    /** @format int32 */
    richieste: number
    /** @format int32 */
    finalita: number
    /** @format int32 */
    'template-eservice': number
    /** @format int32 */
    'e-service': number
    /** @format int32 */
    portachiavi: number
    /** @format int32 */
    totalCount: number
  }
  fruizione: {
    /** @format int32 */
    richieste: number
    /** @format int32 */
    finalita: number
    /** @format int32 */
    totalCount: number
  }
  'catalogo-e-service': {
    /** @format int32 */
    totalCount: number
  }
  aderente: {
    /** @format int32 */
    deleghe: number
    /** @format int32 */
    anagrafica: number
    /** @format int32 */
    totalCount: number
  }
  'gestione-client': {
    /** @format int32 */
    'api-e-service': number
    /** @format int32 */
    totalCount: number
  }
  notifiche: {
    /** @format int32 */
    totalCount: number
  }
}

/** Filter e-services by personal data */
export type PersonalDataFilter = 'TRUE' | 'FALSE' | 'DEFINED'

export interface ProblemError {
  /**
   * Internal code of the error
   * @minLength 8
   * @maxLength 8
   * @pattern ^[0-9]{3}-[0-9]{4}$
   * @example "123-4567"
   */
  code: string
  /**
   * A human readable explanation specific to this occurrence of the problem.
   * @maxLength 4096
   * @pattern ^.{0,1024}$
   * @example "Parameter not valid"
   */
  detail: string
}

export interface GetConsumerAgreementsParams {
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
  /**
   * comma separated sequence of eservices IDs
   * @default []
   */
  eservicesIds?: string[]
  /**
   * comma separated sequence of producers IDs
   * @default []
   */
  producersIds?: string[]
  /**
   * comma separated sequence of agreement states to filter the response with
   * @default []
   */
  states?: AgreementState[]
  /** @default false */
  showOnlyUpgradeable?: boolean
}

export interface GetProducerAgreementsParams {
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
  /**
   * comma separated sequence of eservices IDs
   * @default []
   */
  eservicesIds?: string[]
  /**
   * comma separated sequence of consumers IDs
   * @default []
   */
  consumersIds?: string[]
  /**
   * comma separated sequence of agreement states to filter the response with
   * @default []
   */
  states?: AgreementState[]
  /** @default false */
  showOnlyUpgradeable?: boolean
}

export interface GetAgreementsProducersParams {
  /** Query to filter Producers by name */
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetAgreementsConsumersParams {
  /** Query to filter Consumers by name */
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface AddAgreementConsumerDocumentPayload {
  name: string
  prettyName: string
  /** @format binary */
  doc: File
}

export interface GetEServicesCatalogParams {
  /** if "TRUE" only e-services that handle personal data will be returned, if "FALSE" only non-personal data e-services will be returned, if not present all e-services will be returned, if "DEFINED" all e-services with a defined personal data flag will be returned */
  personalData?: PersonalDataFilter
  /** Query to filter EServices by name */
  q?: string
  /**
   * comma separated sequence of producers IDs
   * @default []
   */
  producersIds?: string[]
  /**
   * comma separated sequence of attribute IDs
   * @default []
   */
  attributesIds?: string[]
  /**
   * comma separated sequence of states
   * @default []
   */
  states?: EServiceDescriptorState[]
  /**
   * comma separated sequence of agreement states to filter the response with
   * @default []
   */
  agreementStates?: AgreementState[]
  /** EService Mode filter */
  mode?: EServiceMode
  /** EService isConsumerDelegable filter */
  isConsumerDelegable?: boolean
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 200
   */
  limit: number
}

export interface GetConsumerDelegatorsParams {
  q?: string
  /**
   * comma separated sequence of EService IDs
   * @default []
   */
  eserviceIds?: string[]
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetConsumerDelegatorsWithAgreementsParams {
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetConsumersParams {
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface CreateEServiceDocumentPayload {
  /** Document Type */
  kind: 'INTERFACE' | 'DOCUMENT'
  prettyName: string
  /** @format binary */
  doc: File
}

export interface GetImportEservicePresignedUrlParams {
  fileName: string
}

export interface GetEServiceTemplateInstancesParams {
  /** Query to filter by producer name */
  producerName?: string
  /**
   * comma separated sequence of instance states
   * @default []
   */
  states?: EServiceDescriptorState[]
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
  /**
   * the eservice template id
   * @format uuid
   */
  templateId: string
}

export interface GetProducersParams {
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetProducerEServicesParams {
  /** if "TRUE" only e-services that handle personal data will be returned, if "FALSE" only non-personal data e-services will be returned, if not present all e-services will be returned, if "DEFINED" all e-services with a defined personal data flag will be returned */
  personalData?: PersonalDataFilter
  /** Query to filter EServices by name */
  q?: string
  /**
   * comma separated sequence of consumers IDs
   * @default []
   */
  consumersIds?: string[]
  /** if true only delegated e-services will be returned, if false only non-delegated e-services will be returned, if not present all e-services will be returned */
  delegated?: boolean
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetAgreementsProducerEServicesParams {
  /** Query to filter EServices by name */
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetAgreementsConsumerEServicesParams {
  /** Query to filter EServices by name */
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetInstitutionUsersParams {
  /**
   * the person identifier
   * @format uuid
   */
  personId?: string
  /**
   * comma separated sequence of role to filter the response with
   * @default []
   */
  roles?: string[]
  /** filter applied to name/surname */
  query?: string
  /**
   * The internal identifier of the tenant
   * @format uuid
   */
  tenantId: string
}

export interface GetRequesterCertifiedAttributesParams {
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetProducerPurposesParams {
  q?: string
  /**
   * comma separated sequence of EService IDs
   * @default []
   */
  eservicesIds?: string[]
  /**
   * comma separated sequence of consumers IDs
   * @default []
   */
  consumersIds?: string[]
  /**
   * comma separated sequence of states
   * @default []
   */
  states?: PurposeVersionState[]
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetConsumerPurposesParams {
  q?: string
  /**
   * comma separated sequence of EService IDs
   * @default []
   */
  eservicesIds?: string[]
  /**
   * comma separated sequence of producers IDs
   * @default []
   */
  producersIds?: string[]
  /**
   * comma separated sequence of states
   * @default []
   */
  states?: PurposeVersionState[]
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetPublishedPurposeTemplateCreatorsParams {
  /** Query to filter creators by name */
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface LinkEServiceToPurposeTemplatePayload {
  /** @format uuid */
  eserviceId: string
}

export interface UnlinkEServiceToPurposeTemplatePayload {
  /** @format uuid */
  eserviceId: string
}

export interface GetPurposeTemplateEServicesParams {
  /**
   * comma separated sequence of e-service producer IDs
   * @default []
   */
  producerIds?: string[]
  /** filter linked e-services by name */
  eserviceName?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
  /** @format uuid */
  purposeTemplateId: string
}

export interface GetCreatorPurposeTemplatesParams {
  /** filter by purpose template title */
  q?: string
  /**
   * comma separated sequence of e-service IDs
   * @default []
   */
  eserviceIds?: string[]
  /**
   * comma separated sequence of purpose template states
   * @default []
   */
  states?: PurposeTemplateState[]
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetCatalogPurposeTemplatesParams {
  /** filter by purpose template title */
  q?: string
  /**
   * comma separated sequence of creators IDs
   * @default []
   */
  creatorIds?: string[]
  /**
   * comma separated sequence of e-service IDs
   * @default []
   */
  eserviceIds?: string[]
  /** filter by target tenant kind */
  targetTenantKind?: TenantKind
  /**
   * exclude purpose templates with expired risk analysis
   * @default true
   */
  excludeExpiredRiskAnalysis?: boolean
  /** show purpose templates that handle personal data */
  handlesPersonalData?: boolean
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface AddRiskAnalysisTemplateAnswerAnnotationDocumentPayload {
  prettyName: string
  /** @format binary */
  doc: File
}

export interface RevokeVerifiedAttributePayload {
  /** @format uuid */
  agreementId: string
}

export interface GetAttributesParams {
  /** Query to filter Attributes by name */
  q?: string
  /** Query to filter Attributes by origin */
  origin?: string
  /** @format int32 */
  limit: number
  /** @format int32 */
  offset: number
  /** Array of kinds */
  kinds: AttributeKind[]
}

export interface GetTenantsParams {
  name?: string
  /**
   * comma separated feature types to filter the teanants with
   * @default []
   */
  features?: TenantFeatureType[]
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetClientsParams {
  /** Query to filter Clients by name */
  q?: string
  /**
   * comma separated sequence of user IDs
   * @default []
   */
  userIds?: string[]
  /** type of Client to be retrieved */
  kind?: ClientKind
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface SetAdminToClientPayload {
  /**
   * UserId to be added as admin
   * @format uuid
   */
  adminId: string
}

export interface AddUsersToClientPayload {
  /** @minItems 1 */
  userIds: string[]
}

export interface GetClientKeysParams {
  /**
   * comma separated sequence of user IDs
   * @default []
   */
  userIds?: string[]
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
  /**
   * ID of Client
   * @format uuid
   */
  clientId: string
}

export interface RetrieveLatestRiskAnalysisConfigurationParams {
  tenantKind?: TenantKind
}

export interface RetrieveRiskAnalysisConfigurationByVersionParams {
  /** @format uuid */
  eserviceId: string
  riskAnalysisVersion: string
}

export interface GetProducerKeychainsParams {
  /** Filter for the producer keychain name */
  q?: string
  /**
   * comma separated sequence of user IDs
   * @default []
   */
  userIds?: string[]
  /**
   * ID of e-service that MUST be related to the Producer Keychain
   * @format uuid
   */
  eserviceId?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface AddProducerKeychainUsersPayload {
  /** @minItems 1 */
  userIds: string[]
}

export interface GetProducerKeysParams {
  /**
   * comma separated sequence of user IDs
   * @default []
   */
  userIds?: string[]
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
  /**
   * ID of the producer keychain to look up
   * @format uuid
   */
  producerKeychainId: string
}

export interface GetDelegationsParams {
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
  /**
   * comma separated sequence of delegation states to filter the results with
   * @default []
   */
  states?: DelegationState[]
  /**
   * The delegator ids to filter by
   * @default []
   */
  delegatorIds?: string[]
  /**
   * The delegated ids to filter by
   * @default []
   */
  delegateIds?: string[]
  /** The delegation kind to filter by */
  kind?: DelegationKind
  /** @default [] */
  eserviceIds?: string[]
}

export interface GetConsumerDelegatedEservicesParams {
  /** @format uuid */
  delegatorId: string
  q?: string
  /** @format int32 */
  offset: number
  /** @format int32 */
  limit: number
}

export interface GetEServiceTemplatesCatalogParams {
  /** if true only e-service templates that handle personal data will be returned, if false only non-personal data e-service templates will be returned, if not present all e-service templates will be returned, if "defined" all e-service templates with a defined personal data flag will be returned */
  personalData?: PersonalDataFilter
  /** Query to filter EService template by name */
  q?: string
  /**
   * comma separated sequence of creators IDs
   * @default []
   */
  creatorsIds?: string[]
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetCreatorEServiceTemplatesParams {
  /** Query to filter EServices templates by name */
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface GetEServiceTemplateCreatorsParams {
  /** Query to filter creators by name */
  q?: string
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface CreateEServiceTemplateDocumentPayload {
  /** Document Type */
  kind: 'INTERFACE' | 'DOCUMENT'
  prettyName: string
  /** @format binary */
  doc: File
}

export interface IsEServiceNameAvailableParams {
  /** the e-service name to check for */
  name: string
}

export interface GetNotificationsParams {
  /** Query to filter notifications */
  q?: string
  /** Category to filter notifications */
  category?: 'Subscribers' | 'Providers' | 'Delegations' | 'AttributesAndKeys'
  /**
   * @format int32
   * @min 0
   */
  offset: number
  /**
   * @format int32
   * @min 1
   * @max 50
   */
  limit: number
}

export interface DeleteNotificationsPayload {
  ids: string[]
}

export interface MarkNotificationsAsReadPayload {
  ids: string[]
}

export interface MarkNotificationsAsUnreadPayload {
  ids: string[]
}

export namespace Consumers {
  /**
   * @description retrieves a list of consumer agreements
   * @tags agreements
   * @name GetConsumerAgreements
   * @summary retrieves a list of consumer agreements
   * @request GET:/consumers/agreements
   * @secure
   */
  export namespace GetConsumerAgreements {
    export type RequestParams = {}
    export type RequestQuery = {
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
      /**
       * comma separated sequence of eservices IDs
       * @default []
       */
      eservicesIds?: string[]
      /**
       * comma separated sequence of producers IDs
       * @default []
       */
      producersIds?: string[]
      /**
       * comma separated sequence of agreement states to filter the response with
       * @default []
       */
      states?: AgreementState[]
      /** @default false */
      showOnlyUpgradeable?: boolean
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Agreements
  }
  /**
   * @description Retrieve requester's delegators
   * @tags consumerDelegations
   * @name GetConsumerDelegators
   * @request GET:/consumers/delegations/delegators
   * @secure
   */
  export namespace GetConsumerDelegators {
    export type RequestParams = {}
    export type RequestQuery = {
      q?: string
      /**
       * comma separated sequence of EService IDs
       * @default []
       */
      eserviceIds?: string[]
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = DelegationTenants
  }
  /**
   * @description Retrieve requester's delegators with active agreements
   * @tags consumerDelegations
   * @name GetConsumerDelegatorsWithAgreements
   * @request GET:/consumers/delegations/delegatorsWithAgreements
   * @secure
   */
  export namespace GetConsumerDelegatorsWithAgreements {
    export type RequestParams = {}
    export type RequestQuery = {
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = DelegationTenants
  }
  /**
   * @description Retrieve Tenants that are subscribed to at least one EService
   * @tags tenants
   * @name GetConsumers
   * @request GET:/consumers
   * @secure
   */
  export namespace GetConsumers {
    export type RequestParams = {}
    export type RequestQuery = {
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactOrganizations
  }
  /**
   * @description Retrieves eservices for consumers in agreements
   * @tags agreements
   * @name GetAgreementsConsumerEServices
   * @summary Retrieves eservices for consumers in agreements
   * @request GET:/consumers/agreements/eservices
   * @secure
   */
  export namespace GetAgreementsConsumerEServices {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter EServices by name */
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactEServicesLight
  }
  /**
   * @description Retrieve Purposes from the consumer perspective
   * @tags purposes
   * @name GetConsumerPurposes
   * @request GET:/consumers/purposes
   * @secure
   */
  export namespace GetConsumerPurposes {
    export type RequestParams = {}
    export type RequestQuery = {
      q?: string
      /**
       * comma separated sequence of EService IDs
       * @default []
       */
      eservicesIds?: string[]
      /**
       * comma separated sequence of producers IDs
       * @default []
       */
      producersIds?: string[]
      /**
       * comma separated sequence of states
       * @default []
       */
      states?: PurposeVersionState[]
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Purposes
  }
  /**
   * @description Retrieve requester's delegated eservices
   * @tags consumerDelegations
   * @name GetConsumerDelegatedEservices
   * @request GET:/consumers/delegations/eservices
   * @secure
   */
  export namespace GetConsumerDelegatedEservices {
    export type RequestParams = {}
    export type RequestQuery = {
      /** @format uuid */
      delegatorId: string
      q?: string
      /** @format int32 */
      offset: number
      /** @format int32 */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactEServices
  }
  /**
   * @description creates a consumer delegation
   * @tags consumerDelegations
   * @name CreateConsumerDelegation
   * @summary Consumer delegation creation
   * @request POST:/consumers/delegations
   * @secure
   */
  export namespace CreateConsumerDelegation {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = DelegationSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Approves a consumer delegation
   * @tags consumerDelegations
   * @name ApproveConsumerDelegation
   * @summary Approves a consumer delegation
   * @request POST:/consumers/delegations/{delegationId}/approve
   * @secure
   */
  export namespace ApproveConsumerDelegation {
    export type RequestParams = {
      /**
       * The identifier of the delegation
       * @format uuid
       */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Rejects a consumer delegation
   * @tags consumerDelegations
   * @name RejectConsumerDelegation
   * @summary Rejects a consumer delegation
   * @request POST:/consumers/delegations/{delegationId}/reject
   * @secure
   */
  export namespace RejectConsumerDelegation {
    export type RequestParams = {
      /**
       * The identifier of the delegation
       * @format uuid
       */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = RejectDelegationPayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Revokes a consumer delegation
   * @tags consumerDelegations
   * @name RevokeConsumerDelegation
   * @summary Revokes a consumer delegation
   * @request DELETE:/consumers/delegations/{delegationId}
   * @secure
   */
  export namespace RevokeConsumerDelegation {
    export type RequestParams = {
      /**
       * The delegation id
       * @format uuid
       */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
}

export namespace Producers {
  /**
   * @description retrieves a list of producers agreements
   * @tags agreements
   * @name GetProducerAgreements
   * @summary retrieves a list of producers agreements
   * @request GET:/producers/agreements
   * @secure
   */
  export namespace GetProducerAgreements {
    export type RequestParams = {}
    export type RequestQuery = {
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
      /**
       * comma separated sequence of eservices IDs
       * @default []
       */
      eservicesIds?: string[]
      /**
       * comma separated sequence of consumers IDs
       * @default []
       */
      consumersIds?: string[]
      /**
       * comma separated sequence of agreement states to filter the response with
       * @default []
       */
      states?: AgreementState[]
      /** @default false */
      showOnlyUpgradeable?: boolean
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Agreements
  }
  /**
   * @description Retrieve Tenants that have published an EService
   * @tags tenants
   * @name GetProducers
   * @request GET:/producers
   * @secure
   */
  export namespace GetProducers {
    export type RequestParams = {}
    export type RequestQuery = {
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactOrganizations
  }
  /**
   * @description Retrieves Producer EServices
   * @tags eservices
   * @name GetProducerEServices
   * @summary Retrieves Producer EServices
   * @request GET:/producers/eservices
   * @secure
   */
  export namespace GetProducerEServices {
    export type RequestParams = {}
    export type RequestQuery = {
      /** if "TRUE" only e-services that handle personal data will be returned, if "FALSE" only non-personal data e-services will be returned, if not present all e-services will be returned, if "DEFINED" all e-services with a defined personal data flag will be returned */
      personalData?: PersonalDataFilter
      /** Query to filter EServices by name */
      q?: string
      /**
       * comma separated sequence of consumers IDs
       * @default []
       */
      consumersIds?: string[]
      /** if true only delegated e-services will be returned, if false only non-delegated e-services will be returned, if not present all e-services will be returned */
      delegated?: boolean
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = ProducerEServices
  }
  /**
   * @description Retrieves eservices for producers in agreements
   * @tags agreements
   * @name GetAgreementsProducerEServices
   * @summary Retrieves eservices for producers in agreements
   * @request GET:/producers/agreements/eservices
   * @secure
   */
  export namespace GetAgreementsProducerEServices {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter EServices by name */
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactEServicesLight
  }
  /**
   * @description Retrieves a producer eservice corresponding to the id
   * @tags eservices
   * @name GetProducerEServiceDetails
   * @summary Retrieves a producer eservice corresponding to the id
   * @request GET:/producers/eservices/{eserviceId}
   * @secure
   */
  export namespace GetProducerEServiceDetails {
    export type RequestParams = {
      /**
       * The internal identifier of the eservice
       * @format uuid
       */
      eserviceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = ProducerEServiceDetails
  }
  /**
   * @description Retrieves a producer eservice descriptor corresponding to the id
   * @tags eservices
   * @name GetProducerEServiceDescriptor
   * @summary Retrieves a producer eservice descriptor corresponding to the id
   * @request GET:/producers/eservices/{eserviceId}/descriptors/{descriptorId}
   * @secure
   */
  export namespace GetProducerEServiceDescriptor {
    export type RequestParams = {
      /**
       * The internal identifier of the eservice
       * @format uuid
       */
      eserviceId: string
      /**
       * the descriptor id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = ProducerEServiceDescriptor
  }
  /**
   * @description Retrieve Purposes from the producer perspective
   * @tags purposes
   * @name GetProducerPurposes
   * @request GET:/producers/purposes
   * @secure
   */
  export namespace GetProducerPurposes {
    export type RequestParams = {}
    export type RequestQuery = {
      q?: string
      /**
       * comma separated sequence of EService IDs
       * @default []
       */
      eservicesIds?: string[]
      /**
       * comma separated sequence of consumers IDs
       * @default []
       */
      consumersIds?: string[]
      /**
       * comma separated sequence of states
       * @default []
       */
      states?: PurposeVersionState[]
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Purposes
  }
  /**
   * @description creates a producer delegation
   * @tags producerDelegations
   * @name CreateProducerDelegation
   * @summary Producer delegation creation
   * @request POST:/producers/delegations
   * @secure
   */
  export namespace CreateProducerDelegation {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = DelegationSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Approves a producer delegation
   * @tags producerDelegations
   * @name ApproveProducerDelegation
   * @summary Approves a producer delegation
   * @request POST:/producers/delegations/{delegationId}/approve
   * @secure
   */
  export namespace ApproveProducerDelegation {
    export type RequestParams = {
      /**
       * The identifier of the delegation
       * @format uuid
       */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Rejects a producer delegation
   * @tags producerDelegations
   * @name RejectProducerDelegation
   * @summary Rejects a producer delegation
   * @request POST:/producers/delegations/{delegationId}/reject
   * @secure
   */
  export namespace RejectProducerDelegation {
    export type RequestParams = {
      /**
       * The identifier of the delegation
       * @format uuid
       */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = RejectDelegationPayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Revokes a producer delegation
   * @tags producerDelegations
   * @name RevokeProducerDelegation
   * @summary Revokes a producer delegation
   * @request DELETE:/producers/delegations/{delegationId}
   * @secure
   */
  export namespace RevokeProducerDelegation {
    export type RequestParams = {
      /**
       * The delegation id
       * @format uuid
       */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
}

export namespace Agreements {
  /**
   * @description creates the agreement between the involved parties.
   * @tags agreements
   * @name CreateAgreement
   * @summary Agreement Creation
   * @request POST:/agreements
   * @secure
   */
  export namespace CreateAgreement {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = AgreementPayload
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Retrieves Tenants that are producers with existing Agreements
   * @tags agreements
   * @name GetAgreementsProducers
   * @summary Retrieves Tenants that are producers with existing Agreements
   * @request GET:/agreements/filter/producers
   * @secure
   */
  export namespace GetAgreementsProducers {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter Producers by name */
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactOrganizations
  }
  /**
   * @description Retrieves Tenants that are consumers with existing Agreements
   * @tags agreements
   * @name GetAgreementsConsumers
   * @summary Retrieves Tenants that are consumers with existing Agreements
   * @request GET:/agreements/filter/consumers
   * @secure
   */
  export namespace GetAgreementsConsumers {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter Consumers by name */
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactOrganizations
  }
  /**
   * @description returns an agreement for a given agreementId
   * @tags agreements
   * @name GetAgreementById
   * @summary retrieves an agreement
   * @request GET:/agreements/{agreementId}
   * @secure
   */
  export namespace GetAgreementById {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Agreement
  }
  /**
   * No description
   * @tags agreements
   * @name DeleteAgreement
   * @summary Delete an agreement
   * @request DELETE:/agreements/{agreementId}
   * @secure
   */
  export namespace DeleteAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description returns the updated agreement
   * @tags agreements
   * @name ActivateAgreement
   * @summary Activate an agreement
   * @request POST:/agreements/{agreementId}/activate
   * @secure
   */
  export namespace ActivateAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = DelegationRef
    export type RequestHeaders = {}
    export type ResponseBody = Agreement
  }
  /**
   * @description returns the created agreement
   * @tags agreements
   * @name CloneAgreement
   * @summary Clone a rejected agreement
   * @request POST:/agreements/{agreementId}/clone
   * @secure
   */
  export namespace CloneAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Add a consumer Document to an Agreement
   * @tags agreements
   * @name AddAgreementConsumerDocument
   * @summary Add a consumer Document to an Agreement
   * @request POST:/agreements/{agreementId}/consumer-documents
   * @secure
   */
  export namespace AddAgreementConsumerDocument {
    export type RequestParams = {
      /** @format uuid */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = AddAgreementConsumerDocumentPayload
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * @description Retrieve a consumer Document of an Agreement
   * @tags agreements
   * @name GetAgreementConsumerDocument
   * @summary Retrieve a consumer Document of an Agreement
   * @request GET:/agreements/{agreementId}/consumer-documents/{documentId}
   * @secure
   */
  export namespace GetAgreementConsumerDocument {
    export type RequestParams = {
      /** @format uuid */
      agreementId: string
      /** @format uuid */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * @description Remove a consumer Document from an Agreement
   * @tags agreements
   * @name RemoveAgreementConsumerDocument
   * @summary Remove a consumer Document from an Agreement
   * @request DELETE:/agreements/{agreementId}/consumer-documents/{documentId}
   * @secure
   */
  export namespace RemoveAgreementConsumerDocument {
    export type RequestParams = {
      /** @format uuid */
      agreementId: string
      /** @format uuid */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description returns the agreement contract for a given agreementId
   * @tags agreements
   * @name GetAgreementContract
   * @summary retrieves the agreement contract
   * @request GET:/agreements/{agreementId}/contract
   * @secure
   */
  export namespace GetAgreementContract {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * @description returns the updated agreement
   * @tags agreements
   * @name SubmitAgreement
   * @summary Submit an agreement
   * @request POST:/agreements/{agreementId}/submit
   * @secure
   */
  export namespace SubmitAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = AgreementSubmissionPayload
    export type RequestHeaders = {}
    export type ResponseBody = Agreement
  }
  /**
   * @description returns the updated agreement
   * @tags agreements
   * @name SuspendAgreement
   * @summary Suspend an agreement
   * @request POST:/agreements/{agreementId}/suspend
   * @secure
   */
  export namespace SuspendAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = DelegationRef
    export type RequestHeaders = {}
    export type ResponseBody = Agreement
  }
  /**
   * @description returns the updated agreement
   * @tags agreements
   * @name RejectAgreement
   * @summary Reject an agreement
   * @request POST:/agreements/{agreementId}/reject
   * @secure
   */
  export namespace RejectAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = AgreementRejectionPayload
    export type RequestHeaders = {}
    export type ResponseBody = Agreement
  }
  /**
   * @description returns the updated agreement
   * @tags agreements
   * @name ArchiveAgreement
   * @summary Archive an agreement
   * @request POST:/agreements/{agreementId}/archive
   * @secure
   */
  export namespace ArchiveAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description update agreement fields.
   * @tags agreements
   * @name UpdateAgreement
   * @summary update an agreement in draft state.
   * @request POST:/agreements/{agreementId}/update
   * @secure
   */
  export namespace UpdateAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement to update
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = AgreementUpdatePayload
    export type RequestHeaders = {}
    export type ResponseBody = Agreement
  }
  /**
   * @description returns the updated agreement
   * @tags agreements
   * @name UpgradeAgreement
   * @summary Upgrade an agreement
   * @request POST:/agreements/{agreementId}/upgrade
   * @secure
   */
  export namespace UpgradeAgreement {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Agreement
  }
  /**
   * @description Returns the signed agreement contract file for a given agreementId
   * @tags agreements
   * @name GetSignedAgreementContract
   * @summary Downloads the signed agreement contract
   * @request GET:/agreements/{agreementId}/signedContract
   * @secure
   */
  export namespace GetSignedAgreementContract {
    export type RequestParams = {
      /**
       * The identifier of the agreement
       * @format uuid
       */
      agreementId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
}

export namespace Tenants {
  /**
   * @description Verify a Tenant has required certified attributes
   * @tags agreements
   * @name VerifyTenantCertifiedAttributes
   * @summary Verify a Tenant has required certified attributes
   * @request GET:/tenants/{tenantId}/eservices/{eserviceId}/descriptors/{descriptorId}/certifiedAttributes/validate
   * @secure
   */
  export namespace VerifyTenantCertifiedAttributes {
    export type RequestParams = {
      /**
       * The identifier of the tenant
       * @format uuid
       */
      tenantId: string
      /**
       * The identifier of the e-service
       * @format uuid
       */
      eserviceId: string
      /**
       * The identifier of the e-service descriptor
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = HasCertifiedAttributes
  }
  /**
   * @description Return ok
   * @tags selfcare
   * @name GetInstitutionUsers
   * @summary returns the users related to the institution
   * @request GET:/tenants/{tenantId}/users
   * @secure
   */
  export namespace GetInstitutionUsers {
    export type RequestParams = {
      /**
       * The internal identifier of the tenant
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {
      /**
       * the person identifier
       * @format uuid
       */
      personId?: string
      /**
       * comma separated sequence of role to filter the response with
       * @default []
       */
      roles?: string[]
      /** filter applied to name/surname */
      query?: string
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Users
  }
  /**
   * @description Retrieve the certified attributes
   * @tags tenants
   * @name GetRequesterCertifiedAttributes
   * @summary Gets the certified attributes of the requester
   * @request GET:/tenants/attributes/certified
   * @secure
   */
  export namespace GetRequesterCertifiedAttributes {
    export type RequestParams = {}
    export type RequestQuery = {
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = RequesterCertifiedAttributes
  }
  /**
   * @description Gets certified attributes for institution using internal institution id
   * @tags tenants
   * @name GetCertifiedAttributes
   * @summary Gets the certified attributes of an institution using internal institution id
   * @request GET:/tenants/{tenantId}/attributes/certified
   * @secure
   */
  export namespace GetCertifiedAttributes {
    export type RequestParams = {
      /**
       * The internal identifier of the tenant
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CertifiedAttributesResponse
  }
  /**
   * @description Add a certified attribute to a Tenant by the requester Tenant
   * @tags tenants
   * @name AddCertifiedAttribute
   * @request POST:/tenants/{tenantId}/attributes/certified
   * @secure
   */
  export namespace AddCertifiedAttribute {
    export type RequestParams = {
      /**
       * The internal identifier of the tenant
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {}
    export type RequestBody = CertifiedTenantAttributeSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Adds the declared attribute to the Institution
   * @tags tenants
   * @name AddDeclaredAttribute
   * @summary Adds the declared attribute to the Institution
   * @request POST:/tenants/attributes/declared
   * @secure
   */
  export namespace AddDeclaredAttribute {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = DeclaredTenantAttributeSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Revokes the declared attribute to the Institution
   * @tags tenants
   * @name RevokeDeclaredAttribute
   * @summary Revokes the declared attribute to the Institution
   * @request DELETE:/tenants/attributes/declared/{attributeId}
   * @secure
   */
  export namespace RevokeDeclaredAttribute {
    export type RequestParams = {
      /**
       * The internal identifier of the attribute
       * @format uuid
       */
      attributeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Gets declared attributes for institution using internal institution id
   * @tags tenants
   * @name GetDeclaredAttributes
   * @summary Gets the declared attributes of an institution using internal institution id
   * @request GET:/tenants/{tenantId}/attributes/declared
   * @secure
   */
  export namespace GetDeclaredAttributes {
    export type RequestParams = {
      /**
       * The internal identifier of the tenant
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = DeclaredAttributesResponse
  }
  /**
   * @description Gets verified attributes for institution using internal institution id
   * @tags tenants
   * @name GetVerifiedAttributes
   * @summary Gets the verified attributes of an institution using internal institution id
   * @request GET:/tenants/{tenantId}/attributes/verified
   * @secure
   */
  export namespace GetVerifiedAttributes {
    export type RequestParams = {
      /**
       * The internal identifier of the tenant
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = VerifiedAttributesResponse
  }
  /**
   * @description Adds the verified attribute to the Institution
   * @tags tenants
   * @name VerifyVerifiedAttribute
   * @summary Adds the verified attribute to the Institution
   * @request POST:/tenants/{tenantId}/attributes/verified
   * @secure
   */
  export namespace VerifyVerifiedAttribute {
    export type RequestParams = {
      /**
       * The internal identifier of the tenant
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {}
    export type RequestBody = VerifiedTenantAttributeSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Revoke a certified attribute to a Tenant by the requester Tenant
   * @tags tenants
   * @name RevokeCertifiedAttribute
   * @request DELETE:/tenants/{tenantId}/attributes/certified/{attributeId}
   * @secure
   */
  export namespace RevokeCertifiedAttribute {
    export type RequestParams = {
      /**
       * Tenant id which attribute needs to be verified
       * @format uuid
       */
      tenantId: string
      /**
       * Attribute id to be revoked
       * @format uuid
       */
      attributeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Update expirationDate for Verified Attribute of Tenant
   * @tags tenants
   * @name UpdateVerifiedAttribute
   * @summary Update expirationDate for Verified Attribute of Tenant
   * @request POST:/tenants/{tenantId}/attributes/verified/{attributeId}
   * @secure
   */
  export namespace UpdateVerifiedAttribute {
    export type RequestParams = {
      /**
       * Tenant id which attribute needs to be verified
       * @format uuid
       */
      tenantId: string
      /**
       * Attribute id to be revoked
       * @format uuid
       */
      attributeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateVerifiedTenantAttributeSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Revoke a Verified attribute to a Tenant by the requester Tenant
   * @tags tenants
   * @name RevokeVerifiedAttribute
   * @request DELETE:/tenants/{tenantId}/attributes/verified/{attributeId}
   * @secure
   */
  export namespace RevokeVerifiedAttribute {
    export type RequestParams = {
      /**
       * Tenant id which attribute needs to be verified
       * @format uuid
       */
      tenantId: string
      /**
       * Attribute id to be revoked
       * @format uuid
       */
      attributeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = RevokeVerifiedAttributePayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Gets institution using internal institution id
   * @tags tenants
   * @name GetTenant
   * @summary Gets the corresponding institution using internal institution id
   * @request GET:/tenants/{tenantId}
   * @secure
   */
  export namespace GetTenant {
    export type RequestParams = {
      /**
       * the tenant id
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Tenant
  }
  /**
   * No description
   * @tags tenants
   * @name AddTenantMail
   * @summary Add a tenant mail
   * @request POST:/tenants/{tenantId}/mails
   * @secure
   */
  export namespace AddTenantMail {
    export type RequestParams = {
      /**
       * the tenant id
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {}
    export type RequestBody = MailSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags tenants
   * @name DeleteTenantMail
   * @summary Delete a tenant mail
   * @request DELETE:/tenants/{tenantId}/mails/{mailId}
   * @secure
   */
  export namespace DeleteTenantMail {
    export type RequestParams = {
      /**
       * the tenant id
       * @format uuid
       */
      tenantId: string
      /** the mail id */
      mailId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Retrieve Tenants by name
   * @tags tenants
   * @name GetTenants
   * @request GET:/tenants
   * @secure
   */
  export namespace GetTenants {
    export type RequestParams = {}
    export type RequestQuery = {
      name?: string
      /**
       * comma separated feature types to filter the teanants with
       * @default []
       */
      features?: TenantFeatureType[]
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Tenants
  }
  /**
   * No description
   * @tags tenants
   * @name UpdateTenantDelegatedFeatures
   * @summary Update delegated producer and consumer feature to tenant caller
   * @request POST:/tenants/delegatedFeatures/update
   * @secure
   */
  export namespace UpdateTenantDelegatedFeatures {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = TenantDelegatedFeaturesFlagsUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
}

export namespace Catalog {
  /**
   * @description Retrieves EServices catalog
   * @tags eservices
   * @name GetEServicesCatalog
   * @summary Retrieves EServices catalog
   * @request GET:/catalog
   * @secure
   */
  export namespace GetEServicesCatalog {
    export type RequestParams = {}
    export type RequestQuery = {
      /** if "TRUE" only e-services that handle personal data will be returned, if "FALSE" only non-personal data e-services will be returned, if not present all e-services will be returned, if "DEFINED" all e-services with a defined personal data flag will be returned */
      personalData?: PersonalDataFilter
      /** Query to filter EServices by name */
      q?: string
      /**
       * comma separated sequence of producers IDs
       * @default []
       */
      producersIds?: string[]
      /**
       * comma separated sequence of attribute IDs
       * @default []
       */
      attributesIds?: string[]
      /**
       * comma separated sequence of states
       * @default []
       */
      states?: EServiceDescriptorState[]
      /**
       * comma separated sequence of agreement states to filter the response with
       * @default []
       */
      agreementStates?: AgreementState[]
      /** EService Mode filter */
      mode?: EServiceMode
      /** EService isConsumerDelegable filter */
      isConsumerDelegable?: boolean
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 200
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CatalogEServices
  }
  /**
   * @description Retrieves the catalog eservice descriptor corresponding to the id
   * @tags eservices
   * @name GetCatalogEServiceDescriptor
   * @summary Retrieves the catalog eservice descriptor corresponding to the id
   * @request GET:/catalog/eservices/{eserviceId}/descriptor/{descriptorId}
   * @secure
   */
  export namespace GetCatalogEServiceDescriptor {
    export type RequestParams = {
      /**
       * The internal identifier of the eservice
       * @format uuid
       */
      eserviceId: string
      /**
       * the descriptor id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CatalogEServiceDescriptor
  }
  /**
   * @description Retrieve Catalog Purpose Templates
   * @tags purposeTemplates
   * @name GetCatalogPurposeTemplates
   * @summary Retrieve Catalog Purpose Templates
   * @request GET:/catalog/purposeTemplates
   * @secure
   */
  export namespace GetCatalogPurposeTemplates {
    export type RequestParams = {}
    export type RequestQuery = {
      /** filter by purpose template title */
      q?: string
      /**
       * comma separated sequence of creators IDs
       * @default []
       */
      creatorIds?: string[]
      /**
       * comma separated sequence of e-service IDs
       * @default []
       */
      eserviceIds?: string[]
      /** filter by target tenant kind */
      targetTenantKind?: TenantKind
      /**
       * exclude purpose templates with expired risk analysis
       * @default true
       */
      excludeExpiredRiskAnalysis?: boolean
      /** show purpose templates that handle personal data */
      handlesPersonalData?: boolean
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CatalogPurposeTemplates
  }
  /**
   * @description Retrieves EService templates catalog
   * @tags eserviceTemplates
   * @name GetEServiceTemplatesCatalog
   * @summary Retrieves EService templates catalog
   * @request GET:/catalog/eservices/templates
   * @secure
   */
  export namespace GetEServiceTemplatesCatalog {
    export type RequestParams = {}
    export type RequestQuery = {
      /** if true only e-service templates that handle personal data will be returned, if false only non-personal data e-service templates will be returned, if not present all e-service templates will be returned, if "defined" all e-service templates with a defined personal data flag will be returned */
      personalData?: PersonalDataFilter
      /** Query to filter EService template by name */
      q?: string
      /**
       * comma separated sequence of creators IDs
       * @default []
       */
      creatorsIds?: string[]
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CatalogEServiceTemplates
  }
}

export namespace Eservices {
  /**
   * No description
   * @tags eservices
   * @name CreateEService
   * @summary Create a new EService
   * @request POST:/eservices
   * @secure
   */
  export namespace CreateEService {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = EServiceSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedEServiceDescriptor
  }
  /**
   * No description
   * @tags eservices
   * @name GetEServiceConsumers
   * @summary Retrieve Consumers for an EService
   * @request GET:/eservices/{eServiceId}/consumers
   * @secure
   */
  export namespace GetEServiceConsumers {
    export type RequestParams = {
      /**
       * The E-Service id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * No description
   * @tags eservices
   * @name DeleteDraft
   * @summary Deletes a draft descriptor or an eservice if empty
   * @request DELETE:/eservices/{eServiceId}/descriptors/{descriptorId}
   * @secure
   */
  export namespace DeleteDraft {
    export type RequestParams = {
      /**
       * The E-Service Id
       * @format uuid
       */
      eServiceId: string
      /**
       * The Descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateDraftDescriptor
   * @summary Updates a draft descriptor
   * @request PUT:/eservices/{eServiceId}/descriptors/{descriptorId}
   * @secure
   */
  export namespace UpdateDraftDescriptor {
    export type RequestParams = {
      /**
       * The E-Service id
       * @format uuid
       */
      eServiceId: string
      /**
       * The Descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceDescriptorSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name CreateDescriptor
   * @summary Adds a descriptor to the specified e-service
   * @request POST:/eservices/{eServiceId}/descriptors
   * @secure
   */
  export namespace CreateDescriptor {
    export type RequestParams = {
      /**
       * The E-Service id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name ActivateDescriptor
   * @summary Activate the selected descriptor.
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/activate
   * @secure
   */
  export namespace ActivateDescriptor {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateDescriptor
   * @summary Publish the selected descriptor.
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/update
   * @secure
   */
  export namespace UpdateDescriptor {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceDescriptorQuotas
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateAgreementApprovalPolicy
   * @summary Update agreement approval policy of published descriptor
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/agreementApprovalPolicy/update
   * @secure
   */
  export namespace UpdateAgreementApprovalPolicy {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceDescriptorAgreementApprovalPolicySeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name PublishDescriptor
   * @summary Publish the selected descriptor.
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/publish
   * @secure
   */
  export namespace PublishDescriptor {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name SuspendDescriptor
   * @summary Suspend the selected descriptor.
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/suspend
   * @secure
   */
  export namespace SuspendDescriptor {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name CreateEServiceDocument
   * @summary Add new e-service document
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/documents
   * @secure
   */
  export namespace CreateEServiceDocument {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = CreateEServiceDocumentPayload
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name DeleteEServiceDocumentById
   * @summary Deletes an e-service document
   * @request DELETE:/eservices/{eServiceId}/descriptors/{descriptorId}/documents/{documentId}
   * @secure
   */
  export namespace DeleteEServiceDocumentById {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
      /**
       * the document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name GetEServiceDocumentById
   * @summary Get an e-service document
   * @request GET:/eservices/{eServiceId}/descriptors/{descriptorId}/documents/{documentId}
   * @secure
   */
  export namespace GetEServiceDocumentById {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
      /**
       * the document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * No description
   * @tags eservices
   * @name CloneEServiceByDescriptor
   * @summary Clones the selected descriptor.
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/clone
   * @secure
   */
  export namespace CloneEServiceByDescriptor {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CreatedEServiceDescriptor
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateEServiceDocumentById
   * @summary Updates an e-service document
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/documents/{documentId}/update
   * @secure
   */
  export namespace UpdateEServiceDocumentById {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
      /**
       * the document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceDescriptorDocumentSeed
    export type RequestHeaders = {}
    export type ResponseBody = EServiceDoc
  }
  /**
   * No description
   * @tags eservices
   * @name DeleteEService
   * @summary Deletes an e-service
   * @request DELETE:/eservices/{eServiceId}
   * @secure
   */
  export namespace DeleteEService {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateEServiceById
   * @summary Updates EService general information
   * @request PUT:/eservices/{eServiceId}
   * @secure
   */
  export namespace UpdateEServiceById {
    export type RequestParams = {
      /**
       * The E-Service id to update
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name AddRiskAnalysisToEService
   * @summary add a risk analysis to an EService
   * @request POST:/eservices/{eServiceId}/riskAnalysis
   * @secure
   */
  export namespace AddRiskAnalysisToEService {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceRiskAnalysisSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name GetEServiceRiskAnalysis
   * @summary get EService risk analysis
   * @request GET:/eservices/{eServiceId}/riskAnalysis/{riskAnalysisId}
   * @secure
   */
  export namespace GetEServiceRiskAnalysis {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the risk analysis id
       * @format uuid
       */
      riskAnalysisId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = EServiceRiskAnalysis
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateEServiceRiskAnalysis
   * @summary update EService risk analysis
   * @request POST:/eservices/{eServiceId}/riskAnalysis/{riskAnalysisId}
   * @secure
   */
  export namespace UpdateEServiceRiskAnalysis {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the risk analysis id
       * @format uuid
       */
      riskAnalysisId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceRiskAnalysisSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name DeleteEServiceRiskAnalysis
   * @summary delete EService risk analysis
   * @request DELETE:/eservices/{eServiceId}/riskAnalysis/{riskAnalysisId}
   * @secure
   */
  export namespace DeleteEServiceRiskAnalysis {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the risk analysis id
       * @format uuid
       */
      riskAnalysisId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateEServiceDescription
   * @summary Update an e-service description
   * @request POST:/eservices/{eServiceId}/description/update
   * @secure
   */
  export namespace UpdateEServiceDescription {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceDescriptionUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateEServiceDelegationFlags
   * @summary Update an e-service delegation flags
   * @request POST:/eservices/{eServiceId}/delegationFlags/update
   * @secure
   */
  export namespace UpdateEServiceDelegationFlags {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceDelegationFlagsUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateEServiceName
   * @summary Update an e-service name
   * @request POST:/eservices/{eServiceId}/name/update
   * @secure
   */
  export namespace UpdateEServiceName {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceNameUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateEServiceSignalHubFlag
   * @summary Enable/disable SignalHub for an e-service
   * @request POST:/eservices/{eServiceId}/signalhub/update
   * @secure
   */
  export namespace UpdateEServiceSignalHubFlag {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceSignalHubUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Set personalData flag for an eservice after publication
   * @tags eservices
   * @name UpdateEServicePersonalDataFlagAfterPublication
   * @summary Set personalData flag for an eservice after publication
   * @request POST:/eservices/{eServiceId}/personalDataFlag
   * @secure
   */
  export namespace UpdateEServicePersonalDataFlagAfterPublication {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServicePersonalDataFlagUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateDescriptorAttributes
   * @summary Update e-service published descriptor attributes
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/attributes/update
   * @secure
   */
  export namespace UpdateDescriptorAttributes {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = DescriptorAttributesSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name ApproveDelegatedEServiceDescriptor
   * @summary approve a delegated new e-service version
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/approve
   * @secure
   */
  export namespace ApproveDelegatedEServiceDescriptor {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name RejectDelegatedEServiceDescriptor
   * @summary reject a delegated new e-service version
   * @request POST:/eservices/{eServiceId}/descriptors/{descriptorId}/reject
   * @secure
   */
  export namespace RejectDelegatedEServiceDescriptor {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = RejectDelegatedEServiceDescriptorSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name CreateEServiceTemplate
   * @summary Create a new e-service template
   * @request POST:/eservices/templates
   * @secure
   */
  export namespace CreateEServiceTemplate {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedEServiceTemplateVersion
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplate
   * @summary Updates a draft e-service template general information
   * @request POST:/eservices/templates/{eServiceTemplateId}
   * @secure
   */
  export namespace UpdateEServiceTemplate {
    export type RequestParams = {
      /**
       * The E-Service id to retrieve
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceTemplateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name GetEServiceTemplate
   * @summary Retrieve e-service template
   * @request GET:/eservices/templates/{eServiceTemplateId}
   * @secure
   */
  export namespace GetEServiceTemplate {
    export type RequestParams = {
      /**
       * The E-Service id to retrieve
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = EServiceTemplateDetails
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name SuspendEServiceTemplateVersion
   * @summary Suspend the selected eservice template version.
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/suspend
   * @secure
   */
  export namespace SuspendEServiceTemplateVersion {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template version id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name PublishEServiceTemplateVersion
   * @summary Publish the selected eservice template version.
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/publish
   * @secure
   */
  export namespace PublishEServiceTemplateVersion {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template version id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name ActivateEServiceTemplateVersion
   * @summary Activate the selected eservice template version.
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/activate
   * @secure
   */
  export namespace ActivateEServiceTemplateVersion {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template version id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplateName
   * @summary Update an e-service template name
   * @request POST:/eservices/templates/{eServiceTemplateId}/name/update
   * @secure
   */
  export namespace UpdateEServiceTemplateName {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateNameUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplateIntendedTarget
   * @summary Update an e-service template intended target description
   * @request POST:/eservices/templates/{eServiceTemplateId}/intendedTarget/update
   * @secure
   */
  export namespace UpdateEServiceTemplateIntendedTarget {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateIntendedTargetUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplateDescription
   * @summary Update an e-service template e-service description
   * @request POST:/eservices/templates/{eServiceTemplateId}/description/update
   * @secure
   */
  export namespace UpdateEServiceTemplateDescription {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateDescriptionUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Retrieves a eservice template version corresponding to the id
   * @tags eserviceTemplates
   * @name GetEServiceTemplateVersion
   * @summary Retrieves a eservice template version corresponding to the id
   * @request GET:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}
   * @secure
   */
  export namespace GetEServiceTemplateVersion {
    export type RequestParams = {
      /**
       * The internal identifier of the eservice template
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template version id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = EServiceTemplateVersionDetails
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateDraftTemplateVersion
   * @summary Updates a draft template version
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}
   * @secure
   */
  export namespace UpdateDraftTemplateVersion {
    export type RequestParams = {
      /**
       * The internal identifier of the eservice template
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template version id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceTemplateVersionSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name DeleteDraftTemplateVersion
   * @summary Delete a draft template version
   * @request DELETE:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}
   * @secure
   */
  export namespace DeleteDraftTemplateVersion {
    export type RequestParams = {
      /**
       * The internal identifier of the eservice template
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template version id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateTemplateVersionQuotas
   * @summary Update the quotas of the selecter template version
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/quotas/update
   * @secure
   */
  export namespace UpdateTemplateVersionQuotas {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the template version Id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateVersionQuotasUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name CreateEServiceTemplateRiskAnalysis
   * @summary Create an e-service template risk analysis
   * @request POST:/eservices/templates/{eServiceTemplateId}/riskAnalysis
   * @secure
   */
  export namespace CreateEServiceTemplateRiskAnalysis {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateRiskAnalysisSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplateRiskAnalysis
   * @summary Update an e-service template risk analysis
   * @request POST:/eservices/templates/{eServiceTemplateId}/riskAnalysis/{riskAnalysisId}
   * @secure
   */
  export namespace UpdateEServiceTemplateRiskAnalysis {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template id
       * @format uuid
       */
      riskAnalysisId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateRiskAnalysisSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name DeleteEServiceTemplateRiskAnalysis
   * @summary Delete an e-service template risk analysis
   * @request DELETE:/eservices/templates/{eServiceTemplateId}/riskAnalysis/{riskAnalysisId}
   * @secure
   */
  export namespace DeleteEServiceTemplateRiskAnalysis {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template id
       * @format uuid
       */
      riskAnalysisId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplateVersionAttributes
   * @summary Update e-service template published version attributes
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/attributes/update
   * @secure
   */
  export namespace UpdateEServiceTemplateVersionAttributes {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the eservice template version id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = DescriptorAttributesSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Retrieves Tenants that are producers of published e-service templates
   * @tags eserviceTemplates
   * @name GetEServiceTemplateCreators
   * @summary Retrieves Tenants that are creators of published e-service templates
   * @request GET:/eservices/templates/filter/creators
   * @secure
   */
  export namespace GetEServiceTemplateCreators {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter creators by name */
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactOrganizations
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name CreateEServiceTemplateVersion
   * @summary Adds a new version to the specified e-service template
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions
   * @secure
   */
  export namespace CreateEServiceTemplateVersion {
    export type RequestParams = {
      /**
       * The E-Service template id
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name CreateEServiceTemplateDocument
   * @summary Add new e-service template document
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/documents
   * @secure
   */
  export namespace CreateEServiceTemplateDocument {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the version Id
       * @format uuid
       */
      eServiceTemplateVersionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = CreateEServiceTemplateDocumentPayload
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name GetEServiceTemplateDocumentById
   * @summary Get an e-service template document
   * @request GET:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/documents/{documentId}
   * @secure
   */
  export namespace GetEServiceTemplateDocumentById {
    export type RequestParams = {
      /**
       * the eService template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the template version Id
       * @format uuid
       */
      eServiceTemplateVersionId: string
      /**
       * the document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name DeleteEServiceTemplateDocumentById
   * @summary Deletes an e-service template document
   * @request DELETE:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/documents/{documentId}
   * @secure
   */
  export namespace DeleteEServiceTemplateDocumentById {
    export type RequestParams = {
      /**
       * the eService template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the template version Id
       * @format uuid
       */
      eServiceTemplateVersionId: string
      /**
       * the document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplateDocumentById
   * @summary Updates an e-service template document
   * @request POST:/eservices/templates/{eServiceTemplateId}/versions/{eServiceTemplateVersionId}/documents/{documentId}/update
   * @secure
   */
  export namespace UpdateEServiceTemplateDocumentById {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
      /**
       * the version Id
       * @format uuid
       */
      eServiceTemplateVersionId: string
      /**
       * the document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceTemplateVersionDocumentSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplatePersonalDataFlagAfterPublication
   * @summary Set personalData flag for published EService templates
   * @request POST:/eservices/templates/{eServiceTemplateId}/personalDataFlag
   * @secure
   */
  export namespace UpdateEServiceTemplatePersonalDataFlagAfterPublication {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplatePersonalDataFlagUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eservices
   * @name IsEServiceNameAvailable
   * @summary Check if the e-service name is available
   * @request GET:/eservices/names/availability
   * @secure
   */
  export namespace IsEServiceNameAvailable {
    export type RequestParams = {}
    export type RequestQuery = {
      /** the e-service name to check for */
      name: string
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = boolean
  }
}

export namespace Templates {
  /**
   * No description
   * @tags eservices
   * @name UpdateDraftDescriptorTemplateInstance
   * @summary Updates an eservice template instance draft descriptor
   * @request POST:/templates/eservices/{eServiceId}/descriptors/{descriptorId}
   * @secure
   */
  export namespace UpdateDraftDescriptorTemplateInstance {
    export type RequestParams = {
      /**
       * The E-Service id
       * @format uuid
       */
      eServiceId: string
      /**
       * The Descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceDescriptorTemplateInstanceSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateTemplateInstanceDescriptor
   * @summary Update the selected template instance descriptor.
   * @request POST:/templates/eservices/{eServiceId}/descriptors/{descriptorId}/update
   * @secure
   */
  export namespace UpdateTemplateInstanceDescriptor {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the descriptor Id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceTemplateInstanceDescriptorQuotas
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name AddEServiceTemplateInstanceInterfaceRest
   * @summary Add EService template instance interface for REST protocol
   * @request POST:/templates/eservices/{eServiceId}/descriptors/{descriptorId}/interface/rest
   * @secure
   */
  export namespace AddEServiceTemplateInstanceInterfaceRest {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the eservice descriptor id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = TemplateInstanceInterfaceRESTSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name AddEServiceTemplateInstanceInterfaceSoap
   * @summary Add EService template instance interface for SOAP protocol
   * @request POST:/templates/eservices/{eServiceId}/descriptors/{descriptorId}/interface/soap
   * @secure
   */
  export namespace AddEServiceTemplateInstanceInterfaceSoap {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
      /**
       * the eservice descriptor id
       * @format uuid
       */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = TemplateInstanceInterfaceSOAPSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name UpdateEServiceTemplateInstanceById
   * @summary Updates EService template instance general information
   * @request POST:/templates/eservices/{eServiceId}
   * @secure
   */
  export namespace UpdateEServiceTemplateInstanceById {
    export type RequestParams = {
      /**
       * The E-Service id to update
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateEServiceTemplateInstanceSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eservices
   * @name UpgradeEServiceInstance
   * @summary Upgrade an instance of a template
   * @request POST:/templates/eservices/{eServiceId}/upgrade
   * @secure
   */
  export namespace UpgradeEServiceInstance {
    export type RequestParams = {
      /**
       * the eservice id
       * @format uuid
       */
      eServiceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Retrieves EService template instances
   * @tags eservices
   * @name GetEServiceTemplateInstances
   * @summary Retrieves EService template instances
   * @request GET:/templates/{templateId}/eservices
   * @secure
   */
  export namespace GetEServiceTemplateInstances {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      templateId: string
    }
    export type RequestQuery = {
      /** Query to filter by producer name */
      producerName?: string
      /**
       * comma separated sequence of instance states
       * @default []
       */
      states?: EServiceDescriptorState[]
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = EServiceTemplateInstances
  }
  /**
   * No description
   * @tags eservices
   * @name CreateEServiceInstanceFromTemplate
   * @summary Create a new e-service instance from a template
   * @request POST:/templates/{templateId}/eservices
   * @secure
   */
  export namespace CreateEServiceInstanceFromTemplate {
    export type RequestParams = {
      /**
       * The template id to create the e-service from
       * @format uuid
       */
      templateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = InstanceEServiceSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
}

export namespace Export {
  /**
   * No description
   * @tags eservices
   * @name ExportEServiceDescriptor
   * @summary Export EService descriptor
   * @request GET:/export/eservices/{eserviceId}/descriptors/{descriptorId}
   * @secure
   */
  export namespace ExportEServiceDescriptor {
    export type RequestParams = {
      /** @format uuid */
      eserviceId: string
      /** @format uuid */
      descriptorId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = FileResource
  }
}

export namespace Import {
  /**
   * No description
   * @tags eservices
   * @name GetImportEservicePresignedUrl
   * @summary Get presigned URL
   * @request GET:/import/eservices/presignedUrl
   * @secure
   */
  export namespace GetImportEservicePresignedUrl {
    export type RequestParams = {}
    export type RequestQuery = {
      fileName: string
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = PresignedUrl
  }
  /**
   * No description
   * @tags eservices
   * @name ImportEService
   * @summary Import EService
   * @request POST:/import/eservices
   * @secure
   */
  export namespace ImportEService {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = FileResource
    export type RequestHeaders = {}
    export type ResponseBody = CreatedEServiceDescriptor
  }
}

export namespace Reverse {
  /**
   * @description create a purposes with an EService risk analysis
   * @tags purposes
   * @name CreatePurposeForReceiveEservice
   * @summary create a purposes with an EService risk analysis
   * @request POST:/reverse/purposes
   * @secure
   */
  export namespace CreatePurposeForReceiveEservice {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = PurposeEServiceSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Updates a reverse Purpose
   * @tags purposes
   * @name UpdateReversePurpose
   * @request POST:/reverse/purposes/{purposeId}
   * @secure
   */
  export namespace UpdateReversePurpose {
    export type RequestParams = {
      /**
       * the purpose id
       * @format uuid
       */
      purposeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = ReversePurposeUpdateContent
    export type RequestHeaders = {}
    export type ResponseBody = PurposeVersionResource
  }
}

export namespace Session {
  /**
   * @description Retrieve a session token
   * @tags authorization
   * @name GetSessionToken
   * @request POST:/session/tokens
   * @secure
   */
  export namespace GetSessionToken {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = IdentityToken
    export type RequestHeaders = {}
    export type ResponseBody = SessionToken
  }
  /**
   * @description Returns the generated token
   * @tags support
   * @name GetSaml2Token
   * @summary Returns the generated token
   * @request POST:/session/saml2/tokens
   * @secure
   */
  export namespace GetSaml2Token {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = SAMLTokenRequest
    export type RequestHeaders = {}
    export type ResponseBody = SessionToken
  }
}

export namespace Tools {
  /**
   * @description Provides additional details about token generation request failure
   * @tags tools
   * @name ValidateTokenGeneration
   * @summary Validate token generation request
   * @request POST:/tools/validateTokenGeneration
   * @secure
   */
  export namespace ValidateTokenGeneration {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = AccessTokenRequest
    export type RequestHeaders = {}
    export type ResponseBody = TokenGenerationValidationResult
  }
}

export namespace Users {
  /**
   * @description Gets user
   * @tags selfcare
   * @name GetUser
   * @summary Gets the corresponding user
   * @request GET:/users/{userId}
   * @secure
   */
  export namespace GetUser {
    export type RequestParams = {
      /**
       * The identifier of the user
       * @format uuid
       */
      userId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = User
  }
}

export namespace Purposes {
  /**
   * @description Creates the Purpose
   * @tags purposes
   * @name CreatePurpose
   * @request POST:/purposes
   * @secure
   */
  export namespace CreatePurpose {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = PurposeSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description clone purpose
   * @tags purposes
   * @name ClonePurpose
   * @summary Clone Purpose
   * @request POST:/purposes/{purposeId}/clone
   * @secure
   */
  export namespace ClonePurpose {
    export type RequestParams = {
      /** @format uuid */
      purposeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = PurposeCloneSeed
    export type RequestHeaders = {}
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * @description Creates a draft Purpose Version
   * @tags purposes
   * @name CreatePurposeVersion
   * @request POST:/purposes/{purposeId}/versions
   * @secure
   */
  export namespace CreatePurposeVersion {
    export type RequestParams = {
      /**
       * the purpose id
       * @format uuid
       */
      purposeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = PurposeVersionSeed
    export type RequestHeaders = {}
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * No description
   * @tags purposes
   * @name GetRiskAnalysisDocument
   * @summary Get an Risk Analysis document
   * @request GET:/purposes/{purposeId}/versions/{versionId}/documents/{documentId}
   * @secure
   */
  export namespace GetRiskAnalysisDocument {
    export type RequestParams = {
      /**
       * the purpose id
       * @format uuid
       */
      purposeId: string
      /**
       * the version Id
       * @format uuid
       */
      versionId: string
      /**
       * the document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * No description
   * @tags purposes
   * @name GetSignedDocument
   * @summary Get a signed document
   * @request GET:/purposes/{purposeId}/versions/{versionId}/signedDocuments/{documentId}
   * @secure
   */
  export namespace GetSignedDocument {
    export type RequestParams = {
      /**
       * the purpose id
       * @format uuid
       */
      purposeId: string
      /**
       * the version Id
       * @format uuid
       */
      versionId: string
      /**
       * the document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * @description reject the purpose version by id
   * @tags purposes
   * @name RejectPurposeVersion
   * @summary Reject Purpose Version
   * @request POST:/purposes/{purposeId}/versions/{versionId}/reject
   * @secure
   */
  export namespace RejectPurposeVersion {
    export type RequestParams = {
      /** @format uuid */
      purposeId: string
      /** @format uuid */
      versionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = RejectPurposeVersionPayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description archives the purpose version by id
   * @tags purposes
   * @name ArchivePurposeVersion
   * @summary Archive Purpose Version
   * @request POST:/purposes/{purposeId}/versions/{versionId}/archive
   * @secure
   */
  export namespace ArchivePurposeVersion {
    export type RequestParams = {
      /** @format uuid */
      purposeId: string
      /** @format uuid */
      versionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * @description suspends the purpose version by id
   * @tags purposes
   * @name SuspendPurposeVersion
   * @summary Suspend Purpose Version
   * @request POST:/purposes/{purposeId}/versions/{versionId}/suspend
   * @secure
   */
  export namespace SuspendPurposeVersion {
    export type RequestParams = {
      /** @format uuid */
      purposeId: string
      /** @format uuid */
      versionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = DelegationRef
    export type RequestHeaders = {}
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * @description activates the purpose version by id
   * @tags purposes
   * @name ActivatePurposeVersion
   * @summary Activate Purpose Version
   * @request POST:/purposes/{purposeId}/versions/{versionId}/activate
   * @secure
   */
  export namespace ActivatePurposeVersion {
    export type RequestParams = {
      /** @format uuid */
      purposeId: string
      /** @format uuid */
      versionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = DelegationRef
    export type RequestHeaders = {}
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * @description Retrieve the Purpose
   * @tags purposes
   * @name GetPurpose
   * @request GET:/purposes/{purposeId}
   * @secure
   */
  export namespace GetPurpose {
    export type RequestParams = {
      /**
       * the purpose id
       * @format uuid
       */
      purposeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Purpose
  }
  /**
   * @description Deletes a specific purpose if there are no version and just a draft version or a waiting for approval version
   * @tags purposes
   * @name DeletePurpose
   * @request DELETE:/purposes/{purposeId}
   * @secure
   */
  export namespace DeletePurpose {
    export type RequestParams = {
      /**
       * the purpose id
       * @format uuid
       */
      purposeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Updates a Purpose if not yet activated
   * @tags purposes
   * @name UpdatePurpose
   * @request POST:/purposes/{purposeId}
   * @secure
   */
  export namespace UpdatePurpose {
    export type RequestParams = {
      /**
       * the purpose id
       * @format uuid
       */
      purposeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = PurposeUpdateContent
    export type RequestHeaders = {}
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * @description deletes the purpose version by id
   * @tags purposes
   * @name DeletePurposeVersion
   * @summary Delete a Purpose Version
   * @request DELETE:/purposes/{purposeId}/versions/{versionId}
   * @secure
   */
  export namespace DeletePurposeVersion {
    export type RequestParams = {
      /** @format uuid */
      purposeId: string
      /** @format uuid */
      versionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Retrieve latest risk analysis configuration
   * @tags purposes
   * @name RetrieveLatestRiskAnalysisConfiguration
   * @request GET:/purposes/riskAnalysis/latest
   * @secure
   */
  export namespace RetrieveLatestRiskAnalysisConfiguration {
    export type RequestParams = {}
    export type RequestQuery = {
      tenantKind?: TenantKind
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = RiskAnalysisFormConfig
  }
  /**
   * @description Retrieve a specified version of risk analysis configuration
   * @tags purposes
   * @name RetrieveRiskAnalysisConfigurationByVersion
   * @request GET:/purposes/riskAnalysis/version/{riskAnalysisVersion}
   * @secure
   */
  export namespace RetrieveRiskAnalysisConfigurationByVersion {
    export type RequestParams = {
      riskAnalysisVersion: string
    }
    export type RequestQuery = {
      /** @format uuid */
      eserviceId: string
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = RiskAnalysisFormConfig
  }
}

export namespace PurposeTemplates {
  /**
   * @description Create a Purpose Template (Draft state)
   * @tags purposeTemplates
   * @name CreatePurposeTemplate
   * @summary Create Purpose Template
   * @request POST:/purposeTemplates
   * @secure
   */
  export namespace CreatePurposeTemplate {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = PurposeTemplateSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Retrieve Tenants that have published a purposeTemplate
   * @tags purposeTemplates
   * @name GetPublishedPurposeTemplateCreators
   * @request GET:/purposeTemplates/filter/creators
   * @secure
   */
  export namespace GetPublishedPurposeTemplateCreators {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter creators by name */
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactOrganizations
  }
  /**
   * @description Link one Eservice to Purpose Template (Draft or Active state)
   * @tags purposeTemplates
   * @name LinkEServiceToPurposeTemplate
   * @summary Link one Eservice to Purpose Template
   * @request POST:/purposeTemplates/{purposeTemplateId}/linkEservice
   * @secure
   */
  export namespace LinkEServiceToPurposeTemplate {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = LinkEServiceToPurposeTemplatePayload
    export type RequestHeaders = {}
    export type ResponseBody = EServiceDescriptorPurposeTemplate
  }
  /**
   * @description Unlink one Eservice from Purpose Template (Draft or Active state)
   * @tags purposeTemplates
   * @name UnlinkEServiceToPurposeTemplate
   * @summary Unlink one Eservice from Purpose Template
   * @request POST:/purposeTemplates/{purposeTemplateId}/unlinkEservice
   * @secure
   */
  export namespace UnlinkEServiceToPurposeTemplate {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UnlinkEServiceToPurposeTemplatePayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Retrieve e-services linked to a purpose template
   * @tags purposeTemplates
   * @name GetPurposeTemplateEServices
   * @summary Get Purpose Template E-Services
   * @request GET:/purposeTemplates/{purposeTemplateId}/eservices
   * @secure
   */
  export namespace GetPurposeTemplateEServices {
    export type RequestParams = {
      /** @format uuid */
      purposeTemplateId: string
    }
    export type RequestQuery = {
      /**
       * comma separated sequence of e-service producer IDs
       * @default []
       */
      producerIds?: string[]
      /** filter linked e-services by name */
      eserviceName?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = EServiceDescriptorsPurposeTemplate
  }
  /**
   * @description Creates the Purpose from a Purpose Template
   * @tags purposes
   * @name CreatePurposeFromTemplate
   * @request POST:/purposeTemplates/{purposeTemplateId}/purposes
   * @secure
   */
  export namespace CreatePurposeFromTemplate {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = PurposeFromTemplateSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Partially update a Purpose from a Purpose Template
   * @tags purposes
   * @name PatchUpdatePurposeFromTemplate
   * @request PATCH:/purposeTemplates/{purposeTemplateId}/purposes/{purposeId}
   * @secure
   */
  export namespace PatchUpdatePurposeFromTemplate {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
      /**
       * the purpose id
       * @format uuid
       */
      purposeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = PatchPurposeUpdateFromTemplateContent
    export type RequestHeaders = {}
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * @description Retrieve a Purpose Template by its ID
   * @tags purposeTemplates
   * @name GetPurposeTemplate
   * @summary Retrieve Purpose Template
   * @request GET:/purposeTemplates/{purposeTemplateId}
   * @secure
   */
  export namespace GetPurposeTemplate {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = PurposeTemplateWithCompactCreator
  }
  /**
   * @description Updates a Purpose Template (Draft state)
   * @tags purposeTemplates
   * @name UpdatePurposeTemplate
   * @summary Update Purpose Template
   * @request PUT:/purposeTemplates/{purposeTemplateId}
   * @secure
   */
  export namespace UpdatePurposeTemplate {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = PurposeTemplateSeed
    export type RequestHeaders = {}
    export type ResponseBody = PurposeTemplate
  }
  /**
   * @description Deletes a specific purpose template if it is in Draft state
   * @tags purposeTemplates
   * @name DeletePurposeTemplate
   * @summary Delete a Purpose Template
   * @request DELETE:/purposeTemplates/{purposeTemplateId}
   * @secure
   */
  export namespace DeletePurposeTemplate {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Add valid new risk analysis answer for the specified purpose template risk analysis.
   * @tags purposeTemplates
   * @name AddPurposeTemplateRiskAnalysisAnswer
   * @summary Add Risk Analysis Answer for a Purpose Template Risk Analysis
   * @request POST:/purposeTemplates/{purposeTemplateId}/riskAnalysis/answers
   * @secure
   */
  export namespace AddPurposeTemplateRiskAnalysisAnswer {
    export type RequestParams = {
      /**
       * Purpose Template unique identifier
       * @format uuid
       */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = RiskAnalysisTemplateAnswerRequest
    export type RequestHeaders = {}
    export type ResponseBody = RiskAnalysisTemplateAnswerResponse
  }
  /**
   * @description Add Answer Annotation Document to Risk Analysis of Purpose Template
   * @tags purposeTemplates
   * @name AddRiskAnalysisTemplateAnswerAnnotationDocument
   * @summary Add Document to Risk Analysis Answer Annotation
   * @request POST:/purposeTemplates/{purposeTemplateId}/riskAnalysis/answers/{answerId}/annotation/documents
   * @secure
   */
  export namespace AddRiskAnalysisTemplateAnswerAnnotationDocument {
    export type RequestParams = {
      /** @format uuid */
      purposeTemplateId: string
      /** @format uuid */
      answerId: string
    }
    export type RequestQuery = {}
    export type RequestBody = AddRiskAnalysisTemplateAnswerAnnotationDocumentPayload
    export type RequestHeaders = {}
    export type ResponseBody = RiskAnalysisTemplateAnswerAnnotationDocument
  }
  /**
   * No description
   * @tags purposeTemplates
   * @name GetRiskAnalysisTemplateAnswerAnnotationDocument
   * @summary Retrieve risk analysis form template answer annotation document
   * @request GET:/purposeTemplates/{purposeTemplateId}/riskAnalysis/answers/{answerId}/annotation/documents/{documentId}
   * @secure
   */
  export namespace GetRiskAnalysisTemplateAnswerAnnotationDocument {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
      /**
       * the risk analysis template answer id
       * @format uuid
       */
      answerId: string
      /**
       * the risk analysis template answer annotation document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * @description Delete a risk analysis form template answer annotation document
   * @tags purposeTemplates
   * @name DeleteRiskAnalysisTemplateAnswerAnnotationDocument
   * @summary Delete risk analysis form template answer annotation document
   * @request DELETE:/purposeTemplates/{purposeTemplateId}/riskAnalysis/answers/{answerId}/annotation/documents/{documentId}
   * @secure
   */
  export namespace DeleteRiskAnalysisTemplateAnswerAnnotationDocument {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
      /**
       * the risk analysis template answer id
       * @format uuid
       */
      answerId: string
      /**
       * the risk analysis template answer annotation document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags purposeTemplates
   * @name UpdateRiskAnalysisTemplateAnswerAnnotationDocument
   * @summary Update Answer Annotation Document in Risk Analysis of Purpose Template
   * @request POST:/purposeTemplates/{purposeTemplateId}/riskAnalysis/answers/{answerId}/annotation/documents/{documentId}/update
   * @secure
   */
  export namespace UpdateRiskAnalysisTemplateAnswerAnnotationDocument {
    export type RequestParams = {
      /**
       * the purpose template id
       * @format uuid
       */
      purposeTemplateId: string
      /**
       * the risk analysis template answer id
       * @format uuid
       */
      answerId: string
      /**
       * the risk analysis template answer annotation document id
       * @format uuid
       */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = UpdateRiskAnalysisTemplateAnswerAnnotationDocumentSeed
    export type RequestHeaders = {}
    export type ResponseBody = RiskAnalysisTemplateAnswerAnnotationDocument
  }
  /**
   * @description Add a risk analysis answer annotation for the specified purpose template risk analysis.
   * @tags purposeTemplates
   * @name AddPurposeTemplateRiskAnalysisAnswerAnnotation
   * @summary Add Risk Analysis Answer Annotation for a Purpose Template Risk Analysis
   * @request PUT:/purposeTemplates/{purposeTemplateId}/riskAnalysis/answers/{answerId}/annotation
   * @secure
   */
  export namespace AddPurposeTemplateRiskAnalysisAnswerAnnotation {
    export type RequestParams = {
      /** @format uuid */
      purposeTemplateId: string
      /** @format uuid */
      answerId: string
    }
    export type RequestQuery = {}
    export type RequestBody = RiskAnalysisTemplateAnswerAnnotationSeed
    export type RequestHeaders = {}
    export type ResponseBody = RiskAnalysisTemplateAnswerAnnotation
  }
  /**
   * @description Delete a risk analysis form template answer annotation and the related files
   * @tags purposeTemplates
   * @name DeleteRiskAnalysisTemplateAnswerAnnotation
   * @summary Delete risk analysis form template answer annotation
   * @request DELETE:/purposeTemplates/{purposeTemplateId}/riskAnalysis/answers/{answerId}/annotation
   * @secure
   */
  export namespace DeleteRiskAnalysisTemplateAnswerAnnotation {
    export type RequestParams = {
      /** @format uuid */
      purposeTemplateId: string
      /** @format uuid */
      answerId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Publishes a purpose template by id (from Draft State to Active State)
   * @tags purposeTemplates
   * @name PublishPurposeTemplate
   * @summary Publish Purpose Template
   * @request POST:/purposeTemplates/{purposeTemplateId}/publish
   * @secure
   */
  export namespace PublishPurposeTemplate {
    export type RequestParams = {
      /** @format uuid */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Unsuspends a purpose template by id (from Suspended State to Active State)
   * @tags purposeTemplates
   * @name UnsuspendPurposeTemplate
   * @summary Unsuspend Purpose Template
   * @request POST:/purposeTemplates/{purposeTemplateId}/unsuspend
   * @secure
   */
  export namespace UnsuspendPurposeTemplate {
    export type RequestParams = {
      /** @format uuid */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Suspends a purpose template by id (from Active State to Suspended State)
   * @tags purposeTemplates
   * @name SuspendPurposeTemplate
   * @summary Suspend Purpose Template
   * @request POST:/purposeTemplates/{purposeTemplateId}/suspend
   * @secure
   */
  export namespace SuspendPurposeTemplate {
    export type RequestParams = {
      /** @format uuid */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Archives a purpose template by id (from Suspended State to Archived State)
   * @tags purposeTemplates
   * @name ArchivePurposeTemplate
   * @summary Archive Purpose Template
   * @request POST:/purposeTemplates/{purposeTemplateId}/archive
   * @secure
   */
  export namespace ArchivePurposeTemplate {
    export type RequestParams = {
      /** @format uuid */
      purposeTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
}

export namespace Creators {
  /**
   * @description Retrieves Creator Purpose Templates
   * @tags purposeTemplates
   * @name GetCreatorPurposeTemplates
   * @summary Retrieves Creator Purpose Templates
   * @request GET:/creators/purposeTemplates
   * @secure
   */
  export namespace GetCreatorPurposeTemplates {
    export type RequestParams = {}
    export type RequestQuery = {
      /** filter by purpose template title */
      q?: string
      /**
       * comma separated sequence of e-service IDs
       * @default []
       */
      eserviceIds?: string[]
      /**
       * comma separated sequence of purpose template states
       * @default []
       */
      states?: PurposeTemplateState[]
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CreatorPurposeTemplates
  }
  /**
   * @description Retrieves Creator EService templates
   * @tags eserviceTemplates
   * @name GetCreatorEServiceTemplates
   * @summary Retrieves Creator EService templates
   * @request GET:/creators/eservices/templates
   * @secure
   */
  export namespace GetCreatorEServiceTemplates {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter EServices templates by name */
      q?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = ProducerEServiceTemplates
  }
}

export namespace CertifiedAttributes {
  /**
   * @description Creates the attribute passed as payload
   * @tags attributes
   * @name CreateCertifiedAttribute
   * @summary Creates attribute
   * @request POST:/certifiedAttributes
   * @secure
   */
  export namespace CreateCertifiedAttribute {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = CertifiedAttributeSeed
    export type RequestHeaders = {}
    export type ResponseBody = Attribute
  }
}

export namespace VerifiedAttributes {
  /**
   * @description Creates the attribute passed as payload
   * @tags attributes
   * @name CreateVerifiedAttribute
   * @summary Creates verified attribute
   * @request POST:/verifiedAttributes
   * @secure
   */
  export namespace CreateVerifiedAttribute {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = AttributeSeed
    export type RequestHeaders = {}
    export type ResponseBody = Attribute
  }
}

export namespace DeclaredAttributes {
  /**
   * @description Creates the attribute passed as payload
   * @tags attributes
   * @name CreateDeclaredAttribute
   * @summary Creates declared attribute
   * @request POST:/declaredAttributes
   * @secure
   */
  export namespace CreateDeclaredAttribute {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = AttributeSeed
    export type RequestHeaders = {}
    export type ResponseBody = Attribute
  }
}

export namespace Attributes {
  /**
   * @description returns attributes
   * @tags attributes
   * @name GetAttributes
   * @summary Get attributes
   * @request GET:/attributes
   * @secure
   */
  export namespace GetAttributes {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter Attributes by name */
      q?: string
      /** Query to filter Attributes by origin */
      origin?: string
      /** @format int32 */
      limit: number
      /** @format int32 */
      offset: number
      /** Array of kinds */
      kinds: AttributeKind[]
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Attributes
  }
  /**
   * @description returns the attribute with given ID, if any.
   * @tags attributes
   * @name GetAttributeById
   * @summary Get Attribute by ID
   * @request GET:/attributes/{attributeId}
   * @secure
   */
  export namespace GetAttributeById {
    export type RequestParams = {
      /**
       * Attribute ID
       * @format uuid
       */
      attributeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Attribute
  }
  /**
   * @description returns the attribute in the registry corresponding to origin and code, if any.
   * @tags attributes
   * @name GetAttributeByOriginAndCode
   * @summary Get Attribute by origin and code
   * @request GET:/attributes/origin/{origin}/code/{code}
   * @secure
   */
  export namespace GetAttributeByOriginAndCode {
    export type RequestParams = {
      /** origin of the attribute to lookup (e.g.: IPA). */
      origin: string
      /** code of the attribute to lookup (e.g.: unique identifier of IPA). */
      code: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Attribute
  }
}

export namespace Clients {
  /**
   * @description retrieves a list of clients
   * @tags clients
   * @name GetClients
   * @summary retrieves a list of clients
   * @request GET:/clients
   * @secure
   */
  export namespace GetClients {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter Clients by name */
      q?: string
      /**
       * comma separated sequence of user IDs
       * @default []
       */
      userIds?: string[]
      /** type of Client to be retrieved */
      kind?: ClientKind
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactClients
  }
  /**
   * @description Retrieves a Client
   * @tags clients
   * @name GetClient
   * @summary Get a Client
   * @request GET:/clients/{clientId}
   * @secure
   */
  export namespace GetClient {
    export type RequestParams = {
      /**
       * The Client id
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Client
  }
  /**
   * @description Deletes a Client
   * @tags clients
   * @name DeleteClient
   * @summary Delete a Client
   * @request DELETE:/clients/{clientId}
   * @secure
   */
  export namespace DeleteClient {
    export type RequestParams = {
      /**
       * The Client id
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Sets an Admin to a Client
   * @tags clients
   * @name SetAdminToClient
   * @summary Sets an Admin to a Client
   * @request POST:/clients/{clientId}/admin
   * @secure
   */
  export namespace SetAdminToClient {
    export type RequestParams = {
      /**
       * ID of Client the users belong to
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = SetAdminToClientPayload
    export type RequestHeaders = {}
    export type ResponseBody = Client
  }
  /**
   * @description Removes an admin from a client
   * @tags clients
   * @name RemoveClientAdmin
   * @summary Removes an admin from a client
   * @request DELETE:/clients/{clientId}/admin/{adminId}
   * @secure
   */
  export namespace RemoveClientAdmin {
    export type RequestParams = {
      /**
       * ID of Client
       * @format uuid
       */
      clientId: string
      /**
       * ID of Admin
       * @format uuid
       */
      adminId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Removes a purpose from a client
   * @tags clients
   * @name RemoveClientPurpose
   * @summary Removes a purpose from a client
   * @request DELETE:/clients/{clientId}/purposes/{purposeId}
   * @secure
   */
  export namespace RemoveClientPurpose {
    export type RequestParams = {
      /**
       * ID of Client
       * @format uuid
       */
      clientId: string
      /**
       * ID of Purpose
       * @format uuid
       */
      purposeId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Given a client and key identifiers it returns the corresponding key, if any
   * @tags clients
   * @name GetClientKeyById
   * @summary Returns a key by client and key identifier (kid).
   * @request GET:/clients/{clientId}/keys/{keyId}
   * @secure
   */
  export namespace GetClientKeyById {
    export type RequestParams = {
      /**
       * ID of the client to look up
       * @format uuid
       */
      clientId: string
      /** the unique identifier of the key (kid) to lookup */
      keyId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = PublicKey
  }
  /**
   * @description Given a client and key identifiers it deletes the corresponding key, if any
   * @tags clients
   * @name DeleteClientKeyById
   * @summary Deletes a key by client and key identifier (kid).
   * @request DELETE:/clients/{clientId}/keys/{keyId}
   * @secure
   */
  export namespace DeleteClientKeyById {
    export type RequestParams = {
      /**
       * ID of the client holding the key
       * @format uuid
       */
      clientId: string
      /** the unique identifier of the key (kid) to delete */
      keyId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Removes an user from a Client
   * @tags clients
   * @name RemoveUserFromClient
   * @summary Remove an user from a Client
   * @request DELETE:/clients/{clientId}/users/{userId}
   * @secure
   */
  export namespace RemoveUserFromClient {
    export type RequestParams = {
      /**
       * The Client id
       * @format uuid
       */
      clientId: string
      /**
       * The identifier of the user between the security user and the consumer
       * @format uuid
       */
      userId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Adds a purpose to a client
   * @tags clients
   * @name AddClientPurpose
   * @summary Adds a purpose to a client
   * @request POST:/clients/{clientId}/purposes
   * @secure
   */
  export namespace AddClientPurpose {
    export type RequestParams = {
      /**
       * ID of Client
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = PurposeAdditionDetailsSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description List client users
   * @tags clients
   * @name GetClientUsers
   * @summary List client users
   * @request GET:/clients/{clientId}/users
   * @secure
   */
  export namespace GetClientUsers {
    export type RequestParams = {
      /**
       * ID of Client the users belong to
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactUsers
  }
  /**
   * @description Binds a security user belonging to a consumer to a Client
   * @tags clients
   * @name AddUsersToClient
   * @summary Binds an user to a Client
   * @request POST:/clients/{clientId}/users
   * @secure
   */
  export namespace AddUsersToClient {
    export type RequestParams = {
      /**
       * ID of Client the users belong to
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = AddUsersToClientPayload
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Creates one or more keys for the corresponding client.
   * @tags clients
   * @name CreateKey
   * @summary Create Keys for the specific clientId.
   * @request POST:/clients/{clientId}/keys
   * @secure
   */
  export namespace CreateKey {
    export type RequestParams = {
      /**
       * ID of client that the added keys MUST belong to
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = KeySeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Given a client identifier it returns its corresponding set of keys, if any
   * @tags clients
   * @name GetClientKeys
   * @summary Returns a set of keys by client ID.
   * @request GET:/clients/{clientId}/keys
   * @secure
   */
  export namespace GetClientKeys {
    export type RequestParams = {
      /**
       * ID of Client
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {
      /**
       * comma separated sequence of user IDs
       * @default []
       */
      userIds?: string[]
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = PublicKeys
  }
  /**
   * @description Given a client and key identifiers it returns the corresponding encoded key, if any
   * @tags clients
   * @name GetEncodedClientKeyById
   * @summary Returns a base64 encoded key by client and key identifier (kid).
   * @request GET:/clients/{clientId}/encoded/keys/{keyId}
   * @secure
   */
  export namespace GetEncodedClientKeyById {
    export type RequestParams = {
      /**
       * ID of the client to look up
       * @format uuid
       */
      clientId: string
      /** the unique identifier of the key (kid) to lookup */
      keyId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = EncodedClientKey
  }
}

export namespace Selfcare {
  /**
   * @description Service to retrieve all active products for given institution and user
   * @tags selfcare
   * @name GetInstitutionUserProducts
   * @summary getInstitutionUserProducts
   * @request GET:/selfcare/institutions/products
   * @secure
   */
  export namespace GetInstitutionUserProducts {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = SelfcareProduct[]
  }
  /**
   * @description The service retrieves all the onboarded institutions related to the provided user
   * @tags selfcare
   * @name GetInstitutions
   * @summary getInstitutions
   * @request GET:/selfcare/institutions
   * @secure
   */
  export namespace GetInstitutions {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = SelfcareInstitution[]
  }
}

export namespace ClientsConsumer {
  /**
   * @description Create a new consumer client
   * @tags clients
   * @name CreateConsumerClient
   * @summary Create a new consumer client
   * @request POST:/clientsConsumer
   * @secure
   */
  export namespace CreateConsumerClient {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = ClientSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
}

export namespace ClientsApi {
  /**
   * @description Create a new API client
   * @tags clients
   * @name CreateApiClient
   * @summary Create a new API client
   * @request POST:/clientsApi
   * @secure
   */
  export namespace CreateApiClient {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = ClientSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
}

export namespace User {
  /**
   * @description Retrieve a specified version of privacy notice
   * @tags privacyNotices
   * @name GetPrivacyNotice
   * @request GET:/user/consent/{consentType}
   * @secure
   */
  export namespace GetPrivacyNotice {
    export type RequestParams = {
      /** Consent Type */
      consentType: ConsentType
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = PrivacyNotice
  }
  /**
   * @description User approve a privacy notice
   * @tags privacyNotices
   * @name AcceptPrivacyNotice
   * @request POST:/user/consent/{consentType}
   * @secure
   */
  export namespace AcceptPrivacyNotice {
    export type RequestParams = {
      /** Consent Type */
      consentType: ConsentType
    }
    export type RequestQuery = {}
    export type RequestBody = PrivacyNoticeSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
}

export namespace PrivacyNotices {
  /**
   * @description Retrieve the content of the privacy notice version
   * @tags privacyNotices
   * @name GetPrivacyNoticeContent
   * @request GET:/privacyNotices/{consentType}
   * @secure
   */
  export namespace GetPrivacyNoticeContent {
    export type RequestParams = {
      /** Consent Type */
      consentType: ConsentType
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
}

export namespace Support {
  /**
   * @description This route is used to redirect support flow to the dedicated page
   * @tags authorization
   * @name SamlLoginCallback
   * @request POST:/support
   */
  export namespace SamlLoginCallback {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = GoogleSAMLPayload
    export type RequestHeaders = {}
    export type ResponseBody = any
  }
}

export namespace ProducerKeychains {
  /**
   * @description Create a producer keychain
   * @tags producerKeychain
   * @name CreateProducerKeychain
   * @summary Create a producer keychain
   * @request POST:/producerKeychains
   * @secure
   */
  export namespace CreateProducerKeychain {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = ProducerKeychainSeed
    export type RequestHeaders = {}
    export type ResponseBody = CreatedResource
  }
  /**
   * @description List producer keychains
   * @tags producerKeychain
   * @name GetProducerKeychains
   * @summary List producer keychains
   * @request GET:/producerKeychains
   * @secure
   */
  export namespace GetProducerKeychains {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Filter for the producer keychain name */
      q?: string
      /**
       * comma separated sequence of user IDs
       * @default []
       */
      userIds?: string[]
      /**
       * ID of e-service that MUST be related to the Producer Keychain
       * @format uuid
       */
      eserviceId?: string
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactProducerKeychains
  }
  /**
   * @description Retrieves a Producer Keychain
   * @tags producerKeychain
   * @name GetProducerKeychain
   * @summary Get a Producer Keychain
   * @request GET:/producerKeychains/{producerKeychainId}
   * @secure
   */
  export namespace GetProducerKeychain {
    export type RequestParams = {
      /**
       * The Producer Keychain id
       * @format uuid
       */
      producerKeychainId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = ProducerKeychain
  }
  /**
   * @description Deletes a Producer Keychain
   * @tags producerKeychain
   * @name DeleteProducerKeychain
   * @summary Delete a Producer Keychain
   * @request DELETE:/producerKeychains/{producerKeychainId}
   * @secure
   */
  export namespace DeleteProducerKeychain {
    export type RequestParams = {
      /**
       * The Producer Keychain id
       * @format uuid
       */
      producerKeychainId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description List Producer Keychain users
   * @tags producerKeychain
   * @name GetProducerKeychainUsers
   * @summary List Producer Keychain users
   * @request GET:/producerKeychains/{producerKeychainId}/users
   * @secure
   */
  export namespace GetProducerKeychainUsers {
    export type RequestParams = {
      /**
       * ID of Producer Keychain the users belong to
       * @format uuid
       */
      producerKeychainId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactUsers
  }
  /**
   * @description Add users to a Producer Keychain
   * @tags producerKeychain
   * @name AddProducerKeychainUsers
   * @summary Add users to a Producer Keychain
   * @request POST:/producerKeychains/{producerKeychainId}/users
   * @secure
   */
  export namespace AddProducerKeychainUsers {
    export type RequestParams = {
      /**
       * ID of Producer Keychain the users belong to
       * @format uuid
       */
      producerKeychainId: string
    }
    export type RequestQuery = {}
    export type RequestBody = AddProducerKeychainUsersPayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Removes a user from a Producer Keychain
   * @tags producerKeychain
   * @name RemoveProducerKeychainUser
   * @summary Remove a user from a Producer Keychain
   * @request DELETE:/producerKeychains/{producerKeychainId}/users/{userId}
   * @secure
   */
  export namespace RemoveProducerKeychainUser {
    export type RequestParams = {
      /**
       * The Producer Keychain id
       * @format uuid
       */
      producerKeychainId: string
      /**
       * The identifier of the user between the security user and the consumer
       * @format uuid
       */
      userId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Creates a key for the corresponding producer keychain.
   * @tags producerKeychain
   * @name CreateProducerKey
   * @summary Create key for the specific producerKeychainId.
   * @request POST:/producerKeychains/{producerKeychainId}/keys
   * @secure
   */
  export namespace CreateProducerKey {
    export type RequestParams = {
      /**
       * ID of producer keychain that the added key MUST belong to
       * @format uuid
       */
      producerKeychainId: string
    }
    export type RequestQuery = {}
    export type RequestBody = KeySeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Given a producer keychain identifier it returns its corresponding set of keys, if any
   * @tags producerKeychain
   * @name GetProducerKeys
   * @summary Returns a set of keys by producer keychain ID.
   * @request GET:/producerKeychains/{producerKeychainId}/keys
   * @secure
   */
  export namespace GetProducerKeys {
    export type RequestParams = {
      /**
       * ID of the producer keychain to look up
       * @format uuid
       */
      producerKeychainId: string
    }
    export type RequestQuery = {
      /**
       * comma separated sequence of user IDs
       * @default []
       */
      userIds?: string[]
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = PublicKeys
  }
  /**
   * @description Given a producer keychain and key identifiers it returns the corresponding key, if any
   * @tags producerKeychain
   * @name GetProducerKeyById
   * @summary Returns a key by producer keychain and key identifier (kid).
   * @request GET:/producerKeychains/{producerKeychainId}/keys/{keyId}
   * @secure
   */
  export namespace GetProducerKeyById {
    export type RequestParams = {
      /**
       * ID of the producer keychain to look up
       * @format uuid
       */
      producerKeychainId: string
      /** the unique identifier of the key (kid) to lookup */
      keyId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = PublicKey
  }
  /**
   * @description Given a producer keychain and key identifiers it deletes the corresponding key, if any
   * @tags producerKeychain
   * @name DeleteProducerKeyById
   * @summary Deletes a key by producer keychain id and key identifier (kid).
   * @request DELETE:/producerKeychains/{producerKeychainId}/keys/{keyId}
   * @secure
   */
  export namespace DeleteProducerKeyById {
    export type RequestParams = {
      /**
       * ID of the producer keychain holding the key
       * @format uuid
       */
      producerKeychainId: string
      /** the unique identifier of the key (kid) to delete */
      keyId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Adds an eservice to a producer keychain
   * @tags producerKeychain
   * @name AddProducerKeychainEService
   * @summary Adds an eservice to a producer keychain
   * @request POST:/producerKeychains/{producerKeychainId}/eservices
   * @secure
   */
  export namespace AddProducerKeychainEService {
    export type RequestParams = {
      /**
       * ID of Producer Keychain
       * @format uuid
       */
      producerKeychainId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceAdditionDetailsSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Removes an eservice from a producer keychain
   * @tags producerKeychain
   * @name RemoveProducerKeychainEService
   * @summary Removes an eservice from a producer keychain
   * @request DELETE:/producerKeychains/{producerKeychainId}/eservices/{eserviceId}
   * @secure
   */
  export namespace RemoveProducerKeychainEService {
    export type RequestParams = {
      /**
       * ID of Producer Keychain
       * @format uuid
       */
      producerKeychainId: string
      /**
       * ID of EService
       * @format uuid
       */
      eserviceId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Given a producer keychain id and key identifiers it returns the corresponding encoded key, if any
   * @tags producerKeychain
   * @name GetEncodedProducerKeychainKeyById
   * @summary Returns a base64 encoded key by producer keychain and key identifier (kid).
   * @request GET:/producerKeychains/{producerKeychainId}/encoded/keys/{keyId}
   * @secure
   */
  export namespace GetEncodedProducerKeychainKeyById {
    export type RequestParams = {
      /**
       * ID of the producer keychain to look up
       * @format uuid
       */
      producerKeychainId: string
      /** the unique identifier of the key (kid) to lookup */
      keyId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = EncodedClientKey
  }
}

export namespace Delegations {
  /**
   * @description List delegations
   * @tags delegations
   * @name GetDelegations
   * @summary List delegations
   * @request GET:/delegations
   * @secure
   */
  export namespace GetDelegations {
    export type RequestParams = {}
    export type RequestQuery = {
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
      /**
       * comma separated sequence of delegation states to filter the results with
       * @default []
       */
      states?: DelegationState[]
      /**
       * The delegator ids to filter by
       * @default []
       */
      delegatorIds?: string[]
      /**
       * The delegated ids to filter by
       * @default []
       */
      delegateIds?: string[]
      /** The delegation kind to filter by */
      kind?: DelegationKind
      /** @default [] */
      eserviceIds?: string[]
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = CompactDelegations
  }
  /**
   * @description Retrieves delegation
   * @tags delegations
   * @name GetDelegation
   * @summary Retrieves delegation
   * @request GET:/delegations/{delegationId}
   * @secure
   */
  export namespace GetDelegation {
    export type RequestParams = {
      /**
       * The delegation id
       * @format uuid
       */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Delegation
  }
  /**
   * @description Retrieve a contract of a delegation
   * @tags delegations
   * @name GetDelegationContract
   * @summary Retrieve a contract of a delegation
   * @request GET:/delegations/{delegationId}/contracts/{contractId}
   * @secure
   */
  export namespace GetDelegationContract {
    export type RequestParams = {
      /** @format uuid */
      delegationId: string
      /** @format uuid */
      contractId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
  /**
   * @description Retrieve the signed contract file for a given delegationId
   * @tags delegations
   * @name GetDelegationSignedContract
   * @summary Retrieve the signed contract of a delegation
   * @request GET:/delegations/{delegationId}/signedContract
   * @secure
   */
  export namespace GetDelegationSignedContract {
    export type RequestParams = {
      /**
       * The identifier of the delegation
       * @format uuid
       */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = File
  }
}

export namespace InAppNotifications {
  /**
   * @description Retrieves a list of notifications
   * @tags inAppNotifications
   * @name GetNotifications
   * @summary Retrieves a list of notifications
   * @request GET:/inAppNotifications
   */
  export namespace GetNotifications {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter notifications */
      q?: string
      /** Category to filter notifications */
      category?: 'Subscribers' | 'Providers' | 'Delegations' | 'AttributesAndKeys'
      /**
       * @format int32
       * @min 0
       */
      offset: number
      /**
       * @format int32
       * @min 1
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Notifications
  }
  /**
   * @description Delete bulk notifications
   * @tags inAppNotifications
   * @name DeleteNotifications
   * @summary Delete bulk notifications
   * @request DELETE:/inAppNotifications
   * @secure
   */
  export namespace DeleteNotifications {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = DeleteNotificationsPayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Mark a list of notifications as read
   * @tags inAppNotifications
   * @name MarkNotificationsAsRead
   * @summary Mark a list of notifications as read
   * @request POST:/inAppNotifications/bulk/markAsRead
   * @secure
   */
  export namespace MarkNotificationsAsRead {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = MarkNotificationsAsReadPayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Mark a notification as read
   * @tags inAppNotifications
   * @name MarkNotificationAsRead
   * @summary Mark a notification as read
   * @request POST:/inAppNotifications/:notificationId/markAsRead
   * @secure
   */
  export namespace MarkNotificationAsRead {
    export type RequestParams = {
      /** @format uuid */
      notificationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Mark a notification as unread
   * @tags inAppNotifications
   * @name MarkNotificationAsUnread
   * @summary Mark a notification as unread
   * @request POST:/inAppNotifications/:notificationId/markAsUnread
   * @secure
   */
  export namespace MarkNotificationAsUnread {
    export type RequestParams = {
      /** @format uuid */
      notificationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Mark a list of notifications as unread
   * @tags inAppNotifications
   * @name MarkNotificationsAsUnread
   * @summary Mark a list of notifications as unread
   * @request POST:/inAppNotifications/bulk/markAsUnread
   * @secure
   */
  export namespace MarkNotificationsAsUnread {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = MarkNotificationsAsUnreadPayload
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Mark all notifications with the given entity ID as read
   * @tags inAppNotifications
   * @name MarkNotificationsAsReadByEntityId
   * @summary Mark all notifications with the given entity ID as read
   * @request POST:/inAppNotifications/markAsReadByEntityId/:entityId
   * @secure
   */
  export namespace MarkNotificationsAsReadByEntityId {
    export type RequestParams = {
      entityId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * @description Delete a notification
   * @tags inAppNotifications
   * @name DeleteNotification
   * @summary Delete a notification
   * @request DELETE:/inAppNotifications/:notificationId
   * @secure
   */
  export namespace DeleteNotification {
    export type RequestParams = {
      /** @format uuid */
      notificationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags inAppNotifications
   * @name GetNotificationsCountBySection
   * @summary Retrieve the count of notifications grouped by section and subsection
   * @request GET:/inAppNotifications/count
   * @secure
   */
  export namespace GetNotificationsCountBySection {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = NotificationsCountBySection
  }
}

export namespace TenantNotificationConfigs {
  /**
   * No description
   * @tags notificationConfigs
   * @name GetTenantNotificationConfig
   * @summary Retrieve the tenant's notification configuration
   * @request GET:/tenantNotificationConfigs
   */
  export namespace GetTenantNotificationConfig {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = TenantNotificationConfig
  }
  /**
   * No description
   * @tags notificationConfigs
   * @name UpdateTenantNotificationConfig
   * @summary Update the tenant's notification configuration
   * @request POST:/tenantNotificationConfigs
   */
  export namespace UpdateTenantNotificationConfig {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = TenantNotificationConfigUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
}

export namespace UserNotificationConfigs {
  /**
   * No description
   * @tags notificationConfigs
   * @name GetUserNotificationConfig
   * @summary Retrieve the user's notification configuration
   * @request GET:/userNotificationConfigs
   */
  export namespace GetUserNotificationConfig {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = UserNotificationConfig
  }
  /**
   * No description
   * @tags notificationConfigs
   * @name UpdateUserNotificationConfig
   * @summary Update the user's notification configuration
   * @request POST:/userNotificationConfigs
   */
  export namespace UpdateUserNotificationConfig {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = UserNotificationConfigUpdateSeed
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
}

export namespace EmailDeepLink {
  /**
   * No description
   * @tags emailDeepLink
   * @name GetNotificationDeeplink
   * @summary Redirect the user to the correct deepLink based on notification type and entity id
   * @request GET:/emailDeepLink/{notificationType}/{entityId}
   */
  export namespace GetNotificationDeeplink {
    export type RequestParams = {
      /** The type of the notification */
      notificationType: string
      /** The id of the entity */
      entityId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = any
  }
}

export namespace ApiDocs {
  /**
   * @description Display the API documentation
   * @tags develop
   * @name GetDocs
   * @summary Swagger docs endpoint
   * @request GET:/apiDocs
   */
  export namespace GetDocs {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = void
  }
}

export namespace Status {
  /**
   * @description Return ok
   * @tags health
   * @name GetStatus
   * @summary Health status endpoint
   * @request GET:/status
   */
  export namespace GetStatus {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = Problem
  }
}
