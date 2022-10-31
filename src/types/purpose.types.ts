import { AgreementSummary } from './agreement.types'
import { Client } from './client.types'
import { EServiceDescriptorRead, EServiceReadType } from './eservice.types'

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
