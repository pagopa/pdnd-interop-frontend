import React from 'react'
import { Button, Chip, Stack, Typography } from '@mui/material'
import RightArrowIcon from '@mui/icons-material/ChevronRight'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import { useTranslation } from 'react-i18next'
import { useGetDebugVoucherResultChipProps } from '../hooks/useGetDebugVoucherResultChipProps'
import type {
  TokenGenerationValidationEntry,
  TokenGenerationValidationSteps,
} from '@/api/api.generatedTypes'

type ResultStepProps = {
  step: TokenGenerationValidationEntry
  stepKey: keyof TokenGenerationValidationSteps
}

export const DebugVoucherResultsStep: React.FC<ResultStepProps> = ({ step, stepKey }) => {
  const { t } = useTranslation('voucher', {
    keyPrefix: 'consumerDebugVoucher.result.stepSection.step',
  })

  const chipProps = useGetDebugVoucherResultChipProps(step)

  const { setDebugVoucherStepDrawer } = useDebugVoucherContext()

  const handleClick = () => {
    setDebugVoucherStepDrawer({ isOpen: true, selectedStep: [stepKey, step] })
  }

  return (
    <Button
      variant="naked"
      sx={{
        border: 1,
        borderColor: 'background.default',
        borderRadius: '4px',
        p: 2,
        justifyContent: 'space-between',
      }}
      onClick={handleClick}
    >
      <Typography component={'span'} variant="body1" fontWeight={600}>
        {t(`label.${stepKey}`)}
      </Typography>
      <Stack direction="row" justifyContent="end" spacing={2}>
        {chipProps && <Chip size="small" label={chipProps.label} color={chipProps.color} />}
        <RightArrowIcon />
      </Stack>
    </Button>
  )
}
