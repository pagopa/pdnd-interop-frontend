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
}

export interface UpdateEServiceDescriptorQuotas {
  /**
   * @format int32
   * @min 0
   */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   * @min 0
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 0
   */
  dailyCallsTotal: number
}

export interface UpdateEServiceDescriptorSeed {
  description?: string
  audience: string[]
  /** @format int32 */
  voucherLifespan: number
  /**
   * maximum number of daily calls that this descriptor can afford.
   * @format int32
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
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
   * @min 0
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 0
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
}

/** Risk Analysis Mode */
export type EServiceMode = 'RECEIVE' | 'DELIVER'

export interface EServiceRiskAnalysisSeed {
  name: string
  riskAnalysisForm: RiskAnalysisFormSeed
}

export interface EServiceRiskAnalysis {
  /** @format uuid */
  id: string
  name: string
  riskAnalysisForm: RiskAnalysisForm
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
   * @min 0
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   * @min 0
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
  rejectionReasons?: DescriptorRejectionReason[]
  /** @format date-time */
  publishedAt?: string
  /** @format date-time */
  deprecatedAt?: string
  /** @format date-time */
  archivedAt?: string
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
}

export interface ProducerDescriptorEServiceProducer {
  /** @format uuid */
  id: string
  tenantKind?: TenantKind
}

export interface EServiceDoc {
  /** @format uuid */
  id: string
  name: string
  contentType: string
  prettyName: string
}

export interface UpdateEServiceDescriptorDocumentSeed {
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
}

/** contains the expected payload for purpose version creation. */
export interface PurposeVersionSeed {
  /**
   * maximum number of daily calls that this version can perform.
   * @format int32
   * @min 0
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
   * @min 0
   */
  dailyCalls: number
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
   * @min 0
   */
  dailyCalls: number
}

export interface CompactOrganization {
  /** @format uuid */
  id: string
  name: string
  kind?: TenantKind
  contactMail?: Mail
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
   */
  dailyCallsPerConsumer: number
  /**
   * total daily calls available for this e-service.
   * @format int32
   */
  dailyCallsTotal: number
  delegation?: DelegationWithCompactTenants
}

export interface PurposeAdditionDetailsSeed {
  /** @format uuid */
  purposeId: string
}

export type CompactUsers = CompactUser[]

export type KeysSeed = KeySeed[]

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
  eservices: ProducerKeychainEService[]
  description: string
}

export interface ProducerKeychainEService {
  /** @format uuid */
  id: string
  name: string
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
  /** Kind of the attribute. It's one of CERTIFIED, VERIFIED, DECLARED. */
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
   */
  dailyCallsPerConsumer?: number
  /**
   * @format int32
   * @min 1
   */
  dailyCallsTotal?: number
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

export interface GetAgreementProducersParams {
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

export interface GetAgreementConsumersParams {
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
   * @max 50
   */
  limit: number
}

export interface GetConsumerDelegatorsParams {
  q?: string
  /** @default [] */
  eserviceIds?: string[]
  /** @format int32 */
  offset: number
  /** @format int32 */
  limit: number
}

export interface GetConsumerDelegatorsWithAgreementsParams {
  q?: string
  /** @format int32 */
  offset: number
  /** @format int32 */
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

export interface GetProducersParams {
  q?: string
  /** @format int32 */
  offset: number
  /** @format int32 */
  limit: number
}

export interface GetProducerEServicesParams {
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

export interface GetAgreementEServiceProducersParams {
  /** Query to filter EServices by name */
  q?: string
  /**
   * comma separated sequence of states
   * @default []
   */
  states?: AgreementState[]
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

export interface GetAgreementEServiceConsumersParams {
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

export interface RevokeVerifiedAttributePayload {
  /** @format uuid */
  agreementId: string
}

export interface GetAttributesParams {
  /** Query to filter Attributes by name */
  q?: string
  /** Query to filter Attributes by origin */
  origin?: string
  limit: number
  offset: number
  /**
   * Array of kinds
   * @default []
   */
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
   * ID of producer that MUST be related to the keychain
   * @format uuid
   */
  producerId: string
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** @default [] */
      eserviceIds?: string[]
      /** @format int32 */
      offset: number
      /** @format int32 */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** @format int32 */
      offset: number
      /** @format int32 */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CompactOrganizations
  }
  /**
   * @description Retrieves eservices for consumers in agreements
   * @tags agreements
   * @name GetAgreementEServiceConsumers
   * @summary Retrieves eservices for consumers in agreements
   * @request GET:/consumers/agreements/eservices
   * @secure
   */
  export namespace GetAgreementEServiceConsumers {
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** The delegation id */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** @format int32 */
      offset: number
      /** @format int32 */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = ProducerEServices
  }
  /**
   * @description Retrieves eservices for producers in agreements
   * @tags agreements
   * @name GetAgreementEServiceProducers
   * @summary Retrieves eservices for producers in agreements
   * @request GET:/producers/agreements/eservices
   * @secure
   */
  export namespace GetAgreementEServiceProducers {
    export type RequestParams = {}
    export type RequestQuery = {
      /** Query to filter EServices by name */
      q?: string
      /**
       * comma separated sequence of states
       * @default []
       */
      states?: AgreementState[]
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** The delegation id */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
   * @name GetAgreementProducers
   * @summary Retrieves Tenants that are producers with existing Agreements
   * @request GET:/agreements/filter/producers
   * @secure
   */
  export namespace GetAgreementProducers {
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CompactOrganizations
  }
  /**
   * @description Retrieves Tenants that are consumers with existing Agreements
   * @tags agreements
   * @name GetAgreementConsumers
   * @summary Retrieves Tenants that are consumers with existing Agreements
   * @request GET:/agreements/filter/consumers
   * @secure
   */
  export namespace GetAgreementConsumers {
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = Agreement
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
       * @max 50
       */
      limit: number
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CatalogEServiceDescriptor
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CreatedResource
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** the eservice id */
      eServiceId: string
      /** the descriptor Id */
      descriptorId: string
      /** the document id */
      documentId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CreatedResource
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CreatedResource
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CreatedResource
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplateAudienceDescription
   * @summary Update an e-service template audience description
   * @request POST:/eservices/templates/{eServiceTemplateId}/audienceDescription/update
   * @secure
   */
  export namespace UpdateEServiceTemplateAudienceDescription {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateDescriptionUpdateSeed
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = void
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name UpdateEServiceTemplateEServiceDescription
   * @summary Update an e-service template e-service description
   * @request POST:/eservices/templates/{eServiceTemplateId}/eserviceDescription/update
   * @secure
   */
  export namespace UpdateEServiceTemplateEServiceDescription {
    export type RequestParams = {
      /**
       * the eservice template id
       * @format uuid
       */
      eServiceTemplateId: string
    }
    export type RequestQuery = {}
    export type RequestBody = EServiceTemplateDescriptionUpdateSeed
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CreatedResource
  }
  /**
   * No description
   * @tags eserviceTemplates
   * @name CreateEServiceTemplateVersion
   * @summary Adds a mew version to the specified e-service template
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = RiskAnalysisFormConfig
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      limit: number
      offset: number
      /**
       * Array of kinds
       * @default []
       */
      kinds: AttributeKind[]
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Creates one or more keys for the corresponding client.
   * @tags clients
   * @name CreateKeys
   * @summary Create Keys for the specific clientId.
   * @request POST:/clients/{clientId}/keys
   * @secure
   */
  export namespace CreateKeys {
    export type RequestParams = {
      /**
       * ID of client that the added keys MUST belong to
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = KeysSeed
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
       * ID of producer that MUST be related to the keychain
       * @format uuid
       */
      producerId: string
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** The Producer Keychain id */
      producerKeychainId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** The Producer Keychain id */
      producerKeychainId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
      /** The delegation id */
      delegationId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
    }
    export type ResponseBody = File
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
