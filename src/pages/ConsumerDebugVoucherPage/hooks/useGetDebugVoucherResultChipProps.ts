import { useTranslation } from 'react-i18next'
import type { TokenGenerationValidationEntry } from '../types/debug-voucher.types'
import type { ChipProps } from '@mui/material'

export function useGetDebugVoucherResultChipProps(
  step?: TokenGenerationValidationEntry
): ChipProps | undefined {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result' })

  if (!step) {
    return
  }

  if (step.result === 'PASSED') {
    return {
      label: t('chipLabel.passed'),
      color: 'success',
    }
  }

  if (step.result === 'SKIPPED') {
    return {
      label: t('chipLabel.skipped'),
      color: 'warning',
    }
  }

  if (step.result === 'FAILED') {
    return {
      label: t('chipLabel.failed', {
        count: step.failures.length,
      }),
      color: 'error',
    }
  }

  throw new Error('Unknown step result:', step.result)
}
