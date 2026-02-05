import type { Purpose } from '@/api/api.generatedTypes'
import {
  checkIsRulesetExpired,
  getDaysToExpiration,
  getFormattedExpirationDate,
  getPurposeSummaryInfoAlertLabel,
} from '@/utils/purpose.utils'
import { Alert, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from '@/router'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerPurposeSummaryAlertContainerProps = {
  purpose: Purpose | undefined
  expirationDate?: string
  isRulesetExpired: boolean
}

export const ConsumerPurposeSummaryAlertContainer: React.FC<
  ConsumerPurposeSummaryAlertContainerProps
> = ({ purpose, expirationDate, isRulesetExpired }) => {
  const { t } = useTranslation('purpose')

  const navigate = useNavigate()

  const daysToExpiration = getDaysToExpiration(expirationDate)

  const infoAlertLabel = getPurposeSummaryInfoAlertLabel(purpose)

  return (
    <>
      {expirationDate && !isRulesetExpired && (
        <Alert sx={{ mt: 3 }} severity="info">
          {t('summary.alerts.infoRulesetExpiration', {
            days: daysToExpiration,
            date: getFormattedExpirationDate(expirationDate),
          })}
        </Alert>
      )}
      {isRulesetExpired && (
        <Alert severity="error" sx={{ alignItems: 'center', mt: 3 }} variant="outlined">
          <Stack spacing={13} direction="row" alignItems="center">
            {' '}
            {/**TODO FIX SPACING */}
            <Typography>{t('summary.alerts.rulesetExpired.label')}</Typography>
            <Button
              variant="naked"
              size="medium"
              sx={{ fontWeight: 700, mr: 1 }}
              onClick={() => navigate('SUBSCRIBE_PURPOSE_CREATE')}
            >
              {t('summary.alerts.rulesetExpired.action')}
            </Button>
          </Stack>
        </Alert>
      )}
      {!expirationDate && !isRulesetExpired && (
        <Alert severity="info" sx={{ mt: 3 }}>
          {t(infoAlertLabel)}
        </Alert>
      )}
    </>
  )
}
