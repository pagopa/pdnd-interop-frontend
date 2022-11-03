import { ClientKind } from '@/types/client.types'
import { StepperStepComponentProps } from '@/types/common.types'
import { PublicKeys } from '@/types/key.types'
import { DecoratedPurpose } from '@/types/purpose.types'

export type VoucherInstructionsStepProps = StepperStepComponentProps & {
  clientId: string
  clientKeys: PublicKeys
  purpose?: DecoratedPurpose
  purposeId?: string
}
