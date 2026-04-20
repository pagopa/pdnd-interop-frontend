import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { Trans, useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from './VoucherInstructionsContext'
import { Alert, AlertTitle, Stack, Typography } from '@mui/material'
import { useClientKind } from '@/hooks/useClientKind'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SectionContainer } from '@/components/layout/containers'
import { PurposeQueries } from '@/api/purpose'
import { useQuery } from '@tanstack/react-query'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Link } from '@/router'
import { IconLink } from '@/components/shared/IconLink'
import {
  apiV1DocLink,
  apiV2DocLink,
  apiSignalhubPushLink,
  apiSignalhubPullLink,
} from '@/config/constants'
import { useSearchParams } from 'react-router-dom'

export const VoucherInstructionsDataAccessStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { goToPreviousStep } = useVoucherInstructionsContext()
  const [searchParams] = useSearchParams()

  const purposeId = searchParams.get('purposeId') || ''

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    enabled: Boolean(purposeId),
  })

  const eserviceName = purpose ? purpose.eservice.name : ''
  const producer = purpose ? purpose.eservice.producer.name : ''

  return (
    <>
      <Alert severity="success" variant="outlined">
        <AlertTitle>{t(`dataAccessStep.${clientKind}.title`)}</AlertTitle>
        <Trans>
          {clientKind === 'CONSUMER' && purpose
            ? t(`dataAccessStep.${clientKind}.description`, {
                eserviceName: eserviceName,
                producerName: producer,
              })
            : t(`dataAccessStep.${clientKind}.description`)}
        </Trans>
      </Alert>
      <SectionContainer>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            {t(`dataAccessStep.${clientKind}.actionTitle`)}
          </Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography> {t(`dataAccessStep.${clientKind}.actionDescription`)}</Typography>
            {purpose && clientKind === 'CONSUMER' && (
              <Link
                as="button"
                to={'SUBSCRIBE_CATALOG_VIEW'}
                params={{
                  eserviceId: purpose.eservice.id,
                  descriptorId: purpose.eservice.descriptor.id,
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
                disableRipple
              >
                {t(`dataAccessStep.${clientKind}.actionLabel`)}
              </Link>
            )}
          </Stack>
          {clientKind === 'API' && (
            <>
              <Typography variant="body2" fontWeight={600}>
                {t(`dataAccessStep.API.apiV1.title`)}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="body2">{t(`dataAccessStep.API.apiV1.description`)}</Typography>
                {clientKind === 'API' && (
                  <IconLink
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    href={apiV1DocLink}
                    target="_blank"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t(`dataAccessStep.${clientKind}.actionLabel`)}
                  </IconLink>
                )}
              </Stack>
              <Typography variant="body2" fontWeight={600}>
                {t(`dataAccessStep.API.apiV2.title`)}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="body2">{t(`dataAccessStep.API.apiV2.description`)}</Typography>
                <IconLink
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  href={apiV2DocLink}
                  target="_blank"
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(`dataAccessStep.${clientKind}.actionLabel`)}
                </IconLink>
              </Stack>
            </>
          )}
        </Stack>
      </SectionContainer>
      {clientKind === 'API' && (
        <SectionContainer>
          <Stack spacing={2}>
            <Typography variant="h6" component="h2">
              {t(`dataAccessStep.API.titleSignalHub`)}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {t(`dataAccessStep.API.pushApiSH.title`)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="body2">
                {t(`dataAccessStep.API.pushApiSH.description`)}
              </Typography>
              <IconLink
                endIcon={<OpenInNewIcon fontSize="small" />}
                href={apiSignalhubPushLink}
                target="_blank"
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t(`dataAccessStep.${clientKind}.actionLabel`)}
              </IconLink>
            </Stack>
            <Typography variant="body2" fontWeight={600}>
              {t(`dataAccessStep.API.pullApiSH.title`)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="body2">
                {t(`dataAccessStep.API.pullApiSH.description`)}
              </Typography>
              <IconLink
                endIcon={<OpenInNewIcon fontSize="small" />}
                href={apiSignalhubPullLink}
                target="_blank"
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t(`dataAccessStep.${clientKind}.actionLabel`)}
              </IconLink>
            </Stack>
          </Stack>
        </SectionContainer>
      )}
      <StepActions
        back={{
          label: t('backBtn'),
          type: 'button',
          onClick: goToPreviousStep,
          startIcon: <ArrowBackIcon />,
        }}
      />
    </>
  )
}
