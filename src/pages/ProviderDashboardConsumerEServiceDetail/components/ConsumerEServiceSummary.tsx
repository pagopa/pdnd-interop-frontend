import React from 'react'
import { Box, Chip, Link, Stack, Tooltip, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { ProducerEServiceMonitoringConsumerPurposes } from '@/api/api.generatedTypes'
import { formatThousands } from '@/utils/format.utils'
import {
  getPercentageChipColor,
  type ConsumerEServiceDetailOrigin,
} from '../consumerEServiceDetail.utils'

type ConsumerEServiceSummaryProps = {
  data: ProducerEServiceMonitoringConsumerPurposes
  consumerName: string
  origin: ConsumerEServiceDetailOrigin
  /** Builds the same-origin URL of another version of this e-service for the same consumer. */
  getVersionPath: (descriptorId: string) => string
}

/** Presentational summary: e-service version, effective threshold and approved consumption. */
export function ConsumerEServiceSummary({
  data,
  consumerName,
  origin,
  getVersionPath,
}: Readonly<ConsumerEServiceSummaryProps>) {
  const { t } = useTranslation('pages', {
    keyPrefix: 'providerDashboardConsumerEServiceDetail.summary',
  })
  const attribute = data.customizedByAttribute

  return (
    <Box
      component="dl"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '200px minmax(0, 1fr)' },
        alignItems: 'center',
        columnGap: 2,
        rowGap: { xs: 0.5, md: 2 },
        m: 0,
        mt: 3,
        '& dd': { m: 0, mb: { xs: 1.5, md: 0 } },
      }}
    >
      {origin === 'dashboard' && (
        <>
          <Typography component="dt" variant="body2">
            {t('consumer')}
          </Typography>
          <Typography component="dd" variant="body2" fontWeight={600}>
            {consumerName}
          </Typography>
        </>
      )}
      <Typography component="dt" variant="body2">
        {origin === 'dashboard' ? t('version') : t('eservice')}
      </Typography>
      <Stack component="dd" spacing={0.5}>
        <Typography component="span" variant="body2" fontWeight={600}>
          {origin === 'dashboard'
            ? t('versionShort', { version: data.version })
            : t('eserviceValue', { name: data.eservice.name, version: data.version })}
        </Typography>
        {data.otherVersions.length > 0 && (
          <Stack
            component="span"
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
          >
            <Typography component="span" variant="caption" color="text.secondary">
              {t('otherVersionsLabel')}
            </Typography>
            {data.otherVersions.map(({ descriptorId, version }) => (
              <Link
                key={descriptorId}
                component={RouterLink}
                to={getVersionPath(descriptorId)}
                variant="caption"
                fontWeight={600}
                aria-label={t('otherVersionAriaLabel', { version })}
              >
                {t('versionShort', { version })}
              </Link>
            ))}
          </Stack>
        )}
      </Stack>

      <Typography component="dt" variant="body2">
        {t('threshold')}
      </Typography>
      <Stack component="dd" direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Typography component="span" variant="body2" fontWeight={600}>
          {t('dailyCalls', { value: formatThousands(data.dailyCallsPerConsumer) })}
        </Typography>
        {attribute && (
          <Tooltip
            arrow
            describeChild
            title={t('attributeTooltip', {
              kind: t(`attributeKind.${attribute.kind}`),
              name: attribute.name,
            })}
          >
            <Chip size="small" color="primary" tabIndex={0} label={t('customizedThreshold')} />
          </Tooltip>
        )}
      </Stack>

      <Typography component="dt" variant="body2">
        {t('approvedCalls')}
      </Typography>
      <Stack component="dd" direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Typography component="span" variant="body2" fontWeight={600}>
          {t('dailyCalls', { value: formatThousands(data.approvedDailyCalls) })}
        </Typography>
        <Chip
          size="small"
          color={getPercentageChipColor(data.percentage)}
          label={t('percentage', { value: formatThousands(data.percentage) })}
          aria-label={t('percentageAriaLabel', { value: formatThousands(data.percentage) })}
        />
      </Stack>
    </Box>
  )
}
