import { queryOptions } from '@tanstack/react-query'
import { PurposeServices } from './purpose.services'
import type {
  GetConsumerPurposesParams,
  GetProducerPurposesParams,
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

function getRiskAnalysisLatest() {
  return queryOptions({
    queryKey: ['GetRiskAnalysisLatest'],
    queryFn: () => PurposeServices.getRiskAnalysisLatest(),
  })
}

function getRiskAnalysisVersion(params: RetrieveRiskAnalysisConfigurationByVersionParams) {
  return queryOptions({
    queryKey: ['GetRiskAnalysisVersion', params],
    queryFn: () => PurposeServices.getRiskAnalysisVersion(params),
  })
}

export const PurposeQueries = {
  getProducersList,
  getConsumersList,
  getSingle,
  getRiskAnalysisLatest,
  getRiskAnalysisVersion,
}
