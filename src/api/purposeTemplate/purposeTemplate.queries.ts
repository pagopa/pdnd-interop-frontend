import { queryOptions } from '@tanstack/react-query'
import { PurposeTemplateServices } from './purposeTemplate.services'
import type { GetConsumerPurposeTemplatesParams } from './mockedResponses'
import type {
  GetCatalogPurposeTemplatesParams,
  GetPurposeTemplateEServicesParams,
} from '../api.generatedTypes'

function getConsumerPurposeTemplatesList(params: GetConsumerPurposeTemplatesParams) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetProviderPurposeTemplatesList', params],
    queryFn: () => PurposeTemplateServices.getConsumerPurposeTemplatesList(params),
  })
}

function getEservicesLinkedToPurposeTemplatesList(params: GetPurposeTemplateEServicesParams) {
  return queryOptions({
    queryKey: [
      'PurposeTemplateGetEservicesLinkedToPurposeTemplatesList',
      params.purposeTemplateId,
      params,
    ],
    queryFn: () =>
      PurposeTemplateServices.getEservicesLinkedToPurposeTemplatesList(
        params.purposeTemplateId,
        params
      ),
  })
}

function getSingle(purposeTemplateId: string) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetSingle'],
    queryFn: () => PurposeTemplateServices.getSingle(purposeTemplateId),
  })
}

function getCatalogPurposeTemplates(params: GetCatalogPurposeTemplatesParams) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetCatalogPurposeTemplates', params],
    queryFn: () => PurposeTemplateServices.getCatalogPurposeTemplates(params),
  })
}

function getAnswerDocuments(purposeTemplateId: string, answerId: string) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetAnswerDocuments', purposeTemplateId, answerId],
    queryFn: () => PurposeTemplateServices.getAnswerDocuments(purposeTemplateId, answerId),
  })
}

export const PurposeTemplateQueries = {
  getConsumerPurposeTemplatesList,
  getEservicesLinkedToPurposeTemplatesList,
  getSingle,
  getCatalogPurposeTemplates,
  getAnswerDocuments,
}
