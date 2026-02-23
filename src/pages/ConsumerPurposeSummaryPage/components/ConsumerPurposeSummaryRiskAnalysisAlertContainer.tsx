import { getDaysToExpiration, getFormattedExpirationDate } from '@/utils/purpose.utils'
import { Alert, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from '@/router'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

type ConsumerPurposeSummaryRiskAnalysisAlertContainerProps = {
  expirationDate?: string
  isRulesetExpired: boolean
}

export const ConsumerPurposeSummaryRiskAnalysisAlertContainer: React.FC<
  ConsumerPurposeSummaryRiskAnalysisAlertContainerProps
> = ({ expirationDate, isRulesetExpired }) => {
  const { t } = useTranslation('purpose')

  const navigate = useNavigate()

  const daysToExpiration = getDaysToExpiration(expirationDate)

  return (
    <>
      {expirationDate && !isRulesetExpired && (
        <Alert sx={{ mt: 3 }} severity="info" variant="outlined">
          <Trans
            components={{
              strong: <Typography component="span" variant="inherit" fontWeight={700} />,
            }}
          >
            {t('summary.alerts.infoRulesetExpiration', {
              days: daysToExpiration,
              date: getFormattedExpirationDate(expirationDate),
            })}
          </Trans>
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
    </>
  )
}
