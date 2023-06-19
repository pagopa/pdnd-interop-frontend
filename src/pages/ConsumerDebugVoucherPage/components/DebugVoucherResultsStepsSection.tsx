import React from 'react'
import { useTranslation } from 'react-i18next'
import { DebugVoucherResultsStep } from './DebugVoucherResultsStep'
import { SectionContainer } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { useDebugVoucherContext } from '../DebugVoucherContext'

export const DebugVoucherResultsStepsSection: React.FC = () => {
  const { t } = useTranslation('voucher', { keyPrefix: 'consumerDebugVoucher.result.stepSection' })

  const { response } = useDebugVoucherContext()

  return (
    <SectionContainer title={t('title')}>
      <Stack spacing={2}>
        <DebugVoucherResultsStep
          step={response.steps.clientAssertionValidation}
          stepKey="clientAssertionValidation"
        />
        <DebugVoucherResultsStep
          step={response.steps.publicKeyRetrieve}
          stepKey="publicKeyRetrieve"
        />
        <DebugVoucherResultsStep
          step={response.steps.clientAssertionSignatureVerification}
          stepKey="clientAssertionSignatureVerification"
        />
        {response.clientKind === 'CONSUMER' && (
          <DebugVoucherResultsStep
            step={response.steps.platformStatesVerification}
            stepKey="platformStatesVerification"
          />
        )}
      </Stack>
    </SectionContainer>
  )
}
