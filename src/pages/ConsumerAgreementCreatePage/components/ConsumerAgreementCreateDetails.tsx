import React from 'react'
import ConsumerAgreementCreateVerifiedAttributesSection from './ConsumerAgreementCreateVerifiedAttributesSection'
import ConsumerAgreementCreateCertifiedAttributesDrawer from './ConsumerAgreementCreateCertifiedAttributesDrawer'
import ConsumerAgreementCreateAgreementGeneralInformation from './ConsumerAgreementCreateAgreementGeneralInformation'
import { ConsumerAgreementCreateDetailsContextProvider } from '../ConsumerAgreementCreateDetailsContext'
import ConsumerAgreementCreateDeclaredAttributesSection from './ConsumerAgreementCreateDeclaredAttributesSection'

type ConsumerAgreementCreateDetailsProps = {
  agreementId: string
  consumerNotes: string
  onConsumerNotesChange: (value: string) => void
}

const ConsumerAgreementCreateDetails: React.FC<ConsumerAgreementCreateDetailsProps> = ({
  agreementId,
  consumerNotes,
  onConsumerNotesChange,
}) => {
  return (
    <ConsumerAgreementCreateDetailsContextProvider agreementId={agreementId}>
      <ConsumerAgreementCreateAgreementGeneralInformation />
      <ConsumerAgreementCreateCertifiedAttributesDrawer />
      <ConsumerAgreementCreateVerifiedAttributesSection
        agreementId={agreementId}
        consumerNotes={consumerNotes}
        onConsumerNotesChange={onConsumerNotesChange}
      />
      <ConsumerAgreementCreateDeclaredAttributesSection />
    </ConsumerAgreementCreateDetailsContextProvider>
  )
}

export default ConsumerAgreementCreateDetails
