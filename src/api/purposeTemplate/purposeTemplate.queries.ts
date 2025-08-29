import { queryOptions } from '@tanstack/react-query'
import { PurposeTemplateServices } from './purposeTemplate.services'

function getConsumerPurposeTemplatesList(/*params: GetProducerPurposesParams*/) {
  return queryOptions({
    queryKey: ['PurposeTemplateGetProviderPurposeTemplatesList' /*, params*/],
    queryFn: () => PurposeTemplateServices.getConsumerPurposeTemplatesList(/*params*/),
  })
}

function getEservicesLinkedToPurposeTemplatesList() {
  return queryOptions({
    queryKey: ['PurposeTemplateGetEservicesLinkedToPurposeTemplatesList'],
    queryFn: () => PurposeTemplateServices.getEservicesLinkedToPurposeTemplatesList(),
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

export const PurposeTemplateQueries = {
  getConsumerPurposeTemplatesList,
  getEservicesLinkedToPurposeTemplatesList,
  getPurposeTemplateEservices,
  getSingle,
}
