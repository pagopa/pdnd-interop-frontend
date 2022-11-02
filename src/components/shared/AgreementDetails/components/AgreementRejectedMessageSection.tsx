import { SectionContainer } from '@/components/layout/containers'
import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

export const AgreementRejectedMessageSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.rejectionMessage' })
  const { agreement } = useAgreementDetailsContext()

  if (!agreement || agreement.state !== 'REJECTED' || !agreement.rejectionReason) {
    return null
  }

  return (
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Subtitle>{t('description')}</SectionContainer.Subtitle>
      <SectionContainer.Content>
        <Typography>{agreement.rejectionReason}</Typography>
      </SectionContainer.Content>
    </SectionContainer>
  )
}
