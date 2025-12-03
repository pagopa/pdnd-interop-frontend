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
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography> {t(`step4.${clientKind}.actionDescription`)}</Typography>
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
          {clientKind === 'API' && (
            <>
              <Typography variant="body2" fontWeight={600}>
                {t(`step4.API.apiV1.title`)}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="body2">{t(`step4.API.apiV1.description`)}</Typography>
                {clientKind === 'API' && (
                  <IconLink
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    href="https://developer.pagopa.it/pdnd-interoperabilita/guides/manuale-operativo-pdnd-interoperabilita/v1.0/riferimenti-tecnici/utilizzare-i-voucher"
                    target="_blank"
                    sx={{
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t(`step4.${clientKind}.actionLabel`)}
                  </IconLink>
                )}
              </Stack>
              <Typography variant="body2" fontWeight={600}>
                {t(`step4.API.apiV2.title`)}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant="body2">{t(`step4.API.apiV2.description`)}</Typography>
                <IconLink
                  endIcon={<OpenInNewIcon fontSize="small" />}
                  href="https://developer.pagopa.it/pdnd-interoperabilita/api/pdnd-core-v2#/"
                  target="_blank"
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t(`step4.${clientKind}.actionLabel`)}
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
              {t(`step4.API.titleSignalHub`)}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {t(`step4.API.pushApiSH.title`)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="body2">{t(`step4.API.pushApiSH.description`)}</Typography>
              <IconLink
                endIcon={<OpenInNewIcon fontSize="small" />}
                href="https://developer.pagopa.it/pdnd-interoperabilita/api/signal-hub-push-v1#/"
                target="_blank"
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t(`step4.${clientKind}.actionLabel`)}
              </IconLink>
            </Stack>
            <Typography variant="body2" fontWeight={600}>
              {t(`step4.API.pullApiSH.title`)}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
              <Typography variant="body2">{t(`step4.API.pullApiSH.description`)}</Typography>
              <IconLink
                endIcon={<OpenInNewIcon fontSize="small" />}
                href="https://developer.pagopa.it/pdnd-interoperabilita/api/signal-hub-pull-v1#/"
                target="_blank"
                sx={{
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t(`step4.${clientKind}.actionLabel`)}
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
