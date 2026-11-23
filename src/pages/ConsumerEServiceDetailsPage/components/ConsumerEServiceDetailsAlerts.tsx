import React from 'react'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
import { Stack } from '@mui/material'
import { MIAlert as Alert } from '@pagopa/mui-italia'
import { useTranslation } from 'react-i18next'
import { getEServiceDescriptorAlertSpec } from '@/utils/eservice.utils'
import { AuthHooks } from '@/api/auth'
import { useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { useParams } from '@/router'
import { AttributeQueries } from '@/api/attribute'
import { hasAllDescriptorAttributes } from '@/utils/attribute.utils'

type ConsumerEServiceDetailsAlertsProps = {
  descriptor: CatalogEServiceDescriptor | undefined
  updateTab?: (tab: string) => void
}

export const ConsumerEServiceDetailsAlerts: React.FC<ConsumerEServiceDetailsAlertsProps> = ({
  descriptor,
  updateTab,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.alert' })
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

  if (!descriptor) return null

  const alert = getEServiceDescriptorAlertSpec({
    state: descriptor.state,
    scope: descriptor.archivingSchedule?.scope,
    archivableOn: descriptor.archivingSchedule?.archivableOn,
    archivedAt: descriptor.archivedAt,
    t,
  })

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

  if (
    !alert &&
    !isMissingProducerKeychain &&
    !isMissingProducerKeychainKeys &&
    hasAllCertifiedAttributes
  )
    return null

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {alert && <Alert severity={alert.severity}>{alert.content}</Alert>}
      {isMissingProducerKeychain && (
        <Alert severity="warning">{t('missingProducerKeychain')}</Alert>
      )}
      {isMissingProducerKeychainKeys && (
        <Alert severity="warning">{t('missingProducerKeychainKeys')}</Alert>
      )}
      {!hasAllCertifiedAttributes && (
        <Alert
          severity="error"
          action={{
            label: t('missingCertifiedAttribute.action'),
            onClick: () => updateTab?.('entryRequirements'),
          }}
        >
          {t('missingCertifiedAttribute.content')}
        </Alert>
      )}
    </Stack>
  )
}
