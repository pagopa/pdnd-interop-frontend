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

export interface UpdateEServiceSeed {
  name: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  attributes: EServiceAttributesSeed
}

export interface EServiceSeed {
  name: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  attributes: EServiceAttributesSeed
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
}

export interface Mail {
  address: string
  description?: string
}

export interface EServiceDescriptorSeed {
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
}

export interface CatalogEServiceDescriptor {
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
  eservice: CatalogDescriptorEService
}

/** Models Client details */
export interface Client {
  /** @format uuid */
  id: string
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

export interface CatalogDescriptorEService {
  /** @format uuid */
  id: string
  name: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  attributes: EServiceAttributes
  descriptors: CompactDescriptor[]
  agreement?: CompactAgreement
  isMine: boolean
  hasCertifiedAttributes: boolean
  isSubscribed: boolean
  activeDescriptor?: CompactDescriptor
  mail?: Mail
}

export interface ProducerEServiceDetails {
  /** @format uuid */
  id: string
  name: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  attributes: EServiceAttributes
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
}

export interface ProducerDescriptorEService {
  /** @format uuid */
  id: string
  name: string
  description: string
  /** EService Descriptor State */
  technology: EServiceTechnology
  attributes: EServiceAttributes
  descriptors: CompactDescriptor[]
  draftDescriptor?: CompactDescriptor
  mail?: Mail
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
  producer: CompactTenant
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
}

/** contains the information for agreement update. */
export interface AgreementUpdatePayload {
  consumerNotes: string
}

/** Tenant Delta model */
export interface TenantDelta {
  contactEmail: string
  description?: string
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
  hasCertifiedAttributes: boolean
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

export interface CompactPurposeEService {
  /** @format uuid */
  id: string
  name: string
  producer: CompactOrganization
  descriptor: CompactDescriptor
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
  riskAnalysisForm?: RiskAnalysisForm
  title: string
  description: string
}

/** contains the expected payload for purpose version update. */
export interface WaitingForApprovalPurposeVersionUpdateContentSeed {
  /**
   * Estimated expected approval date for a purpose version
   * @format date-time
   */
  expectedApprovalDate: string
}

export interface CompactOrganization {
  /** @format uuid */
  id: string
  name: string
}

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

/** Represents the generic available role types for the relationship */
export type PartyRole = 'MANAGER' | 'DELEGATE' | 'SUB_DELEGATE' | 'OPERATOR'

export interface ProducerEService {
  /** @format uuid */
  id: string
  name: string
  activeDescriptor?: CompactDescriptor
  draftDescriptor?: CompactDescriptor
}

export interface ProducerEServices {
  results: ProducerEService[]
  pagination: Pagination
}

export interface ProductInfo {
  id: string
  role: string
  /** @format date-time */
  createdAt: string
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
  suspendedByConsumer?: boolean
  suspendedByProducer?: boolean
}

export interface PurposeAdditionDetailsSeed {
  /** @format uuid */
  purposeId: string
}

/** Represents the Client Operator state */
export type OperatorState = 'ACTIVE' | 'SUSPENDED' | 'DELETED'

/** Represents the generic available role types for the relationship */
export type OperatorRole = 'MANAGER' | 'DELEGATE' | 'SUB_DELEGATE' | 'OPERATOR'

/** Models a Client Operator */
export interface Operator {
  /** @format uuid */
  relationshipId: string
  taxCode: string
  name: string
  familyName: string
  /** Represents the generic available role types for the relationship */
  role: OperatorRole
  product: RelationshipProduct
  /** Represents the Client Operator state */
  state: OperatorState
}

export type Operators = object

export interface RelationshipProduct {
  id: string
  role: string
  /** @format date-time */
  createdAt: string
}

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
}

export interface CompactClient {
  /** @format uuid */
  id: string
  name: string
  hasKeys: boolean
}

/** contains the expected payload for purpose update. */
export interface PurposeUpdateContent {
  title: string
  description: string
  riskAnalysisForm?: RiskAnalysisForm
}

export interface Purposes {
  results: Purpose[]
  pagination: Pagination
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
  expectedApprovalDate?: string
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
  | 'WAITING_FOR_APPROVAL'
  | 'ARCHIVED'

/** Represents the party relationship state */
export type RelationshipState = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'REJECTED'

export interface RelationshipInfo {
  /** @format uuid */
  id: string
  /** @format uuid */
  from: string
  /** @format uuid */
  to: string
  name: string
  familyName: string
  taxCode: string
  /** Represents the generic available role types for the relationship */
  role: PartyRole
  product: ProductInfo
  /** Represents the party relationship state */
  state: RelationshipState
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt?: string
}

export type RelationshipsResponse = RelationshipInfo[]

export interface RiskAnalysisForm {
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

/** EService Descriptor State */
export type EServiceTechnology = 'REST' | 'SOAP'

export interface EServiceAttributes {
  certified: EServiceAttribute[]
  declared: EServiceAttribute[]
  verified: EServiceAttribute[]
}

export interface EServiceAttribute {
  single?: EServiceAttributeValue
  group?: EServiceAttributeValue[]
}

export interface EServiceAttributeValue {
  /** @format uuid */
  id: string
  name: string
  description: string
  explicitAttributeVerification: boolean
}

export interface EServiceAttributesSeed {
  certified: EServiceAttributeSeed[]
  declared: EServiceAttributeSeed[]
  verified: EServiceAttributeSeed[]
}

export interface EServiceAttributeSeed {
  single?: EServiceAttributeValueSeed
  group?: EServiceAttributeValueSeed[]
}

export interface EServiceAttributeValueSeed {
  /** @format uuid */
  id: string
  explicitAttributeVerification: boolean
}

/**
 * AttributeSeed
 * Models the attribute registry entry as payload response
 */
export interface AttributeSeed {
  /** identifies the unique code of this attribute on the registry */
  code?: string
  kind: AttributeKind
  description: string
  /** represents the origin of this attribute (e.g.: IPA for the certified ones, etc.) */
  origin?: string
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

/** contains the expected payload for purpose version update. */
export interface DraftPurposeVersionUpdateContent {
  /**
   * maximum number of daily calls that this version can perform.
   * @format int32
   * @min 0
   */
  dailyCalls: number
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

/** AttributesResponse */
export interface AttributesResponse {
  attributes: Attribute[]
}

export interface CompactTenant {
  /** @format uuid */
  id: string
  name: string
}

export interface ExternalId {
  origin: string
  value: string
}

export interface Tenant {
  /** @format uuid */
  id: string
  /** @format uuid */
  selfcareId?: string
  externalId: ExternalId
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt?: string
  name: string
  attributes: TenantAttributes
  contactMail?: Mail
}

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
}

export interface DeclaredTenantAttributeSeed {
  /** @format uuid */
  id: string
}

export interface VerifiedTenantAttributeSeed {
  /** @format uuid */
  id: string
  renewal: VerificationRenewal
  /** @format date-time */
  expirationDate?: string
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

export type VerificationRenewal = 'REVOKE_ON_EXPIRATION' | 'AUTOMATIC_RENEWAL'

export interface TenantVerifier {
  /** @format uuid */
  id: string
  /** @format date-time */
  verificationDate: string
  renewal: VerificationRenewal
  /** @format date-time */
  expirationDate?: string
  /** @format date-time */
  extensionDate?: string
}

export interface TenantRevoker {
  /** @format uuid */
  id: string
  /** @format date-time */
  verificationDate: string
  renewal: VerificationRenewal
  /** @format date-time */
  expirationDate?: string
  /** @format date-time */
  extensionDate?: string
  /** @format date-time */
  revocationDate: string
}

export interface PublicKey {
  keyId: string
  name: string
  /** Contains some details about operator */
  operator: SelfcareUser
  /** @format date-time */
  createdAt: string
  isOrphan: boolean
}

/** Contains some details about operator */
export interface SelfcareUser {
  /** @format uuid */
  relationshipId: string
  name: string
  familyName: string
}

export interface PublicKeys {
  keys: PublicKey[]
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

export interface GetAgreementsParams {
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
   * comma separated sequence of states
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

export interface GetUserInstitutionRelationshipsParams {
  /**
   * the person identifier
   * @format uuid
   */
  personId?: string
  /**
   * comma separated sequence of role to filter the response with
   * @default []
   */
  roles?: PartyRole[]
  /**
   * comma separated sequence of states to filter the response with
   * @default []
   */
  states?: RelationshipState[]
  /**
   * comma separated sequence of product roles to filter the response with
   * @default []
   */
  productRoles?: string[]
  /** filter applied to name/surname */
  query?: string
  /**
   * The internal identifier of the tenant
   * @format uuid
   */
  tenantId: string
}

export interface GetPurposesParams {
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

export interface GetAttributesParams {
  search?: string
}

export interface GetClientsParams {
  /** Query to filter Clients by name */
  q?: string
  /**
   * comma separated sequence of relationship IDs
   * @default []
   */
  relationshipIds?: string[]
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

export namespace Agreements {
  /**
   * @description retrieves a list of agreements
   * @tags agreements
   * @name GetAgreements
   * @summary retrieves a list of agreements
   * @request GET:/agreements
   * @secure
   */
  export namespace GetAgreements {
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Agreements
  }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Agreement
  }
  /**
   * No description
   * @tags agreements
   * @name DeleteAgreement
   * @summary Delete an agreement. This operation is valid only for agreements in DRAFT or MISSING_CERTIFIED_ATTRIBUTES
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Agreement
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Agreement
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
       * comma separated sequence of states
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = CatalogEServiceDescriptor
  }
}

export namespace Consumers {
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = CompactEServicesLight
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = CreatedResource
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
    export type RequestBody = EServiceDescriptorSeed
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
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
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = EServiceDoc
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = CreatedResource
  }
}

export namespace Producers {
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = ProducerEServiceDescriptor
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = SessionToken
  }
}

export namespace Tenants {
  /**
   * @description Return ok
   * @tags party
   * @name GetUserInstitutionRelationships
   * @summary returns the relationships related to the institution
   * @request GET:/tenants/{tenantId}/relationships
   * @secure
   */
  export namespace GetUserInstitutionRelationships {
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
      roles?: PartyRole[]
      /**
       * comma separated sequence of states to filter the response with
       * @default []
       */
      states?: RelationshipState[]
      /**
       * comma separated sequence of product roles to filter the response with
       * @default []
       */
      productRoles?: string[]
      /** filter applied to name/surname */
      query?: string
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = RelationshipsResponse
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
       * Tenant id
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
    export type RequestBody = never
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Tenant
  }
  /**
   * @description Updates the content of the tenant
   * @tags tenants
   * @name UpdateTenant
   * @summary Updates the content of the tenant
   * @request POST:/tenants/{tenantId}
   * @secure
   */
  export namespace UpdateTenant {
    export type RequestParams = {
      /**
       * The internal identifier of the tenant
       * @format uuid
       */
      tenantId: string
    }
    export type RequestQuery = {}
    export type RequestBody = TenantDelta
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = void
  }
}

export namespace Relationships {
  /**
   * @description Gets relationship
   * @tags party
   * @name GetRelationship
   * @summary Gets the corresponding relationship
   * @request GET:/relationships/{relationshipId}
   * @secure
   */
  export namespace GetRelationship {
    export type RequestParams = {
      /**
       * The identifier of the relationship
       * @format uuid
       */
      relationshipId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {}
    export type ResponseBody = RelationshipInfo
  }
}

export namespace Purposes {
  /**
   * @description Retrieve Purposes
   * @tags purposes
   * @name GetPurposes
   * @request GET:/purposes
   * @secure
   */
  export namespace GetPurposes {
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Purposes
  }
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
      'X-Forwarded-For'?: string
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
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = File
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * No description
   * @tags purposes
   * @name UpdateWaitingForApprovalPurposeVersion
   * @summary Update a purpose version in waiting for approval
   * @request POST:/purposes/{purposeId}/versions/{versionId}/update/waitingForApproval
   * @secure
   */
  export namespace UpdateWaitingForApprovalPurposeVersion {
    export type RequestParams = {
      /** @format uuid */
      purposeId: string
      /** @format uuid */
      versionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = WaitingForApprovalPurposeVersionUpdateContentSeed
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = PurposeVersionResource
  }
  /**
   * No description
   * @tags purposes
   * @name UpdateDraftPurposeVersion
   * @summary Update a purpose version in draft
   * @request POST:/purposes/{purposeId}/versions/{versionId}/update/draft
   * @secure
   */
  export namespace UpdateDraftPurposeVersion {
    export type RequestParams = {
      /** @format uuid */
      purposeId: string
      /** @format uuid */
      versionId: string
    }
    export type RequestQuery = {}
    export type RequestBody = DraftPurposeVersionUpdateContent
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = void
  }
}

export namespace Attributes {
  /**
   * @description Returns the list of currently available attributes
   * @tags attributes
   * @name GetAttributes
   * @summary returns the list of attributes available on the registry
   * @request GET:/attributes
   * @secure
   */
  export namespace GetAttributes {
    export type RequestParams = {}
    export type RequestQuery = {
      search?: string
    }
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = AttributesResponse
  }
  /**
   * @description Creates the attribute passed as payload
   * @tags attributes
   * @name CreateAttribute
   * @summary Creates attribute
   * @request POST:/attributes
   * @secure
   */
  export namespace CreateAttribute {
    export type RequestParams = {}
    export type RequestQuery = {}
    export type RequestBody = AttributeSeed
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Attribute
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
       * comma separated sequence of relationship IDs
       * @default []
       */
      relationshipIds?: string[]
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = void
  }
  /**
   * @description Retrieves a Client Operator relationship
   * @tags clients
   * @name GetClientOperatorRelationshipById
   * @summary Get a Client Operator Relationship
   * @request GET:/clients/{clientId}/relationships/{relationshipId}
   * @secure
   */
  export namespace GetClientOperatorRelationshipById {
    export type RequestParams = {
      /**
       * The Client id
       * @format uuid
       */
      clientId: string
      /**
       * The identifier of the relationship between the security operator and the consumer
       * @format uuid
       */
      relationshipId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Operator
  }
  /**
   * @description Binds a security operator belonging to a consumer to a Client
   * @tags clients
   * @name ClientOperatorRelationshipBinding
   * @summary Binds an Operator relationship to a Client
   * @request POST:/clients/{clientId}/relationships/{relationshipId}
   * @secure
   */
  export namespace ClientOperatorRelationshipBinding {
    export type RequestParams = {
      /**
       * The Client id
       * @format uuid
       */
      clientId: string
      /**
       * The identifier of the relationship between the security operator and the consumer
       * @format uuid
       */
      relationshipId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = CreatedResource
  }
  /**
   * @description Removes an operator relationship from a Client
   * @tags clients
   * @name RemoveClientOperatorRelationship
   * @summary Remove an operator relationship from a Client
   * @request DELETE:/clients/{clientId}/relationships/{relationshipId}
   * @secure
   */
  export namespace RemoveClientOperatorRelationship {
    export type RequestParams = {
      /**
       * The Client id
       * @format uuid
       */
      clientId: string
      /**
       * The identifier of the relationship between the security operator and the consumer
       * @format uuid
       */
      relationshipId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = void
  }
  /**
   * @description List client operators
   * @tags clients
   * @name GetClientOperators
   * @summary List client operators
   * @request GET:/clients/{clientId}/operators
   * @secure
   */
  export namespace GetClientOperators {
    export type RequestParams = {
      /**
       * ID of Client the operators belong to
       * @format uuid
       */
      clientId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = Operators
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
      'X-Forwarded-For'?: string
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
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = EncodedClientKey
  }
  /**
   * @description Given a relationship and a client it returns its corresponding set of keys, if any
   * @tags clients
   * @name GetClientRelationshipKeys
   * @summary Returns a set of keys by relationship ID and client ID.
   * @request GET:/clients/{clientId}/relationships/{relationshipId}/keys
   * @secure
   */
  export namespace GetClientRelationshipKeys {
    export type RequestParams = {
      /**
       * ID of the client holding the key
       * @format uuid
       */
      clientId: string
      /**
       * ID of the Relationship that the added keys MUST belong to
       * @format uuid
       */
      relationshipId: string
    }
    export type RequestQuery = {}
    export type RequestBody = never
    export type RequestHeaders = {
      'X-Correlation-Id': string
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = PublicKeys
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
      'X-Forwarded-For'?: string
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
      'X-Forwarded-For'?: string
    }
    export type ResponseBody = CreatedResource
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
