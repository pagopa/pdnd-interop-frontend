import { vi } from 'vitest'
import * as agreementDetailsContext from '../../AgreementDetailsContext'

export function mockAgreementDetailsContext(
  returnValue: Partial<ReturnType<typeof agreementDetailsContext.useAgreementDetailsContext>>
) {
  vi.spyOn(agreementDetailsContext, 'useAgreementDetailsContext').mockReturnValue(
    returnValue as ReturnType<typeof agreementDetailsContext.useAgreementDetailsContext>
  )
}
