import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { Stack } from '@mui/material'
import { MIAlert as Alert, type MIAlertProps as AlertProps } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import { AuthHooks } from '@/api/auth'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { useParams } from '@/router'
import { AttributeQueries } from '@/api/attribute'
import { hasAllDescriptorAttributes } from '@/utils/attribute.utils'
import { AgreementQueries } from '@/api/agreement'
import { formatDateStringNumeric } from '@/utils/format.utils'

type ConsumerEServiceDetailsAlertsProps = {
  descriptor: CatalogEServiceDescriptor | undefined
  updateTab?: (tab: string) => void
}

export const ConsumerEServiceDetailsAlerts: React.FC<ConsumerEServiceDetailsAlertsProps> = ({
  descriptor,
  updateTab,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'consumer.detail.alerts' })
  const { isReviewer, jwt } = AuthHooks.useJwt()
  const { eserviceId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const tenantId = jwt?.organizationId

  /*
   * DELEGATORS DATA: Delegators that have delegated to the current user organization for the current eService
   * */

  const { data: delegators } = useQuery({
    ...DelegationQueries.getConsumerDelegators({
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
    }),
    enabled: Boolean(tenantId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  /*
   * TENANT ATTRIBUTES DATA: Attributes that the current user organization owns
   * */

  const { data: certified } = useQuery({
    ...AttributeQueries.getPartyCertifiedList(tenantId),
  })

  /*
   * ESERVICE AGREEMENTS (OWN/ DELEGATED) DATA
   * */

  // The main problem is that the agreements are limited to 50 in this case
  const { data: agreements } = useQuery({
    ...AgreementQueries.getConsumerAgreementsList({
      limit: 50,
      offset: 0,
      states: [],
      eservicesIds: [eserviceId],
    }),
    enabled: Boolean(jwt?.organizationId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  if (!descriptor) return null

  const scheduledDate = descriptor.archivingSchedule?.archivableOn
  const archivingScope = descriptor.archivingSchedule?.scope

  const isAsyncExchange = descriptor.eservice.asyncExchange === true
  const isMissingProducerKeychain =
    isAsyncExchange && descriptor.eservice.hasProducerKeychain === false
  const isMissingProducerKeychainKeys =
    isAsyncExchange &&
    descriptor.eservice.hasProducerKeychain === true &&
    descriptor.eservice.hasProducerKeychainKeys === false

  const isMine = descriptor.eservice.producer.id === tenantId

  let hasAllCertifiedAttributes = true

  if (
    !isMine &&
    descriptor &&
    descriptor.state === 'PUBLISHED' &&
    certified &&
    delegators?.length === 0
  ) {
    hasAllCertifiedAttributes = hasAllDescriptorAttributes(
      'certified',
      certified.attributes,
      descriptor?.attributes.certified
    )
  }

  const alerts: Omit<AlertProps, 'children'>[] = []

  if (descriptor.state === 'PUBLISHED' && !hasAllCertifiedAttributes) {
    alerts.push({
      severity: 'error',
      content: t('missingCertifiedAttribute.content'),
      action: {
        label: t('missingCertifiedAttribute.action'),
        onClick: () => updateTab?.('entryRequirements'),
      },
    })
  }

  const currentDescriptorAgreements = agreements?.filter(
    (agreement) =>
      agreement.descriptor.id === descriptor.id && ['ACTIVE', 'SUSPENDED'].includes(agreement.state)
  )

  if (descriptor.state === 'DEPRECATED') {
    if (scheduledDate) {
      if (archivingScope === 'DESCRIPTOR') {
        if (currentDescriptorAgreements?.length) {
          alerts.push({
            severity: 'warning',
            content: t('deprecatedArchivingDescriptorWithAgreements', {
              date: formatDateStringNumeric(scheduledDate),
            }),
          })
        } else {
          alerts.push({
            severity: 'error',
            content: t('deprecatedArchivingDescriptorWithoutAgreements', {
              date: formatDateStringNumeric(scheduledDate),
            }),
          })
        }
      }
      if (archivingScope === 'ESERVICE') {
        if (currentDescriptorAgreements?.length) {
          alerts.push({
            severity: 'error',
            content: t('deprecatedArchivingEServiceWithAgreements', {
              date: formatDateStringNumeric(scheduledDate),
            }),
          })
        } else {
          alerts.push({
            severity: 'error',
            content: t('deprecatedArchivingEServiceWithoutAgreements', {
              date: formatDateStringNumeric(scheduledDate),
            }),
          })
        }
      }
    } else {
      alerts.push({
        severity: 'warning',
        content: t('deprecated'),
      })
    }
  }

  if (descriptor.state === 'SUSPENDED') {
    if (currentDescriptorAgreements?.length) {
      alerts.push({
        severity: 'error',
        content: t('suspendedWithAgreements'),
      })
    } else {
      alerts.push({
        severity: 'error',
        content: t('suspended'),
      })
    }
  }

  if (descriptor.state === 'ARCHIVING' && scheduledDate) {
    if (archivingScope === 'DESCRIPTOR') {
      if (currentDescriptorAgreements?.length) {
        alerts.push({
          severity: 'warning',
          content: t('deprecatedArchivingDescriptorWithAgreements', {
            date: formatDateStringNumeric(scheduledDate),
          }),
        })
      } else {
        alerts.push({
          severity: 'error',
          content: t('deprecatedArchivingDescriptorWithoutAgreements', {
            date: formatDateStringNumeric(scheduledDate),
          }),
        })
      }
    }

    if (archivingScope === 'ESERVICE') {
      if (currentDescriptorAgreements?.length) {
        alerts.push({
          severity: 'error',
          content: t('archivingEServiceWithAgreements', {
            date: formatDateStringNumeric(scheduledDate),
          }),
        })
      } else {
        alerts.push({
          severity: 'error',
          content: t('archivingEService', { date: formatDateStringNumeric(scheduledDate) }),
        })
      }
    }
  }

  if (isMissingProducerKeychain) {
    alerts.push({
      severity: 'warning',
      content: t('missingProducerKeychain'),
    })
  }

  if (isMissingProducerKeychainKeys) {
    alerts.push({
      severity: 'warning',
      content: t('missingProducerKeychainKeys'),
    })
  }

  if (alerts.length === 0) return null

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {alerts.map((alert, index) => (
        <Alert key={index} severity={alert.severity} action={alert.action}>
          {alert.content}
        </Alert>
      ))}
    </Stack>
  )
}
