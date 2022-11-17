import { SectionContainer } from '@/components/layout/containers'
import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

export const AgreementConsumerMessageSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.consumerMessage' })
  const { agreement } = useAgreementDetailsContext()

  if (!agreement || !agreement.consumerNotes) {
    return null
  }

  return (
    <SectionContainer title={t('title')}>
      <Typography>{agreement.consumerNotes}</Typography>
    </SectionContainer>
  )
}
