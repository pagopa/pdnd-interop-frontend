import { useTranslation } from 'react-i18next'
import { VoucherInstructionsStep1 } from '../components/VoucherTokenInstructions/VoucherInstructionsStep1'
import { VoucherInstructionsStep2 } from '../components/VoucherTokenInstructions/VoucherInstructionsStep2'
import { VoucherInstructionsStep3 } from '../components/VoucherTokenInstructions/VoucherInstructionsStep3'
import { useClientKind } from './useClientKind'

export function useGetVoucherInstructionsSteps() {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()

  return [
    { label: t('step1.stepperLabel'), component: VoucherInstructionsStep1 },
    { label: t('step2.stepperLabel'), component: VoucherInstructionsStep2 },
    {
      label: t(`step3.${clientKind === 'CONSUMER' ? 'consumerStepperLabel' : 'apiStepperLabel'}`),
      component: VoucherInstructionsStep3,
    },
  ]
}
