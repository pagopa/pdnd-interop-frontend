import { vi } from 'vitest'
import * as debugVoucherContext from '../../DebugVoucherContext'

export function mockDebugVoucherContext(
  returnValue: Partial<ReturnType<typeof debugVoucherContext.useDebugVoucherContext>>
) {
  const response = returnValue.response

  vi.spyOn(debugVoucherContext, 'useDebugVoucherContext').mockReturnValue({
    ...(returnValue as ReturnType<typeof debugVoucherContext.useDebugVoucherContext>),
    stepOrder: [
      'clientAssertionValidation',
      'publicKeyRetrieve',
      'clientAssertionSignatureVerification',
      ...(response?.clientKind === 'CONSUMER' ? ['platformStatesVerification' as const] : []),
      ...(response?.steps?.dpopValidation ? ['dpopValidation' as const] : []),
    ],
  })
}
