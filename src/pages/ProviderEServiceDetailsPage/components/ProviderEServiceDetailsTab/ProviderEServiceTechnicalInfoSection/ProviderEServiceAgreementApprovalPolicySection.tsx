import type { ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { useDrawerState } from '@/hooks/useDrawerState'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { useTranslation } from 'react-i18next'
import { ProviderEServiceUpdateAgreementApprovalPolicyDrawer } from './ProviderEServiceUpdateAgreementApprovalPolicyDrawer'

type ProviderEServiceAgreementApprovalPolicySectionProps = {
  descriptor: ProducerEServiceDescriptor
}

export const ProviderEServiceAgreementApprovalPolicySection: React.FC<
  ProviderEServiceAgreementApprovalPolicySectionProps
> = ({ descriptor }) => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.technicalInformations.agreementApprovalPolicy',
  })
  const { t: tCommon } = useTranslation('common')

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const onEdit = () => {
    openDrawer()
  }

  return (
    <>
      <SectionContainer
        innerSection
        title={t('title')}
        topSideActions={[
          {
            action: onEdit,
            label: tCommon('actions.edit'),
            icon: EditIcon,
          },
        ]}
      >
        <InformationContainer
          label={t('label')}
          content={t(`content.${descriptor.agreementApprovalPolicy}`)}
        />
      </SectionContainer>
      <ProviderEServiceUpdateAgreementApprovalPolicyDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        descriptor={descriptor}
      />
    </>
  )
}
