import React from 'react'
import { Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { PurposeQueries } from '@/api/purpose'
import { ThankYouPage } from '@/components/shared/ThankYouPage'

const ConsumerPurposePublishThankYouPage: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'publishThankYou' })
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_PUBLISH_THANK_YOU'>()
  const navigate = useNavigate()

  const { data: purpose } = useQuery(PurposeQueries.getSingle(purposeId))

  if (!purpose) return null

  const isActive = purpose.currentVersion?.state === 'ACTIVE'

  const handleClose = () => {
    navigate('SUBSCRIBE_PURPOSE_DETAILS', { params: { purposeId } })
  }

  return (
    <ThankYouPage
      icon={CheckIcon}
      title={isActive ? t('active.title') : t('waitingForApproval.title')}
      description={
        <Typography variant="body1">
          {isActive ? t('active.description') : t('waitingForApproval.description')}
        </Typography>
      }
      buttonLabel={t('action')}
      onButtonClick={handleClose}
    />
  )
}

export default ConsumerPurposePublishThankYouPage
