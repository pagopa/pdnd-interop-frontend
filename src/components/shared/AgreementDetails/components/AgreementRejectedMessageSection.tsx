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
    <SectionContainer title={t('title')} description={t('description')}>
      <Typography>{agreement.rejectionReason}</Typography>
    </SectionContainer>
  )
}
