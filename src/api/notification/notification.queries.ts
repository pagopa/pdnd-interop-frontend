import { queryOptions } from '@tanstack/react-query'
import { NotificationServices } from './notification.services'
import { AgreementServices } from '../agreement'
import { GetAgreementsProducersParams } from '../api.generatedTypes'

function getUserNotificationConfiguration() {
  return queryOptions({
    queryKey: ['getUserNotificationConfiguration'],
    queryFn: () => NotificationServices.getUserNotificationConfiguration(),
  })
}

export const NotificationQueries = {
  getUserNotificationConfiguration,
}
