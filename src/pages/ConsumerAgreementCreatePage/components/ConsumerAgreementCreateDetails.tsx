import { AgreementDetailsContextProvider } from '@/components/shared/AgreementDetails/AgreementDetailsContext'
import { AgreementSummarySection } from '@/components/shared/AgreementDetails/components/AgreementSummarySection'
import React from 'react'
import ConsumerAgreementCreateVerifiedAttributesSection from './ConsumerAgreementCreateVerifiedAttributesSection'
import { AgreementDeclaredAttributesSection } from '@/components/shared/AgreementDetails/components/AgreementAttributesListSections/AgreementDeclaredAttributesSection'
import { ConsumerAgreementCreateDrawer } from './ConsumerAgreementCreateDrawer'

type ConsumerAgreementCreateDetailsProps = {
  agreementId: string
  consumerNotes: {
    value: string
    setter: React.Dispatch<React.SetStateAction<string>>
  }
}

const ConsumerAgreementCreateDetails: React.FC<ConsumerAgreementCreateDetailsProps> = ({
  agreementId,
  consumerNotes,
}) => {
  const [isCertifiedAttributesDrawerOpen, setIsCertifiedAttributesDrawerOpen] =
    React.useState(false)

  const handleOpenCertifiedAttributesDrawer = () => {
    setIsCertifiedAttributesDrawerOpen(true)
  }

  const handleCloseCertifiedAttributesDrawer = () => {
    setIsCertifiedAttributesDrawerOpen(false)
  }

  return (
    <AgreementDetailsContextProvider agreementId={agreementId}>
      <AgreementSummarySection
        onOpenCertifiedAttributesDrawer={handleOpenCertifiedAttributesDrawer}
      />

      <ConsumerAgreementCreateDrawer
        isOpen={isCertifiedAttributesDrawerOpen}
        onClose={handleCloseCertifiedAttributesDrawer}
      />

      <ConsumerAgreementCreateVerifiedAttributesSection
        agreementId={agreementId}
        consumerNotes={consumerNotes}
      />

      <AgreementDeclaredAttributesSection sx={{ borderRadius: 2 }} />
    </AgreementDetailsContextProvider>
  )
}

export default ConsumerAgreementCreateDetails
