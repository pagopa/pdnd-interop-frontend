import type { StepperStepComponentProps } from '@/types/common.types'
import type { PublicKeys } from '@/types/key.types'
import type { DecoratedPurpose } from '@/types/purpose.types'

export type VoucherInstructionsStepProps = StepperStepComponentProps & {
  clientId: string
  clientKeys: PublicKeys
  purpose?: DecoratedPurpose
  purposeId?: string
}
