import { useTranslation } from 'react-i18next'
import type { NotificationSubSectionComponentSchema, NotificationSubSectionSchema } from '../types'
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
    title: string,
    description: string,
    visibility: NotificationSubSectionComponentSchema['visibility']
  ): NotificationSubSectionComponentSchema => ({
    key,
    title,
    description,
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
              t('subscriber.dataUsage.components.eServiceStateUpdated.label'),
              t('subscriber.dataUsage.components.eServiceStateUpdated.description'),
              ['admin', 'security']
            ),
            createNotificationComponent(
              'agreementActivatedRejectedToConsumer',
              t('subscriber.dataUsage.components.agreementManagement.label'),
              t('subscriber.dataUsage.components.agreementManagement.description'),
              ['admin']
            ),
            createNotificationComponent(
              'agreementSuspendedUnsuspendedToConsumer',
              t('subscriber.dataUsage.components.agreementStateUpdated.label'),
              t('subscriber.dataUsage.components.agreementStateUpdated.description'),
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
              t('subscriber.purpose.components.purposeManagement.label'),
              t('subscriber.purpose.components.purposeManagement.description'),
              ['admin']
            ),
            createNotificationComponent(
              'purposeSuspendedUnsuspendedToConsumer',
              t('subscriber.purpose.components.purposeStateUpdated.label'),
              t('subscriber.purpose.components.purposeStateUpdated.description'),
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
              t('subscriber.thresholds.components.purposeQuotaAdjustmentRequestToProducer.label'),
              t(
                'subscriber.thresholds.components.purposeQuotaAdjustmentRequestToProducer.description'
              ),
              ['admin', 'security']
            ),
            createNotificationComponent(
              'purposeOverQuotaStateToConsumer',
              t('subscriber.thresholds.components.purposeOverQuotaStateToConsumer.label'),
              t('subscriber.thresholds.components.purposeOverQuotaStateToConsumer.description'),
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
              t('provider.myEservices.components.eServiceStateUpdated.label'),
              t('provider.myEservices.components.eServiceStateUpdated.description'),
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
              t('provider.agreement.components.agreementRequestReceived.label'),
              t('provider.agreement.components.agreementRequestReceived.description'),
              ['admin']
            ),
            createNotificationComponent(
              'agreementSuspendedUnsuspendedToProducer',
              t('provider.agreement.components.agreementStateUpdated.label'),
              t('provider.agreement.components.agreementStateUpdated.description'),
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
              t('provider.purpose.components.purposeStateUpdated.label'),
              t('provider.purpose.components.purposeStateUpdated.description'),
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
              t('provider.clientAndThresholds.components.clientAssociationFromSubscriber.label'),
              t(
                'provider.clientAndThresholds.components.clientAssociationFromSubscriber.description'
              ),
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
              t('provider.eserviceTemplate.components.templateStateUpdated.label'),
              t('provider.eserviceTemplate.components.templateStateUpdated.description'),
              ['admin']
            ),
            createNotificationComponent(
              'newEserviceTemplateVersionToInstantiator',
              t('provider.eserviceTemplate.components.newTemplateVersion.label'),
              t('provider.eserviceTemplate.components.newTemplateVersion.description'),
              ['admin']
            ),
            createNotificationComponent(
              'eserviceTemplateNameChangedToInstantiator',
              t('provider.eserviceTemplate.components.templatePropertiesUpdated.label'),
              t('provider.eserviceTemplate.components.templatePropertiesUpdated.description'),
              ['admin']
            ),
            createNotificationComponent(
              'templateStatusChangedToProducer',
              t('provider.eserviceTemplate.components.templateStateArchivedSuspended.label'),
              t('provider.eserviceTemplate.components.templateStateArchivedSuspended.description'),
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
              t('delegation.delegationAssignment.components.delegationUpdated.label'),
              t('delegation.delegationAssignment.components.delegationUpdated.description'),
              ['admin']
            ),
            createNotificationComponent(
              'eserviceNewVersionSubmittedToDelegator',
              t('delegation.delegationAssignment.components.eserviceDelegatedCreated.label'),
              t('delegation.delegationAssignment.components.eserviceDelegatedCreated.description'),
              ['admin']
            ),
            createNotificationComponent(
              'archivingRequestFromDelegate',
              t('delegation.delegationAssignment.components.archivingRequestFromDelegate.label'),
              t(
                'delegation.delegationAssignment.components.archivingRequestFromDelegate.description'
              ),
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
              t('delegation.delegationReceive.components.delegationUpdated.label'),
              t('delegation.delegationReceive.components.delegationUpdated.description'),
              ['admin']
            ),
            createNotificationComponent(
              'eserviceNewVersionApprovedRejectedToDelegate',
              t('delegation.delegationReceive.components.eserviceDelegatedApproval.label'),
              t('delegation.delegationReceive.components.eserviceDelegatedApproval.description'),
              ['admin']
            ),
            createNotificationComponent(
              'archivingRequestApprovedRejectedByDelegator',
              t(
                'delegation.delegationReceive.components.archivingRequestApprovedRejectedByDelegator.label'
              ),
              t(
                'delegation.delegationReceive.components.archivingRequestApprovedRejectedByDelegator.description'
              ),
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
              t('keyAndAttributes.attributes.components.attributesStateUpdated.label'),
              t('keyAndAttributes.attributes.components.attributesStateUpdated.description'),
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
              t('keyAndAttributes.keys.components.clientKeysAssociationUpdated.label'),
              t('keyAndAttributes.keys.components.clientKeysAssociationUpdated.description'),
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
