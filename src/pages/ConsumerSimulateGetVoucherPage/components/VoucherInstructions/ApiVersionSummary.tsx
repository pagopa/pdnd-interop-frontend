import { SectionContainer } from '@/components/layout/containers'
import { IconLink } from '@/components/shared/IconLink'
import { Stack, Typography } from '@mui/material'
import React from 'react'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { apiV2DocLink, apiV3DocLink } from '@/config/constants'
import { useTranslation } from 'react-i18next'

type ApiVersionSummaryProps = {
  keyPrefix: 'dataAccessStep' | 'secondDPoPProofStep'
  hideV2?: boolean
}

export const ApiVersionSummary: React.FC<ApiVersionSummaryProps> = ({ keyPrefix, hideV2 }) => {
  const { t } = useTranslation('voucher', { keyPrefix })
  return (
    <SectionContainer
      title={t('pdndInteroperability.title')}
      description={t('pdndInteroperability.description')}
    >
      <Stack direction="row" sx={{ pt: 1, pb: 3 }} alignItems="center">
        <Stack direction="column" justifyContent="space-between" gap={1} sx={{ mr: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            {t('pdndInteroperability.apiV3.title')}
          </Typography>
          <Typography variant="body2">{t('pdndInteroperability.apiV3.description')}</Typography>
        </Stack>
        <IconLink
          endIcon={<OpenInNewIcon fontSize="small" />}
          href={apiV3DocLink}
          target="_blank"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {t('pdndInteroperability.actionLabel')}
        </IconLink>
      </Stack>
      {!hideV2 && (
        <Stack direction="row" alignItems="center">
          <Stack direction="column" justifyContent="space-between" gap={1} sx={{ mr: 3 }}>
            <Typography variant="body2" fontWeight={600}>
              {t('pdndInteroperability.apiV2.title')}
            </Typography>
            <Typography variant="body2">{t('pdndInteroperability.apiV2.description')}</Typography>
          </Stack>
          <IconLink
            endIcon={<OpenInNewIcon fontSize="small" />}
            href={apiV2DocLink}
            target="_blank"
            sx={{
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {t('pdndInteroperability.actionLabel')}
          </IconLink>
        </Stack>
      )}
    </SectionContainer>
  )
}
