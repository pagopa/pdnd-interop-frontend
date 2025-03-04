import { queryOptions } from '@tanstack/react-query'
import type {
  GetAgreementConsumersParams,
  GetAgreementEServiceConsumersParams,
  GetAgreementEServiceProducersParams,
  GetAgreementProducersParams,
  GetConsumerAgreementsParams,
  GetProducerAgreementsParams,
} from '../api.generatedTypes'
import { AgreementServices } from './agreement.services'

function getProducerAgreementsList(params: GetProducerAgreementsParams) {
  return queryOptions({
    queryKey: ['AgreementGetProducerAgreementsList', params],
    queryFn: () => AgreementServices.getProducerAgreementsList(params),
  })
}

function getConsumerAgreementsList(params: GetConsumerAgreementsParams) {
  return queryOptions({
    queryKey: ['AgreementGetConsumerAgreementsList', params],
    queryFn: () => AgreementServices.getConsumerAgreementsList(params),
  })
}

function getSingle(agreementId: string) {
  return queryOptions({
    queryKey: ['AgreementGetSingle', agreementId],
    queryFn: () => AgreementServices.getSingle(agreementId),
  })
}

function getProducers(params: GetAgreementProducersParams) {
  return queryOptions({
    queryKey: ['AgreementGetProducers', params],
    queryFn: () => AgreementServices.getProducers(params),
  })
}

function getConsumers(params: GetAgreementConsumersParams) {
  return queryOptions({
    queryKey: ['AgreementGetConsumers', params],
    queryFn: () => AgreementServices.getConsumers(params),
  })
}

function getProducerEServiceList(params: GetAgreementEServiceProducersParams) {
  return queryOptions({
    queryKey: ['AgreementGetProducerEServiceList', params],
    queryFn: () => AgreementServices.getProducerEServiceList(params),
  })
}

function getConsumerEServiceList(params: GetAgreementEServiceConsumersParams) {
  return queryOptions({
    queryKey: ['AgreementGetConsumerEServiceList', params],
    queryFn: () => AgreementServices.getConsumerEServiceList(params),
  })
}

export const AgreementQueries = {
  getProducerAgreementsList,
  getConsumerAgreementsList,
  getSingle,
  getProducers,
  getConsumers,
  getProducerEServiceList,
  getConsumerEServiceList,
}
