import React from 'react'
import ConsumerAgreementCreateVerifiedAttributesSection from './ConsumerAgreementCreateVerifiedAttributesSection'
import ConsumerAgreementCreateCertifiedAttributesDrawer from './ConsumerAgreementCreateCertifiedAttributesDrawer'
import ConsumerAgreementCreateAgreementGeneralInformation from './ConsumerAgreementCreateAgreementGeneralInformation'
import { ConsumerAgreementCreateContentContextProvider } from '../ConsumerAgreementCreateContentContext'
import ConsumerAgreementCreateDeclaredAttributesSection from './ConsumerAgreementCreateDeclaredAttributesSection'
import { SectionContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'

type ConsumerAgreementCreateContentProps = {
  agreementId: string
  consumerNotes: string
  onConsumerNotesChange: (value: string) => void
}

export const ConsumerAgreementCreateContent: React.FC<ConsumerAgreementCreateContentProps> = ({
  agreementId,
  consumerNotes,
  onConsumerNotesChange,
}) => {
  return (
    <ConsumerAgreementCreateContentContextProvider agreementId={agreementId}>
      <ConsumerAgreementCreateAgreementGeneralInformation />
      <ConsumerAgreementCreateCertifiedAttributesDrawer />
      <ConsumerAgreementCreateVerifiedAttributesSection
        agreementId={agreementId}
        consumerNotes={consumerNotes}
        onConsumerNotesChange={onConsumerNotesChange}
      />
      <ConsumerAgreementCreateDeclaredAttributesSection />
    </ConsumerAgreementCreateContentContextProvider>
  )
}

export const ConsumerAgreementCreateContentSkeleton: React.FC = () => {
  return (
    <Stack spacing={2}>
      <SectionContainerSkeleton sx={{ borderRadius: 2 }} height={214} />
      <SectionContainerSkeleton sx={{ borderRadius: 2 }} height={847} />
      <SectionContainerSkeleton sx={{ borderRadius: 2 }} height={306} />
    </Stack>
  )
}
