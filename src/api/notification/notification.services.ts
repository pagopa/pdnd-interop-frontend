import axiosInstance from '@/config/axios'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import type {
  NotificationConfig,
  TenantNotificationConfig,
  TenantNotificationConfigUpdateSeed,
  UserNotificationConfig,
  UserNotificationConfigUpdateSeed,
} from '../api.generatedTypes'

async function updateUserNotificationConfigs(payload: UserNotificationConfigUpdateSeed) {
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/userNotificationConfigs`,
    payload
  )
}

async function updateTenantNotificationConfigs(payload: TenantNotificationConfigUpdateSeed) {
  console.log('payload', payload)
  return await axiosInstance.post<void>(
    `${BACKEND_FOR_FRONTEND_URL}/tenantNotificationConfigs`,
    payload
  )
}

async function getUserNotificationConfigs() {
  const response = await axiosInstance.get<UserNotificationConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/userNotificationConfigs`
  )
  return response.data
}
async function getTenantNotificationConfigs() {
  const response = await axiosInstance.get<TenantNotificationConfig>(
    `${BACKEND_FOR_FRONTEND_URL}/tenantNotificationConfigs`
  )
  return response.data
}
export const NotificationServices = {
  updateUserNotificationConfigs,
  updateTenantNotificationConfigs,
  getUserNotificationConfigs,
  getTenantNotificationConfigs,
}

// DELETE THIS
// agreementSuspendedUnsuspendedToProducer: randomValue, // 04
// agreementManagementToProducer: randomValue, // 03
// clientAddedRemovedToProducer: randomValue, // 05
// purposeStatusChangedToProducer: randomValue, // 07
// templateStatusChangedToProducer: randomValue, //09
// agreementSuspendedUnsuspendedToConsumer: randomValue, // 13
// eserviceStateChangedToConsumer: randomValue, // 11
// agreementActivatedRejectedToConsumer: randomValue, // 12
// purposeActivatedRejectedToConsumer: randomValue, // 15
// purposeSuspendedUnsuspendedToConsumer: randomValue, // 16
// newEserviceTemplateVersionToInstantiator: randomValue, // 17
// eserviceTemplateNameChangedToInstantiator: randomValue, //18
// eserviceTemplateStatusChangedToInstantiator: randomValue, // 19
// delegationApprovedRejectedToDelegator: randomValue, // 20
// eserviceNewVersionSubmittedToDelegator: randomValue, // 21
// eserviceNewVersionApprovedRejectedToDelegate: randomValue, // 22
// delegationSubmittedRevokedToDelegate: randomValue, // 23
// certifiedVerifiedAttributeAssignedRevokedToAssignee: randomValue, // 24
// clientKeyAddedDeletedToClientUsers: randomValue, // 25
