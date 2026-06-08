import React from 'react'
import { ThankYouPage } from '@/components/shared/ThankYouPage'
import { useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

const RiskAnalysisApproveThankYouPage: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'approveThankYou' })
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('SUBSCRIBE_RISK_ANALYSIS_LIST')
  }

  return (
    <ThankYouPage
      icon={CheckIcon}
      title={t('title')}
      description={<Typography variant="body1">{t('description')}</Typography>}
      buttonLabel={t('action')}
      onButtonClick={handleClose}
    />
  )
}

export default RiskAnalysisApproveThankYouPage
