import React from 'react'
import ConsumerAgreementCreateVerifiedAttributesSection from './ConsumerAgreementCreateVerifiedAttributesSection'
import ConsumerAgreementCreateCertifiedAttributesDrawer from './ConsumerAgreementCreateCertifiedAttributesDrawer'
import ConsumerAgreementCreateAgreementGeneralInformation from './ConsumerAgreementCreateAgreementGeneralInformation'
import { ConsumerAgreementCreateContentContextProvider } from '../ConsumerAgreementCreateContentContext'
import ConsumerAgreementCreateDeclaredAttributesSection from './ConsumerAgreementCreateDeclaredAttributesSection'

type ConsumerAgreementCreateContentProps = {
  agreementId: string
  consumerNotes: string
  onConsumerNotesChange: (value: string) => void
}

const ConsumerAgreementCreateContent: React.FC<ConsumerAgreementCreateContentProps> = ({
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

export default ConsumerAgreementCreateContent
