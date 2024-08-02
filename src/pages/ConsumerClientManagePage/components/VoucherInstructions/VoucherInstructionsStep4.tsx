import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from './VoucherInstructionsContext'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Button, Stack, Typography } from '@mui/material'
import { useClientKind } from '@/hooks/useClientKind'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SectionContainer } from '@/components/layout/containers'
import { Link } from '@/router'
import { PurposeQueries } from '@/api/purpose'
import { API_GATEWAY_INTEFACE_URL } from '@/config/env'
import { useQuery } from '@tanstack/react-query'

export const VoucherInstructionsStep4: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { selectedPurposeId, goToPreviousStep } = useVoucherInstructionsContext()

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(selectedPurposeId!),
    enabled: Boolean(selectedPurposeId),
  })

  return (
    <>
      <SectionContainer>
        <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
          <Stack alignItems="center" spacing={1}>
            <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 80 }} />
            <Typography variant="h6" component="h2">
              {t(`step4.${clientKind}.title`)}
            </Typography>
            <Typography variant="body2">{t(`step4.${clientKind}.description`)}</Typography>
          </Stack>
          {purpose && clientKind === 'CONSUMER' && (
            <Link
              to="SUBSCRIBE_CATALOG_VIEW"
              params={{
                eserviceId: purpose.eservice.id,
                descriptorId: purpose.eservice.descriptor.id,
              }}
              as="button"
              variant="contained"
              color="primary"
            >
              {t(`step4.${clientKind}.actionLabel`)}
            </Link>
          )}
          {clientKind === 'API' && (
            <Button href={API_GATEWAY_INTEFACE_URL} download variant="contained" color="primary">
              {t(`step4.${clientKind}.actionLabel`)}
            </Button>
          )}
        </Stack>
      </SectionContainer>
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
