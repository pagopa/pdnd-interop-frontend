import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from './VoucherInstructionsContext'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Button, Stack, Typography } from '@mui/material'
import { useClientKind } from '@/hooks/useClientKind'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SectionContainer } from '@/components/layout/containers'
import { useNavigate } from '@/router'
import { PurposeQueries } from '@/api/purpose'

export const VoucherInstructionsStep4: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const { selectedPurposeId, goToPreviousStep } = useVoucherInstructionsContext()
  const navigate = useNavigate()

  const { data: purpose } = PurposeQueries.useGetSingle(selectedPurposeId!, {
    enabled: !!selectedPurposeId,
    suspense: false,
  })

  const handleAction = () => {
    if (!purpose) return

    if (clientKind === 'CONSUMER')
      navigate('SUBSCRIBE_CATALOG_VIEW', {
        params: {
          eserviceId: purpose.eservice.id,
          descriptorId: purpose.eservice.descriptor.id,
        },
      })

    if (clientKind === 'API') console.log('TODO')
  }

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
          <Button onClick={handleAction} variant="contained" color="primary">
            {t(`step4.${clientKind}.actionLabel`)}
          </Button>
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
