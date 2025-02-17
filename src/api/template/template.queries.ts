import { queryOptions } from '@tanstack/react-query'
import { TemplateServices } from './template.services'

function getProviderTemplatesList() {
  //TODO aggiungi params
  return queryOptions({
    queryKey: ['EServiceTemplatesGetProviderList'],
    queryFn: () => TemplateServices.getProviderTemplatesList(),
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

export const TemplateQueries = {
  getProviderTemplatesList,
  getSingle,
  getProviderTemplateInstancesList,
}
