import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { Trans, useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from './VoucherInstructionsContext'
import { Alert, AlertTitle, Button, Snackbar, Stack, Typography } from '@mui/material'
import { useClientKind } from '@/hooks/useClientKind'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SectionContainer } from '@/components/layout/containers'
import { useNavigate } from '@/router'
import { PurposeQueries } from '@/api/purpose'
import { API_GATEWAY_INTERFACE_URL } from '@/config/env'
import { useQuery } from '@tanstack/react-query'
import DownloadIcon from '@mui/icons-material/Download'

export const VoucherInstructionsStep4: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { selectedPurposeId, goToPreviousStep } = useVoucherInstructionsContext()

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(selectedPurposeId!),
    enabled: Boolean(selectedPurposeId),
  })

  const navigate = useNavigate()
  function handleOnClickEserviceTab() {
    navigate('SUBSCRIBE_CATALOG_VIEW', {
      params: {
        eserviceId: purpose!.eservice.id,
        descriptorId: purpose!.eservice.descriptor.id,
      },
    })
  }

  const eserviceName = purpose ? purpose.eservice.name : ''
  const producer = purpose ? purpose.eservice.producer.name : ''

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
              <Button
                sx={{
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
                disableRipple
                onClick={() => handleOnClickEserviceTab()}
              >
                {t(`step4.${clientKind}.actionLabel`)}
              </Button>
            )}
          </Stack>
        </Stack>
      </SectionContainer>
      {clientKind === 'API' && (
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
                  //href={API_SIGNAL_HUB_PUSH_INTERFACE_URL} //TODO
                  //download
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
                  //href={API_SIGNAL_HUB_PULL_INTERFACE_URL} //TODO
                  //download
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
