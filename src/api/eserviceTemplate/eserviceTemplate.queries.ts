import { queryOptions } from '@tanstack/react-query'
import { EServiceTemplateServices } from './eserviceTemplate.services'
import type {
  GetEServiceTemplateCreatorsParams,
  GetEServiceTemplateInstancesParams,
  GetEServiceTemplatesCatalogParams,
  GetProducerEServicesParams,
} from '../api.generatedTypes'

function getProviderEServiceTemplatesList(params: GetProducerEServicesParams) {
  return queryOptions({
    queryKey: ['EServiceTemplatesGetProviderList', params],
    queryFn: () => EServiceTemplateServices.getProviderEServiceTemplatesList(params),
  })
}

function getSingle(eServiceTemplateId: string, eServiceTemplateVersionId: string) {
  return queryOptions({
    queryKey: ['EServiceTemplateGetSingle', eServiceTemplateId, eServiceTemplateVersionId],
    queryFn: () =>
      EServiceTemplateServices.getSingle(eServiceTemplateId, eServiceTemplateVersionId),
  })
}

function getSingleByEServiceTemplateId(eserviceTemplateId: string) {
  return queryOptions({
    queryKey: ['EServiceTemplateGetSingleByEServiceTemplateId', eserviceTemplateId],
    queryFn: () => EServiceTemplateServices.getSingleByEServiceTemplateId(eserviceTemplateId),
  })
}

function getProviderEServiceTemplateInstancesList({
  eserviceTemplateId,
  ...params
}: GetEServiceTemplateInstancesParams & { eserviceTemplateId: string }) {
  return queryOptions({
    queryKey: [
      'EServiceTemplatesGetProviderTemplateInstancesList',
      {
        eserviceTemplateId,
        ...params,
      },
    ],
    queryFn: () =>
      EServiceTemplateServices.getProviderEServiceTemplateInstancesList({
        eServiceTemplateId: eserviceTemplateId,
        ...params,
      }),
  })
}

function getMyEServiceTemplateInstancesList({
  eserviceTemplateId,
  ...params
}: {
  eserviceTemplateId: string
  offset: number
  limit: number
}) {
  return queryOptions({
    queryKey: [
      'EServiceTemplatesGetMyTemplateInstancesList',
      {
        eserviceTemplateId,
        ...params,
      },
    ],
    queryFn: () =>
      EServiceTemplateServices.getMyEServiceTemplateInstancesList({
        eServiceTemplateId: eserviceTemplateId,
        ...params,
      }),
  })
}

function getProviderEServiceTemplatesCatalogList(params: GetEServiceTemplatesCatalogParams) {
  return queryOptions({
    queryKey: ['EServiceProviderTempaltesCatalogList', params],
    queryFn: () => EServiceTemplateServices.getProviderEServiceTemplatesCatalogList(params),
  })
}

function getProducersEServiceTemplateList(params: GetEServiceTemplateCreatorsParams) {
  return queryOptions({
    queryKey: ['TemplateEserviceGetProducers', params],
    queryFn: () => EServiceTemplateServices.getProducersEServiceTemplateList(params),
  })
}

export const EServiceTemplateQueries = {
  getProviderEServiceTemplatesList,
  getProviderEServiceTemplatesCatalogList,
  getSingle,
  getProducersEServiceTemplateList,
  getProviderEServiceTemplateInstancesList,
  getMyEServiceTemplateInstancesList,
  getSingleByEServiceTemplateId,
}
