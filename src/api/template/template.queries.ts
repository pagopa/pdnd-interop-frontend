import { queryOptions } from '@tanstack/react-query'
import { TemplateServices } from './template.services'
import type {
  GetEServiceTemplateCreatorsParams,
  GetEServiceTemplateInstancesParams,
  GetEServiceTemplatesCatalogParams,
  GetProducerEServicesParams,
} from '../api.generatedTypes'

function getProviderTemplatesList(params: GetProducerEServicesParams) {
  return queryOptions({
    queryKey: ['EServiceTemplatesGetProviderList'],
    queryFn: () => TemplateServices.getProviderTemplatesList(params),
  })
}

function getSingle(eServiceTemplateId: string, eServiceTemplateVersionId: string) {
  return queryOptions({
    queryKey: ['EServiceTemplateGetSingle', eServiceTemplateId, eServiceTemplateVersionId],
    queryFn: () => TemplateServices.getSingle(eServiceTemplateId, eServiceTemplateVersionId),
  })
}

function getSingleByEServiceTemplateId(eserviceTemplateId: string) {
  return queryOptions({
    queryKey: ['EServiceTemplateGetSingleByEServiceTemplateId', eserviceTemplateId],
    queryFn: () => TemplateServices.getSingleByEServiceTemplateId(eserviceTemplateId),
  })
}

function getProviderTemplateInstancesList(params: GetEServiceTemplateInstancesParams) {
  //TODO aggiungi params
  return queryOptions({
    queryKey: ['EServiceTemplatesGetProviderTemplateInstancesList'],
    queryFn: () => TemplateServices.getProviderTemplateInstancesList(params),
  })
}

function getProviderTemplatesCatalogList(params: GetEServiceTemplatesCatalogParams) {
  return queryOptions({
    queryKey: ['EServiceProviderTempaltesCatalogList', params],
    queryFn: () => TemplateServices.getProviderTemplatesCatalogList(params),
  })
}

function getProducersTemplateEserviceList(params: GetEServiceTemplateCreatorsParams) {
  return queryOptions({
    queryKey: ['TemplateEserviceGetProducers', params],
    queryFn: () => TemplateServices.getProducersTemplateEserviceList(params),
  })
}

export const TemplateQueries = {
  getProviderTemplatesList,
  getProviderTemplatesCatalogList,
  getSingle,
  getProducersTemplateEserviceList,
  getProviderTemplateInstancesList,
  getSingleByEServiceTemplateId,
}
