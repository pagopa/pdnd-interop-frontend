import { queryOptions } from '@tanstack/react-query'
import { EServiceServices } from './eservice.services'
import type {
  GetConsumersParams,
  GetEServicesCatalogParams,
  GetProducerEServicesParams,
  GetProducersParams,
} from '../api.generatedTypes'

function getCatalogList(params: GetEServicesCatalogParams) {
  return queryOptions({
    queryKey: ['EServiceGetCatalogList', params],
    queryFn: () => EServiceServices.getCatalogList(params),
  })
}

function getProviderList(params: GetProducerEServicesParams) {
  return queryOptions({
    queryKey: ['EServiceGetProviderList', params],
    queryFn: () => EServiceServices.getProviderList(params),
  })
}

function getConsumers(params: GetConsumersParams) {
  return queryOptions({
    queryKey: ['EServiceGetConsumers', params],
    queryFn: () => EServiceServices.getConsumers(params),
  })
}

function getProducers(params: GetProducersParams) {
  return queryOptions({
    queryKey: ['EServiceGetProducers', params],
    queryFn: () => EServiceServices.getProducers(params),
  })
}

function getSingle(eserviceId: string) {
  return queryOptions({
    queryKey: ['EServiceGetSingle', eserviceId],
    queryFn: () => EServiceServices.getSingle(eserviceId),
  })
}

function getDescriptorCatalog(eserviceId: string, descriptorId: string) {
  return queryOptions({
    queryKey: ['EServiceGetDescriptorCatalog', eserviceId, descriptorId],
    queryFn: () => EServiceServices.getDescriptorCatalog(eserviceId, descriptorId),
  })
}

function getDescriptorProvider(eserviceId: string, descriptorId: string) {
  return queryOptions({
    queryKey: ['EServiceGetDescriptorProvider', eserviceId, descriptorId],
    queryFn: () => EServiceServices.getDescriptorProvider(eserviceId, descriptorId),
  })
}

function getEServiceRiskAnalysis(eserviceId: string, riskAnalysisId: string) {
  return queryOptions({
    queryKey: ['EServiceGetRiskAnalysis', eserviceId, riskAnalysisId],
    queryFn: () =>
      EServiceServices.getEServiceRiskAnalysis({
        eserviceId,
        riskAnalysisId,
      }),
  })
}

export const EServiceQueries = {
  getCatalogList,
  getProviderList,
  getDescriptorCatalog,
  getDescriptorProvider,
  getSingle,
  getConsumers,
  getProducers,
  getEServiceRiskAnalysis,
}
