import { queryOptions } from '@tanstack/react-query'
import { TemplateServices } from './template.services'
import type {
  GetEServiceTemplateCreatorsParams,
  GetEServiceTemplatesCatalogParams,
} from '../api.generatedTypes'

function getProviderTemplatesList() {
  //TODO aggiungi params
  return queryOptions({
    queryKey: ['EServiceTemplatesGetProviderList'],
    queryFn: () => TemplateServices.getProviderTemplatesList(),
  })
}

function getSingle(eserviceTemplateId: string) {
  return queryOptions({
    queryKey: ['EServiceTemplateGetSingle', eserviceTemplateId],
    queryFn: () => TemplateServices.getSingle(eserviceTemplateId),
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
}
