import React from 'react'
import ConsumerAgreementCreateVerifiedAttributesSection from './ConsumerAgreementCreateVerifiedAttributesSection'
import ConsumerAgreementCreateCertifiedAttributesDrawer from './ConsumerAgreementCreateCertifiedAttributesDrawer'
import ConsumerAgreementCreateAgreementGeneralInformation from './ConsumerAgreementCreateAgreementGeneralInformation'
import { ConsumerAgreementCreateDetailsContextProvider } from '../ConsumerAgreementCreateDetailsContext'
import ConsumerAgreementCreateDeclaredAttributesSection from './ConsumerAgreementCreateDeclaredAttributesSection'

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
  return (
    <ConsumerAgreementCreateDetailsContextProvider agreementId={agreementId}>
      <ConsumerAgreementCreateAgreementGeneralInformation />

      <ConsumerAgreementCreateCertifiedAttributesDrawer />

      <ConsumerAgreementCreateVerifiedAttributesSection
        agreementId={agreementId}
        consumerNotes={consumerNotes}
      />

      <ConsumerAgreementCreateDeclaredAttributesSection />
    </ConsumerAgreementCreateDetailsContextProvider>
  )
}

export default ConsumerAgreementCreateDetails
