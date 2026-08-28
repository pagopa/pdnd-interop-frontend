import { useTranslation } from 'react-i18next'
import type { NotificationSubSectionSchema } from '../types'
import { type NotificationConfigSchema, type NotificationConfigType } from '../types'
import { match } from 'ts-pattern'
import React from 'react'
import { ConsumerIcon, ProviderIcon, MyTenantIcon } from '@/icons'
import CodeIcon from '@mui/icons-material/Code'
import { AuthHooks } from '@/api/auth'

export function useGetNotificationConfigSchema(type: NotificationConfigType) {
  const { currentRoles } = AuthHooks.useJwt()

  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.configurationPage.sections',
  })

  const createNotificationComponent = (
    key: string,
    titleKey: string,
    descriptionKey: string,
    visibility: NotificationSubSectionSchema['components'][number]['visibility']
  ) => ({
    key,
    title: t(titleKey as never),
    description: t(descriptionKey as never),
    visibility,
  })

  const notificationConfigSchema: NotificationConfigSchema = {
    subscriber: {
      title: t('subscriber.title'),
      icon: ConsumerIcon,
      subsections: [
        {
          name: 'fruizioneDati',
          title: t('subscriber.dataUsage.title'),
          components: [
            createNotificationComponent(
              'eserviceStateChangedToConsumer',
              'subscriber.dataUsage.components.eServiceStateUpdated.label',
              'subscriber.dataUsage.components.eServiceStateUpdated.description',
              ['admin', 'security']
            ),
            createNotificationComponent(
              'agreementActivatedRejectedToConsumer',
              'subscriber.dataUsage.components.agreementManagement.label',
              'subscriber.dataUsage.components.agreementManagement.description',
              ['admin']
            ),
            createNotificationComponent(
              'agreementSuspendedUnsuspendedToConsumer',
              'subscriber.dataUsage.components.agreementStateUpdated.label',
              'subscriber.dataUsage.components.agreementStateUpdated.description',
              ['admin', 'security']
            ),
          ],
        },
        {
          name: 'finalita',
          title: t('subscriber.purpose.title'),
          components: [
            createNotificationComponent(
              'purposeActivatedRejectedToConsumer',
              'subscriber.purpose.components.purposeManagement.label',
              'subscriber.purpose.components.purposeManagement.description',
              ['admin']
            ),
            createNotificationComponent(
              'purposeSuspendedUnsuspendedToConsumer',
              'subscriber.purpose.components.purposeStateUpdated.label',
              'subscriber.purpose.components.purposeStateUpdated.description',
              ['admin', 'security']
            ),
          ],
        },
        {
          name: 'soglieDiCarico',
          title: t('subscriber.thresholds.title'),
          components: [
            createNotificationComponent(
              'purposeQuotaAdjustmentRequestToProducer',
              'subscriber.thresholds.components.purposeQuotaAdjustmentRequestToProducer.label',
              'subscriber.thresholds.components.purposeQuotaAdjustmentRequestToProducer.description',
              ['admin', 'security']
            ),
            createNotificationComponent(
              'purposeOverQuotaStateToConsumer',
              'subscriber.thresholds.components.purposeOverQuotaStateToConsumer.label',
              'subscriber.thresholds.components.purposeOverQuotaStateToConsumer.description',
              ['admin', 'security']
            ),
          ],
        },
      ],
    },
    provider: {
      title: t('provider.title'),
      icon: ProviderIcon,
      subsections: [
        {
          name: 'myEservices',
          title: t('provider.myEservices.title'),
          components: [
            createNotificationComponent(
              'eserviceStateChangedToProducer',
              'provider.myEservices.components.eServiceStateUpdated.label',
              'provider.myEservices.components.eServiceStateUpdated.description',
              ['admin', 'api']
            ),
          ],
        },
        {
          name: 'richiesteFruizione',
          title: t('provider.agreement.title'),
          components: [
            createNotificationComponent(
              'agreementManagementToProducer',
              'provider.agreement.components.agreementRequestReceived.label',
              'provider.agreement.components.agreementRequestReceived.description',
              ['admin']
            ),
            createNotificationComponent(
              'agreementSuspendedUnsuspendedToProducer',
              'provider.agreement.components.agreementStateUpdated.label',
              'provider.agreement.components.agreementStateUpdated.description',
              ['admin']
            ),
          ],
        },
        {
          name: 'finalita',
          title: t('provider.purpose.title'),
          components: [
            createNotificationComponent(
              'purposeStatusChangedToProducer',
              'provider.purpose.components.purposeStateUpdated.label',
              'provider.purpose.components.purposeStateUpdated.description',
              ['admin', 'api']
            ),
          ],
        },
        {
          name: 'clientSoglieDiCarico',
          title: t('provider.clientAndThresholds.title'),
          components: [
            createNotificationComponent(
              'clientAddedRemovedToProducer',
              'provider.clientAndThresholds.components.clientAssociationFromSubscriber.label',
              'provider.clientAndThresholds.components.clientAssociationFromSubscriber.description',
              ['admin', 'api']
            ),
          ],
        },
        {
          name: 'eserviceTemplate',
          title: t('provider.eserviceTemplate.title'),
          components: [
            createNotificationComponent(
              'eserviceTemplateStatusChangedToInstantiator',
              'provider.eserviceTemplate.components.templateStateUpdated.label',
              'provider.eserviceTemplate.components.templateStateUpdated.description',
              ['admin']
            ),
            createNotificationComponent(
              'newEserviceTemplateVersionToInstantiator',
              'provider.eserviceTemplate.components.newTemplateVersion.label',
              'provider.eserviceTemplate.components.newTemplateVersion.description',
              ['admin']
            ),
            createNotificationComponent(
              'eserviceTemplateNameChangedToInstantiator',
              'provider.eserviceTemplate.components.templatePropertiesUpdated.label',
              'provider.eserviceTemplate.components.templatePropertiesUpdated.description',
              ['admin']
            ),
            createNotificationComponent(
              'templateStatusChangedToProducer',
              'provider.eserviceTemplate.components.templateStateArchivedSuspended.label',
              'provider.eserviceTemplate.components.templateStateArchivedSuspended.description',
              ['admin', 'api']
            ),
          ],
        },
      ],
    },
    delegations: {
      title: t('delegation.title'),
      icon: MyTenantIcon,
      subsections: [
        {
          name: 'richiesteFruizione',
          title: t('delegation.delegationAssignment.title'),
          components: [
            createNotificationComponent(
              'delegationApprovedRejectedToDelegator',
              'delegation.delegationAssignment.components.delegationUpdated.label',
              'delegation.delegationAssignment.components.delegationUpdated.description',
              ['admin']
            ),
            createNotificationComponent(
              'eserviceNewVersionSubmittedToDelegator',
              'delegation.delegationAssignment.components.eserviceDelegatedCreated.label',
              'delegation.delegationAssignment.components.eserviceDelegatedCreated.description',
              ['admin']
            ),
            createNotificationComponent(
              'archivingRequestFromDelegate',
              'delegation.delegationAssignment.components.archivingRequestFromDelegate.label',
              'delegation.delegationAssignment.components.archivingRequestFromDelegate.description',
              ['admin']
            ),
          ],
        },
        {
          name: 'delegationReceive',
          title: t('delegation.delegationReceive.title'),
          components: [
            createNotificationComponent(
              'delegationSubmittedRevokedToDelegate',
              'delegation.delegationReceive.components.delegationUpdated.label',
              'delegation.delegationReceive.components.delegationUpdated.description',
              ['admin']
            ),
            createNotificationComponent(
              'eserviceNewVersionApprovedRejectedToDelegate',
              'delegation.delegationReceive.components.eserviceDelegatedApproval.label',
              'delegation.delegationReceive.components.eserviceDelegatedApproval.description',
              ['admin']
            ),
            createNotificationComponent(
              'archivingRequestApprovedRejectedByDelegator',
              'delegation.delegationReceive.components.archivingRequestApprovedRejectedByDelegator.label',
              'delegation.delegationReceive.components.archivingRequestApprovedRejectedByDelegator.description',
              ['admin']
            ),
          ],
        },
      ],
    },
    keyAndAttributes: {
      title: t('keyAndAttributes.title'),
      icon: CodeIcon,
      subsections: [
        {
          name: 'attributes',
          title: t('keyAndAttributes.attributes.title'),
          components: [
            createNotificationComponent(
              'certifiedVerifiedAttributeAssignedRevokedToAssignee',
              'keyAndAttributes.attributes.components.attributesStateUpdated.label',
              'keyAndAttributes.attributes.components.attributesStateUpdated.description',
              ['admin']
            ),
          ],
        },
        {
          name: 'keys',
          title: t('keyAndAttributes.keys.title'),
          components: [
            createNotificationComponent(
              'clientKeyAndProducerKeychainKeyAddedDeletedToClientUsers',
              'keyAndAttributes.keys.components.clientKeysAssociationUpdated.label',
              'keyAndAttributes.keys.components.clientKeysAssociationUpdated.description',
              ['admin', 'security']
            ),
          ],
        },
      ],
    },
  }

  const notificationSchema: NotificationConfigSchema = match(type)
    .with('inApp', () => notificationConfigSchema)
    .with('email', () => notificationConfigSchema)
    .exhaustive()

  const sectionComponentKeysMap = React.useMemo(() => {
    const keyMap: Record<string, string[]> = {}
    Object.keys(notificationSchema).forEach((sectionName) => {
      keyMap[sectionName] = notificationSchema[sectionName].subsections.flatMap(
        (section: NotificationSubSectionSchema) =>
          section.components
            .filter((a) => a.visibility.some((role) => currentRoles.includes(role)))
            .map((c) => c.key)
      )
    })
    return keyMap
  }, [currentRoles, notificationSchema])

  return { notificationSchema, sectionComponentKeysMap }
}
