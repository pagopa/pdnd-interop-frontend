import { AttributeQueries } from '@/api/attribute'
import { AuthHooks } from '@/api/auth'
import { EServiceQueries } from '@/api/eservice'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import {
  type AttributeOwnershipData,
  ReadOnlyDescriptorAttributes,
} from '@/components/shared/ReadOnlyDescriptorAttributes'
import { useParams } from '@/router'
import { formatThousands } from '@/utils/format.utils'
import { Divider, Grid, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'

const EntryRequirementsTab = () => {
  return (
    <Grid container>
      <Grid item xs={12} lg={8}>
        <React.Suspense fallback={<SectionContainerSkeleton sx={{ mt: 4 }} height={510} />}>
          <ThresholdsAndAtrributesSection />
        </React.Suspense>
      </Grid>
    </Grid>
  )
}

const ThresholdsAndAtrributesSection = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'consumer.detail.entryRequirements',
  })

  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()

  const { jwt } = AuthHooks.useJwt()

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
      <SectionContainer innerSection title={t('sections.thresholds.title')}>
        <Stack spacing={2}>
          <InformationContainer
            label={t('sections.thresholds.fields.dailyCallsPerConsumer')}
            content={
              descriptor.dailyCallsPerConsumer
                ? `${formatThousands(descriptor.dailyCallsPerConsumer)}`
                : ''
            }
          />
          <InformationContainer
            label={t('sections.thresholds.fields.dailyCallsTotal')}
            content={
              descriptor.dailyCallsTotal ? `${formatThousands(descriptor.dailyCallsTotal)}` : ''
            }
          />
          <Divider />
        </Stack>
      </SectionContainer>

      <ReadOnlyDescriptorAttributes
        descriptorAttributes={descriptor.attributes}
        ownershipData={ownershipData}
      />
    </SectionContainer>
  )
}

export default EntryRequirementsTab
