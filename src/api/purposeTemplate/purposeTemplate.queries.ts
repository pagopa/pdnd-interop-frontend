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

function getEservicesLinkedToPurposeTemplatesList(
  purposeTemplateId: string,
  params: Omit<GetPurposeTemplateEServicesParams, 'purposeTemplateId'>
) {
  return queryOptions({
    queryKey: [
      'PurposeTemplateGetEservicesLinkedToPurposeTemplatesList',
      purposeTemplateId,
      params,
    ],
    queryFn: () =>
      PurposeTemplateServices.getEservicesLinkedToPurposeTemplatesList(purposeTemplateId, params),
  })
}

function getPurposeTemplateEservices(id: string) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetPurposeTemplateEservices'],
    queryFn: () => PurposeTemplateServices.getPurposeTemplateEservices(id),
  })
}

function getSingle(id: string) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetSingle'],
    queryFn: () => PurposeTemplateServices.getSingle(id),
  })
}

function getCatalogPurposeTemplates(params: GetCatalogPurposeTemplatesParams) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetCatalogPurposeTemplates'],
    queryFn: () => PurposeTemplateServices.getConsumerCatalogPurposeTemplates(params),
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
  getPurposeTemplateEservices,
  getSingle,
  getCatalogPurposeTemplates,
  getAnswerDocuments,
}
