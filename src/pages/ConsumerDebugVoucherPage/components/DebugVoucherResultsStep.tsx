import React from 'react'
import type {
  TokenGenerationValidationEntry,
  TokenGenerationValidationSteps,
} from '../types/debug-voucher.types'
import { Chip, Stack, Typography } from '@mui/material'
import RightArrowIcon from '@mui/icons-material/ChevronRight'
import { useDebugVoucherContext } from '../DebugVoucherContext'
import { useTranslation } from 'react-i18next'
import { useGetDebugVoucherResultChipProps } from '../hooks/useGetDebugVoucherResultChipProps'

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
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      flex={1}
      border={1}
      borderColor={'background.default'}
      borderRadius="4px"
      p={2}
      onClick={handleClick}
    >
      <Typography component={'span'} variant="body1" fontWeight={600}>
        {t(`label.${stepKey}`)}
      </Typography>
      <Stack direction="row" justifyContent="end" spacing={2}>
        {chipProps && <Chip size="small" label={chipProps.label} color={chipProps.color} />}
        <RightArrowIcon />
      </Stack>
    </Stack>
  )
}
