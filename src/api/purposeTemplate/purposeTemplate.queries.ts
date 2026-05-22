import { queryOptions } from '@tanstack/react-query'
import { PurposeTemplateServices } from './purposeTemplate.services'
import { NotFoundError } from '@/utils/errors.utils'
import type {
  GetCatalogPurposeTemplatesParams,
  GetCreatorPurposeTemplatesParams,
  GetLinkableResourcesParams,
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

function getLinkableResources(
  purposeTemplateId: string,
  params: Omit<GetLinkableResourcesParams, 'purposeTemplateId'>
) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetLinkableResources', purposeTemplateId, params],
    queryFn: () => PurposeTemplateServices.getLinkableResources(purposeTemplateId, params),
    throwOnError: (error) => {
      // The BE returns 404 when any linked resource (e-service, descriptor, template, version, tenant)
      // referenced by the purpose template no longer exists. The purpose template's own existence
      // is guaranteed by the parent page's `getSingle` query, so a 404 here means orphan link.
      // Let consumers render a dedicated message instead of redirecting to NOT_FOUND.
      return !(error instanceof NotFoundError)
    },
  })
}

function getSingle(purposeTemplateId: string) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetSingle', purposeTemplateId],
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
  getLinkableResources,
  getSingle,
  getCatalogPurposeTemplates,
  getAnswerDocuments,
  getPublishedPurposeTemplateCreators,
}
