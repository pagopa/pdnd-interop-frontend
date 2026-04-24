import { AuthHooks } from '@/api/auth'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import {
  ReadOnlyDescriptorAttributes,
  type AttributeOwnershipData,
} from '@/components/shared/ReadOnlyDescriptorAttributes'
import { useParams } from '@/router'
import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Divider, Stack } from '@mui/material'
import { formatThousands } from '@/utils/format.utils'

export const ConsumerEServiceDescriptorAttributes: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read.sections.attributes' })
  const { jwt } = AuthHooks.useJwt()

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { data: descriptor } = useSuspenseQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  const [{ data: ownedCertified }, { data: ownedVerified }, { data: ownedDeclared }] =
    useSuspenseQueries({
      queries: [
        AttributeQueries.getPartyCertifiedList(jwt?.organizationId),
        AttributeQueries.getPartyVerifiedList(jwt?.organizationId),
        AttributeQueries.getPartyDeclaredList(jwt?.organizationId),
      ],
    })

  const ownershipData: AttributeOwnershipData = React.useMemo(
    () => ({
      certified: ownedCertified.attributes,
      verified: ownedVerified.attributes,
      declared: ownedDeclared.attributes,
      producerId: descriptor.eservice.producer.id,
    }),
    [ownedCertified, ownedVerified, ownedDeclared, descriptor.eservice.producer.id]
  )

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <SectionContainer innerSection title={t('thresholds.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('thresholds.dailyCallsPerConsumer.label')}
            content={
              descriptor.dailyCallsPerConsumer
                ? `${formatThousands(descriptor.dailyCallsPerConsumer)}`
                : ''
            }
          />
          <InformationContainer
            label={t('thresholds.dailyCallsTotal.label')}
            content={
              descriptor.dailyCallsTotal
                ? `${formatThousands(descriptor.dailyCallsTotal)}`
                : ''
            }
          />
        </Stack>
      </SectionContainer>
      <Divider sx={{ my: 3 }} />
      <ReadOnlyDescriptorAttributes
        descriptorAttributes={descriptor.attributes}
        ownershipData={ownershipData}
      />
    </SectionContainer>
  )
}

export const ConsumerEServiceDescriptorAttributesSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={1000} />
}
