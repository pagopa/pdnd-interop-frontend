import { useTranslation } from 'react-i18next'
import type { NotificationSubSectionSchema } from '../types'
import { type NotificationConfigSchema, type NotificationConfigType } from '../types'
import { match } from 'ts-pattern'
import React from 'react'
import { ConsumerIcon, ProviderIcon, MyTenantIcon } from '@/icons'
import CodeIcon from '@mui/icons-material/Code'

export function useGetNotificationConfigSchema(type: NotificationConfigType) {
  const { t } = useTranslation('notification', {
    keyPrefix: 'notifications.configurationPage.sections',
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
            {
              key: 'eserviceStateChangedToConsumer',
              title: t('subscriber.dataUsage.components.eServiceStateUpdated.label'), // 11
              description: t('subscriber.dataUsage.components.eServiceStateUpdated.description'),
              visibility: ['admin', 'security'],
            },
            {
              key: 'agreementActivatedRejectedToConsumer',
              title: t('subscriber.dataUsage.components.agreementManagement.label'), // 12
              description: t('subscriber.dataUsage.components.agreementManagement.description'),
              visibility: ['admin'],
            },
            {
              key: 'agreementSuspendedUnsuspendedToConsumer',
              title: t('subscriber.dataUsage.components.agreementStateUpdated.label'), // 13
              description: t('subscriber.dataUsage.components.agreementStateUpdated.description'),
              visibility: ['admin', 'security'],
            },
            // {
            //   key: 'purposeQuotaAdjustmentRequestToProducer',
            //   title: t(
            //     'subscriber.purpose.components.purposeQuotaAdjustmentRequestToProducer.label'
            //   ),
            //   description: t(
            //     'subscriber.purpose.components.purposeQuotaAdjustmentRequestToProducer.description'
            //   ),
            //   visibility: ['admin', 'security'],
            // },
            // {
            //   key: 'purposeOverQuotaStateToConsumer',
            //   title: t('subscriber.purpose.components.purposeOverQuotaStateToConsumer.label'),
            //   description: t(
            //     'subscriber.purpose.components.purposeOverQuotaStateToConsumer.description'
            //   ),
            //   visibility: ['admin', 'security'],
            // },
          ],
        },
        {
          name: 'finalita',
          title: t('subscriber.purpose.title'),
          components: [
            {
              key: 'purposeActivatedRejectedToConsumer',
              title: t('subscriber.purpose.components.purposeManagement.label'), // 15
              description: t('subscriber.purpose.components.purposeManagement.description'),
              visibility: ['admin'],
            },
            {
              key: 'purposeSuspendedUnsuspendedToConsumer',
              title: t('subscriber.purpose.components.purposeStateUpdated.label'), // 16
              description: t('subscriber.purpose.components.purposeStateUpdated.description'),
              visibility: ['admin', 'security'],
            },
          ],
        },
        {
          name: 'soglieDiCarico',
          title: t('subscriber.thresholds.title'),
          components: [
            {
              key: 'purposeOverQuotaStateToConsumer',
              title: t('subscriber.thresholds.components.purposeOverQuotaStateToConsumer.label'),
              description: t(
                'subscriber.thresholds.components.purposeOverQuotaStateToConsumer.description'
              ),
              visibility: ['admin', 'security'],
            },
            {
              key: 'purposeQuotaAdjustmentRequestToProducer',
              title: t(
                'subscriber.thresholds.components.purposeQuotaAdjustmentRequestToProducer.label'
              ),
              description: t(
                'subscriber.thresholds.components.purposeQuotaAdjustmentRequestToProducer.description'
              ),
              visibility: ['admin', 'security'],
            },
          ],
        },
      ],
    },
    provider: {
      title: t('provider.title'),
      icon: ProviderIcon,
      subsections: [
        {
          name: 'richiesteFruizione',
          title: t('provider.agreement.title'),
          components: [
            {
              key: 'agreementManagementToProducer',
              title: t('provider.agreement.components.agreementRequestReceived.label'), // 03
              description: t('provider.agreement.components.agreementRequestReceived.description'),
              visibility: ['admin'],
            },
            {
              key: 'agreementSuspendedUnsuspendedToProducer',
              title: t('provider.agreement.components.agreementStateUpdated.label'), // 04
              description: t('provider.agreement.components.agreementStateUpdated.description'),
              visibility: ['admin'],
            },
          ],
        },
        {
          name: 'finalita',
          title: t('provider.purpose.title'),
          components: [
            {
              key: 'purposeStatusChangedToProducer',
              title: t('provider.purpose.components.purposeStateUpdated.label'), // 07
              description: t('provider.purpose.components.purposeStateUpdated.description'),
              visibility: ['admin', 'api'],
            },
          ],
        },
        {
          name: 'clientSoglieDiCarico',
          title: t('provider.clientAndThresholds.title'),
          components: [
            {
              key: 'clientAddedRemovedToProducer',
              title: t(
                'provider.clientAndThresholds.components.clientAssociationFromSubscriber.label'
              ), // 05
              description: t(
                'provider.clientAndThresholds.components.clientAssociationFromSubscriber.description'
              ),
              visibility: ['admin', 'api'],
            },
          ],
        },
        {
          name: 'eserviceTemplate',
          title: t('provider.eserviceTemplate.title'),
          components: [
            {
              key: 'eserviceTemplateStatusChangedToInstantiator',
              title: t('provider.eserviceTemplate.components.templateStateUpdated.label'), // 19
              description: t(
                'provider.eserviceTemplate.components.templateStateUpdated.description'
              ),
              visibility: ['admin', 'security'],
            },
            {
              key: 'newEserviceTemplateVersionToInstantiator',
              title: t('provider.eserviceTemplate.components.newTemplateVersion.label'), // 17'
              description: t('provider.eserviceTemplate.components.newTemplateVersion.description'),
              visibility: ['admin', 'security'], // To define
            },
            {
              key: 'eserviceTemplateNameChangedToInstantiator',
              title: t('provider.eserviceTemplate.components.templatePropertiesUpdated.label'), // 18
              description: t(
                'provider.eserviceTemplate.components.templatePropertiesUpdated.description'
              ),
              visibility: ['admin', 'security'],
            },
            {
              key: 'templateStatusChangedToProducer',
              title: t('provider.eserviceTemplate.components.templateStateArchivedSuspended.label'), // 09
              description: t(
                'provider.eserviceTemplate.components.templateStateArchivedSuspended.description'
              ),
              visibility: ['admin', 'api'],
            },
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
            {
              key: 'delegationApprovedRejectedToDelegator',
              title: t('delegation.delegationAssignment.components.delegationUpdated.label'), // 20
              description: t(
                'delegation.delegationAssignment.components.delegationUpdated.description'
              ),
              visibility: ['admin'],
            },
            {
              key: 'eserviceNewVersionSubmittedToDelegator',
              title: t('delegation.delegationAssignment.components.eserviceDelegatedCreated.label'), // 21

              description: t(
                'delegation.delegationAssignment.components.eserviceDelegatedCreated.description'
              ),
              visibility: ['admin'],
            },
          ],
        },
        {
          name: 'delegationReceive',
          title: t('delegation.delegationReceive.title'),
          components: [
            {
              key: 'delegationSubmittedRevokedToDelegate',
              title: t('delegation.delegationReceive.components.delegationUpdated.label'), // 23
              description: t(
                'delegation.delegationReceive.components.delegationUpdated.description'
              ),
              visibility: ['admin'],
            },
            {
              key: 'eserviceNewVersionApprovedRejectedToDelegate',
              title: t('delegation.delegationReceive.components.eserviceDelegatedApproval.label'), // 22
              description: t(
                'delegation.delegationReceive.components.eserviceDelegatedApproval.description'
              ),
              visibility: ['admin', 'api'],
            },
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
            {
              key: 'certifiedVerifiedAttributeAssignedRevokedToAssignee',
              title: t('keyAndAttributes.attributes.components.attributesStateUpdated.label'), // 24
              description: t(
                'keyAndAttributes.attributes.components.attributesStateUpdated.description'
              ),
              visibility: ['admin'],
            },
          ],
        },
        {
          name: 'keys',
          title: t('keyAndAttributes.keys.title'),
          components: [
            {
              key: 'clientKeyAndProducerKeychainKeyAddedDeletedToClientUsers',
              title: t('keyAndAttributes.keys.components.clientKeysAssociationUpdated.label'), // 25
              description: t(
                'keyAndAttributes.keys.components.clientKeysAssociationUpdated.description'
              ),
              visibility: ['admin', 'security'], // To define
            },
          ],
        },
      ],
    },
  }

  const notificationSchema: NotificationConfigSchema = match(type)
    .with('inApp', () => {
      return notificationConfigSchema
    })
    .with('email', () => {
      return notificationConfigSchema
    })
    .exhaustive()

  const sectionComponentKeysMap = React.useMemo(() => {
    const keyMap: Record<string, string[]> = {}
    Object.keys(notificationSchema).forEach((sectionName) => {
      keyMap[sectionName] = notificationSchema[sectionName].subsections.flatMap(
        (section: NotificationSubSectionSchema) => section.components.map((c) => c.key)
      )
    })
    return keyMap
  }, [notificationSchema])

  return { notificationSchema, sectionComponentKeysMap }
}
