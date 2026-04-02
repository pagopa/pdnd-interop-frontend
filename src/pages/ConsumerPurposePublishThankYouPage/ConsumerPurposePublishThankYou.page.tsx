import React, { useEffect, useState } from 'react'
import { CircularProgress, Stack, Typography } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import { PurposeQueries } from '@/api/purpose'
import { ThankYouPage } from '@/components/shared/ThankYouPage'

const STABILIZATION_DELAY_MS = 1000

const ConsumerPurposePublishThankYouPage: React.FC = () => {
  const { t } = useTranslation('purpose', { keyPrefix: 'publishThankYou' })
  const { purposeId } = useParams<'SUBSCRIBE_PURPOSE_PUBLISH_THANK_YOU'>()
  const navigate = useNavigate()

  const [isStabilized, setIsStabilized] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsStabilized(true), STABILIZATION_DELAY_MS)
    return () => clearTimeout(timer)
  }, [])

  const { data: purpose } = useQuery(PurposeQueries.getSingle(purposeId))

  if (!isStabilized || !purpose) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{ height: '100%', py: 16 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress color="secondary" />
          <Typography variant="h4" component="h1" fontWeight={700}>
            {t('loading')}
          </Typography>
        </Stack>
      </Stack>
    )
  }

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
