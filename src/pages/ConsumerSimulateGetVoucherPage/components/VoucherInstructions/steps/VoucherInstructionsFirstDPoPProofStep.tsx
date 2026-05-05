import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export const VoucherInstructionsFirstDPoPProofStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { goToPreviousStep, goToNextStep } = useVoucherInstructionsContext()
  return (
    <>
      <StepActions
        back={{
          label: t('backBtn'),
          type: 'button',
          onClick: goToPreviousStep,
          startIcon: <ArrowBackIcon />,
        }}
        forward={{
          label: t('proceedBtn'),
          type: 'button',
          onClick: goToNextStep,
          endIcon: <ArrowForwardIcon />,
        }}
      />
    </>
  )
}
