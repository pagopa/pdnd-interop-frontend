import { queryOptions } from '@tanstack/react-query'
import type { RiskAnlysisVersionConfig } from './purpose.services'
import { PurposeServices } from './purpose.services'
import type {
  GetConsumerPurposesParams,
  GetProducerPurposesParams,
  RetrieveLatestRiskAnalysisConfigurationParams,
  RetrieveRiskAnalysisConfigurationByVersionParams,
} from '../api.generatedTypes'

function getProducersList(params: GetProducerPurposesParams) {
  return queryOptions({
    queryKey: ['PurposeGetProducersList', params],
    queryFn: () => PurposeServices.getProducersList(params),
  })
}

function getConsumersList(params: GetConsumerPurposesParams) {
  return queryOptions({
    queryKey: ['PurposeGetConsumersList', params],
    queryFn: () => PurposeServices.getConsumersList(params),
  })
}

function getSingle(purposeId: string) {
  return queryOptions({
    queryKey: ['PurposeGetSingle', purposeId],
    queryFn: () => PurposeServices.getSingle(purposeId),
  })
}

function getRiskAnalysisLatest(params?: RetrieveLatestRiskAnalysisConfigurationParams) {
  return queryOptions({
    queryKey: ['GetRiskAnalysisLatest', params?.tenantKind],
    queryFn: () => PurposeServices.getRiskAnalysisLatest(params),
  })
}

function getRiskAnalysisVersion(params: RetrieveRiskAnalysisConfigurationByVersionParams) {
  return queryOptions({
    queryKey: ['GetRiskAnalysisVersion', params],
    queryFn: () => PurposeServices.getRiskAnalysisVersion(params),
  })
}

function getRiskAnalyisLatestOrSpecificVersion(params: RiskAnlysisVersionConfig) {
  return queryOptions({
    queryKey: ['GetRiskAnalysisLatestOrSpecificVersion', params],
    queryFn: () => PurposeServices.getRiskAnalyisLatestOrSpecificVersion(params),
  })
}

export const PurposeQueries = {
  getProducersList,
  getConsumersList,
  getSingle,
  getRiskAnalysisLatest,
  getRiskAnalysisVersion,
  getRiskAnalyisLatestOrSpecificVersion,
}
