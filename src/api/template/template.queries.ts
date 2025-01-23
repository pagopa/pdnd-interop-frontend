import { queryOptions } from '@tanstack/react-query'
import { TemplateServices } from './template.services'

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

export const TemplateQueries = {
  getProviderTemplatesList,
  getSingle,
}
