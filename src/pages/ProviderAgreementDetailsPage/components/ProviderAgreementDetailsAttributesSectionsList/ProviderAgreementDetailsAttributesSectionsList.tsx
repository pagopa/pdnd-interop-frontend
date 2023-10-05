import { ProviderAgreementDetailsDeclaredAttributesSection } from './ProviderAgreementDetailsDeclaredAttributesSection'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import React from 'react'
import { ProviderAgreementDetailsCertifiedAttributesSection } from './ProviderAgreementDetailsCertifiedAttributesSection'
import { ProviderAgreementDetailsVerifiedAttributesSection } from './ProviderAgreementDetailsVerifiedAttributesSection/ProviderAgreementDetailsVerifiedAttributesSection'
import { useProviderAgreementDetailsContext } from '../ProviderAgreementDetailsContext'

export const ProviderAgreementDetailsAttributesSectionsList: React.FC = () => {
  const { agreement, descriptorAttributes } = useProviderAgreementDetailsContext()

  if (!agreement || !descriptorAttributes)
    return <ProviderAgreementDetailsAttributesSectionsListSkeleton />

  const isPending = agreement.state === 'PENDING'

  return (
    <Stack spacing={3}>
      {!isPending && <ProviderAgreementDetailsCertifiedAttributesSection />}
      <ProviderAgreementDetailsVerifiedAttributesSection />
      {!isPending && <ProviderAgreementDetailsDeclaredAttributesSection />}
    </Stack>
  )
}

export const ProviderAgreementDetailsAttributesSectionsListSkeleton: React.FC = () => {
  return (
    <Stack spacing={3}>
      <SectionContainerSkeleton height={300} />
      <SectionContainerSkeleton height={300} />
      <SectionContainerSkeleton height={300} />
    </Stack>
  )
}
