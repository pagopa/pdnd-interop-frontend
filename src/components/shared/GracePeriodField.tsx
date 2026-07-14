import type { GracePeriodDays } from '@/api/api.generatedTypes'
import { DEFAULT_GRACE_PERIOD_DAYS, GRACE_PERIOD_DAYS_OPTIONS } from '@/config/constants'
import { calculateArchivableOn } from '@/utils/eservice.utils'
import { formatDateStringNumeric } from '@/utils/format.utils'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import { useWatch } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { RHFRadioGroup } from './react-hook-form-inputs'

export const GracePeriodField: React.FC = () => {
  const { t } = useTranslation('shared-components', { keyPrefix: 'archiveGracePeriod' })

  const selectedGracePeriodDays = Number(
    useWatch({ name: 'gracePeriodDays' }) ?? DEFAULT_GRACE_PERIOD_DAYS
  ) as GracePeriodDays

  const formattedArchiveDate = formatDateStringNumeric(
    calculateArchivableOn(new Date(), selectedGracePeriodDays)
  )

  const options = GRACE_PERIOD_DAYS_OPTIONS.map((days) => ({
    label: t(days === DEFAULT_GRACE_PERIOD_DAYS ? 'optionRecommended' : 'option', { days }),
    value: String(days),
  }))

  return (
    <Stack spacing={3}>
      <RHFRadioGroup name="gracePeriodDays" label={t('label')} options={options} />
      <Typography variant="body2">
        <Trans
          components={{
            strong: <Typography component="span" variant="inherit" fontWeight={600} />,
          }}
        >
          {t('archiveDate', { date: formattedArchiveDate })}
        </Trans>
      </Typography>
    </Stack>
  )
}
