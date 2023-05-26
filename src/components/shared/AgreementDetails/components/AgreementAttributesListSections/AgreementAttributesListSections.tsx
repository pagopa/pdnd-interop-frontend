import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import React from 'react'
import { AgreementCertifiedAttributesSection } from './AgreementCertifiedAttributesSection'
import { AgreementVerifiedAttributesSection } from './AgreementVerifiedAttributesSection'
import { AgreementDeclaredAttributesSection } from './AgreementDeclaredAttributesSection'
import { Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const AgreementAttributesListSections: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  return (
    <SectionContainer newDesign title={t('title')} description={t('description')}>
      <Divider sx={{ my: 3 }} />
      <AgreementCertifiedAttributesSection />
      <Divider sx={{ my: 3 }} />
      <AgreementVerifiedAttributesSection />
      <Divider sx={{ my: 3 }} />
      <AgreementDeclaredAttributesSection />
    </SectionContainer>
  )
}

export const AgreementAttributesListSectionsSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={260} />
}
