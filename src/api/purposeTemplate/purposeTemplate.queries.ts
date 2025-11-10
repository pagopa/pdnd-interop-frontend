import { queryOptions } from '@tanstack/react-query'
import { PurposeTemplateServices } from './purposeTemplate.services'
import type {
  GetCatalogPurposeTemplatesParams,
  GetCreatorPurposeTemplatesParams,
  GetPurposeTemplateEServicesParams,
} from '../api.generatedTypes'

function getConsumerPurposeTemplatesList(params: GetCreatorPurposeTemplatesParams) {
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

function getPublishedPurposeTemplateCreators(params: {
  q?: string
  offset: number
  limit: number
}) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetPublishedPurposeTemplateCreators', params],
    queryFn: () => PurposeTemplateServices.getPublishedPurposeTemplateCreators(params),
  })
}

export const PurposeTemplateQueries = {
  getConsumerPurposeTemplatesList,
  getEservicesLinkedToPurposeTemplatesList,
  getSingle,
  getCatalogPurposeTemplates,
  getAnswerDocuments,
  getPublishedPurposeTemplateCreators,
}
