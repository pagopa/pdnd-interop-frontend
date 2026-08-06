import React from 'react'
import { ThankYouPage } from '@/components/shared/ThankYouPage'
import { useNavigate, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'

const RiskAnalysisApproveThankYouPage: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'approveThankYou' })
  const { purposeId } = useParams<'SUBSCRIBE_RISK_ANALYSIS_APPROVAL_SUCCESS'>()
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('SUBSCRIBE_RISK_ANALYSIS_DETAILS', { params: { purposeId } })
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
