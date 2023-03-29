import type { PublicKeys, Purpose } from '@/api/api.generatedTypes'
import type { StepperStepComponentProps } from '@/types/common.types'

export type VoucherInstructionsStepProps = StepperStepComponentProps & {
  clientId: string
  clientKeys: PublicKeys
  purpose?: Purpose
  purposeId?: string
}
