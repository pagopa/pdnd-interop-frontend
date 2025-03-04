import { queryOptions } from '@tanstack/react-query'
import { TemplateServices } from './template.services'
import {
  GetEServiceTemplatesCatalogParams,
  GetProducerEServices2Params,
} from '../api.generatedTypes'

function getProviderTemplatesList(params: GetProducerEServices2Params) {
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

function getProviderTemplateInstancesList(eServiceTemplateId: string) {
  //TODO aggiungi params
  return queryOptions({
    queryKey: ['EServiceTemplatesGetProviderTemplateInstancesList'],
    queryFn: () => TemplateServices.getProviderTemplateInstancesList(eServiceTemplateId),
  })
}

function getProviderTemplatesCatalogList(params: GetEServiceTemplatesCatalogParams) {
  return queryOptions({
    queryKey: ['EServiceProviderTempaltesCatalogList', params],
    queryFn: () => TemplateServices.getProviderTemplatesCatalogList(params),
  })
}

export const TemplateQueries = {
  getProviderTemplatesList,
  getSingle,
  getProviderTemplateInstancesList,
  getProviderTemplatesCatalogList,
}
