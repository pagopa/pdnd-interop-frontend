import { useTranslation } from 'react-i18next'
import { type NotificationConfigSchema } from '../components/InAppNotificationUserConfigTab'

export function useNotificationInAppConfigForm() {
  const { t } = useTranslation('notification', { keyPrefix: 'configurationPage.inAppTab' })

  const notificationSchema: NotificationConfigSchema = {
    subscriber: {
      title: t('subscriber.title'),
      subsections: [
        {
          name: 'fruizioneDati',
          title: t('subscriber.dataUsage.title'),
          components: [
            {
              key: 'eserviceStateChangedToConsumer',
              title: t('subscriber.dataUsage.components.eServiceStateUpdated.label') + '(11)',
              description: t('subscriber.dataUsage.components.eServiceStateUpdated.description'),
            },
            {
              key: 'agreementActivatedRejectedToConsumer',
              title: t('subscriber.dataUsage.components.agreementManagement.label') + '(12)',
              description: t('subscriber.dataUsage.components.agreementManagement.description'),
            },
            {
              key: 'agreementSuspendedUnsuspendedToConsumer',
              title: t('subscriber.dataUsage.components.agreementStateUpdated.label') + '(13)',
              description: t('subscriber.dataUsage.components.agreementStateUpdated.description'),
            },
          ],
        },
        {
          name: 'finalita',
          title: t('subscriber.purpose.title'),
          components: [
            {
              key: 'purposeActivatedRejectedToConsumer',
              title: t('subscriber.purpose.components.purposeManagement.label') + '(15)',
              description: t('subscriber.purpose.components.purposeManagement.description'),
            },
            {
              key: 'purposeSuspendedUnsuspendedToConsumer',
              title: t('subscriber.purpose.components.purposeStateUpdated.label') + '(16)',
              description: t('subscriber.purpose.components.purposeStateUpdated.description'),
            },
          ],
        },
        {
          name: 'soglieDiCarico',
          title: t('subscriber.thresholds.title'),
          components: [
            {
              key: 'TODO',
              title: t('subscriber.thresholds.components.thresholdsExcedeed.label'),
              description: t('subscriber.thresholds.components.thresholdsExcedeed.description'),
            },
            {
              key: 'TODO',
              title: t('subscriber.thresholds.components.thresholsdAdjustmentRequest.label'),
              description: t(
                'subscriber.thresholds.components.thresholsdAdjustmentRequest.description'
              ),
            },
          ],
        },
      ],
    },
    provider: {
      title: t('provider.title'),
      subsections: [
        {
          name: 'richiesteFruizione',
          title: t('provider.agreement.title'),
          components: [
            {
              key: 'agreementManagementToProducer',
              title: t('provider.agreement.components.agreementRequestReceived.label') + '(03)',
              description: t('provider.agreement.components.agreementRequestReceived.description'),
            },
            {
              key: 'agreementSuspendedUnsuspendedToProducer',
              title: t('provider.agreement.components.agreementStateUpdated.label') + '(04)',
              description: t('provider.agreement.components.agreementStateUpdated.description'),
            },
          ],
        },
        {
          name: 'finalita',
          title: t('provider.purpose.title'),
          components: [
            {
              key: 'purposeStatusChangedToProducer',
              title: t('provider.purpose.components.purposeStateUpdated.label') + '(07)',
              description: t('provider.purpose.components.purposeStateUpdated.description'),
            },
          ],
        },
        {
          name: 'clientSoglieDiCarico',
          title: t('provider.clientAndThresholds.title'),
          components: [
            {
              key: 'clientAddedRemovedToProducer',
              title:
                t('provider.clientAndThresholds.components.clientAssociationFromSubscriber.label') +
                '(05)',
              description: t(
                'provider.clientAndThresholds.components.clientAssociationFromSubscriber.description'
              ),
            },
            {
              key: 'TODO',
              title: t('provider.clientAndThresholds.components.thresholdExceeded.label') + 'BOH',
              description: t(
                'provider.clientAndThresholds.components.thresholdExceeded.description'
              ),
            },
            {
              key: 'TODO',
              title:
                t('provider.clientAndThresholds.components.thresholdAdjustmentRequest.label') +
                'BOH',
              description: t(
                'provider.clientAndThresholds.components.thresholdAdjustmentRequest.description'
              ),
            },
          ],
        },
        {
          name: 'eserviceTemplate',
          title: t('provider.eserviceTemplate.title'),
          components: [
            {
              key: 'newEserviceTemplateVersionToInstantiator',
              title: t('provider.eserviceTemplate.components.instanceFromTemplate.label') + '(17)',
              description: t(
                'provider.eserviceTemplate.components.instanceFromTemplate.description'
              ),
            },
            {
              key: 'eserviceTemplateStatusChangedToInstantiator',
              title: t('provider.eserviceTemplate.components.templateStateUpdated.label') + '(19)',
              description: t(
                'provider.eserviceTemplate.components.templateStateUpdated.description'
              ),
            },
            {
              key: 'newTemplateVersion',
              title: t('provider.eserviceTemplate.components.newTemplateVersion.label') + 'BOH',
              description: t('provider.eserviceTemplate.components.newTemplateVersion.description'),
            },
            {
              key: 'eserviceTemplateNameChangedToInstantiator',
              title:
                t('provider.eserviceTemplate.components.templatePropertiesUpdated.label') + '(18)',
              description: t(
                'provider.eserviceTemplate.components.templatePropertiesUpdated.description'
              ),
            },
            {
              key: 'templateStatusChangedToProducer',
              title:
                t('provider.eserviceTemplate.components.templateStateArchivedSuspended.label') +
                '(09)',
              description: t(
                'provider.eserviceTemplate.components.templateStateArchivedSuspended.description'
              ),
            },
          ],
        },
      ],
    },
    delegations: {
      title: t('delegation.title'),
      subsections: [
        {
          name: 'richiesteFruizione',
          title: t('delegation.delegationAssignment.title'),
          components: [
            {
              key: 'delegationApprovedRejectedToDelegator',
              title:
                t('delegation.delegationAssignment.components.delegationUpdated.label') + '(20)',
              description: t(
                'delegation.delegationAssignment.components.delegationUpdated.description'
              ),
            },
            {
              key: 'eserviceNewVersionSubmittedToDelegator',
              title:
                t('delegation.delegationAssignment.components.eserviceDelegatedCreated.label') +
                '(21)',
              description: t(
                'delegation.delegationAssignment.components.eserviceDelegatedCreated.description'
              ),
            },
          ],
        },
        {
          name: 'delegationReceive',
          title: t('delegation.delegationReceive.title'),
          components: [
            {
              key: 'delegationSubmittedRevokedToDelegate',
              title: t('delegation.delegationReceive.components.delegationUpdated.label') + '(23)',
              description: t(
                'delegation.delegationReceive.components.delegationUpdated.description'
              ),
            },
            {
              key: 'eserviceNewVersionApprovedRejectedToDelegate',
              title:
                t('delegation.delegationReceive.components.eserviceDelegatedApproval.label') +
                '(22)',
              description: t(
                'delegation.delegationReceive.components.eserviceDelegatedApproval.description'
              ),
            },
          ],
        },
      ],
    },
    keyAndAttributes: {
      title: t('keyAndAttributes.title'),
      subsections: [
        {
          name: 'attributes',
          title: t('keyAndAttributes.attributes.title'),
          components: [
            {
              key: 'certifiedVerifiedAttributeAssignedRevokedToAssignee',
              title:
                t('keyAndAttributes.attributes.components.attributesStateUpdated.label') + '(24)',
              description: t(
                'keyAndAttributes.attributes.components.attributesStateUpdated.description'
              ),
            },
          ],
        },
        {
          name: 'keys',
          title: t('keyAndAttributes.keys.title'),
          components: [
            {
              key: 'clientKeyAddedDeletedToClientUsers',
              title:
                t('keyAndAttributes.keys.components.clientKeysAssociationUpdated.label') + '(25)',
              description: t(
                'keyAndAttributes.keys.components.clientKeysAssociationUpdated.description'
              ),
            },
          ],
        },
      ],
    },
  }

  return { notificationSchema }
}
