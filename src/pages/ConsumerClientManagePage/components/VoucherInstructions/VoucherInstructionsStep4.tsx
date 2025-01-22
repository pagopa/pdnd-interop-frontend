import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { Trans, useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from './VoucherInstructionsContext'
import { Alert, AlertTitle, Button, Stack, Typography } from '@mui/material'
import { useClientKind } from '@/hooks/useClientKind'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SectionContainer } from '@/components/layout/containers'
import { PurposeQueries } from '@/api/purpose'
import {
  API_GATEWAY_INTERFACE_URL,
  API_SIGNAL_HUB_PULL_INTERFACE_URL,
  API_SIGNAL_HUB_PUSH_INTERFACE_URL,
  isSignalHubEnabled,
  SIGNALHUB_WHITELIST,
  STAGE,
} from '@/config/env'
import { useQuery } from '@tanstack/react-query'
import DownloadIcon from '@mui/icons-material/Download'
import { Link } from '@/router'
import { AuthHooks } from '@/api/auth'

export const VoucherInstructionsStep4: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { selectedPurposeId, goToPreviousStep } = useVoucherInstructionsContext()

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(selectedPurposeId!),
    enabled: Boolean(selectedPurposeId),
  })

  const eserviceName = purpose ? purpose.eservice.name : ''
  const producer = purpose ? purpose.eservice.producer.name : ''

  const isProducerInSHWhitelist = //TEMP
    STAGE === 'ATT' // if the current stage is ATT, all tenants have visibility of the signal hub section
      ? true
      : SIGNALHUB_WHITELIST.includes(
          //only tenants on the whitelist are granted access to the Signal Hub section
          AuthHooks.useJwt().jwt?.organizationId as string
        )

  return (
    <>
      <Alert severity="success" variant="outlined">
        <AlertTitle>{t(`step4.${clientKind}.title`)}</AlertTitle>
        <Trans>
          {clientKind === 'CONSUMER' && purpose
            ? t(`step4.${clientKind}.description`, {
                eserviceName: eserviceName,
                producerName: producer,
              })
            : t(`step4.${clientKind}.description`)}
        </Trans>
      </Alert>
      <SectionContainer>
        <Stack spacing={2}>
          <Typography variant="h6" component="h2">
            {t(`step4.${clientKind}.actionTitle`)}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Typography variant="body2">{t(`step4.${clientKind}.actionDescription`)}</Typography>
            {clientKind === 'API' && (
              <Button
                sx={{
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
                disableRipple
                href={API_GATEWAY_INTERFACE_URL}
                download
              >
                <DownloadIcon fontSize="small" />
                {t(`step4.${clientKind}.actionLabel`)}
              </Button>
            )}
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
                {t(`step4.${clientKind}.actionLabel`)}
              </Link>
            )}
          </Stack>
        </Stack>
      </SectionContainer>
      {clientKind === 'API' && isProducerInSHWhitelist && isSignalHubEnabled && (
        <SectionContainer>
          <Stack spacing={2}>
            <Typography variant="h6" component="h2">
              {t(`step4.API.titleSignalHub`)}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {t(`step4.API.pushApiSH.title`)}
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="body2">{t(`step4.API.pushApiSH.description`)}</Typography>
                <Button
                  sx={{
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                  }}
                  disableRipple
                  href={API_SIGNAL_HUB_PUSH_INTERFACE_URL}
                  download
                >
                  <DownloadIcon fontSize="small" />
                  {t(`step4.actionLabel`)}
                </Button>
              </Stack>
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {t(`step4.API.pullApiSH.title`)}
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="body2">{t(`step4.API.pullApiSH.description`)}</Typography>
                <Button
                  sx={{
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                  }}
                  disableRipple
                  href={API_SIGNAL_HUB_PULL_INTERFACE_URL}
                  download
                >
                  <DownloadIcon fontSize="small" />
                  {t(`step4.actionLabel`)}
                </Button>
              </Stack>
            </Typography>
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
