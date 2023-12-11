import React from 'react'
import { useConsumerAgreementDetailsContext } from '../ConsumerAgreementDetailsContext'
import { Stack } from '@mui/material'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { ConsumerAgreementDetailsCertifiedAttributesSection } from './ConsumerAgreementDetailsCertifiedAttributesSection'
import { ConsumerAgreementDetailsDeclaredAttributesSection } from './ConsumerAgreementDetailsDeclaredAttributesSection'
import { ConsumerAgreementDetailsVerifiedAttributesSection } from './ConsumerAgreementDetailsVerifiedAttributesSection/ConsumerAgreementDetailsVerifiedAttributesSection'

export const ConsumerAgreementDetailsAttributesSectionsList: React.FC = () => {
  const { agreement, descriptorAttributes } = useConsumerAgreementDetailsContext()

  if (!agreement || !descriptorAttributes)
    return <ConsumerAgreementDetailsAttributesSectionsListSkeleton />

  const isPending = agreement.state === 'PENDING'

  return (
    <Stack spacing={3}>
      {!isPending && <ConsumerAgreementDetailsCertifiedAttributesSection />}
      <ConsumerAgreementDetailsVerifiedAttributesSection />
      <ConsumerAgreementDetailsDeclaredAttributesSection />
    </Stack>
  )
}

export const ConsumerAgreementDetailsAttributesSectionsListSkeleton: React.FC = () => {
  return (
    <Stack spacing={3}>
      <SectionContainerSkeleton height={300} />
      <SectionContainerSkeleton height={300} />
      <SectionContainerSkeleton height={300} />
    </Stack>
  )
}
