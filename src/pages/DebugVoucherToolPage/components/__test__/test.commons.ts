import { vi } from 'vitest'
import * as debugVoucherContext from '../../DebugVoucherContext'

export function mockDebugVoucherContext(
  returnValue: Partial<ReturnType<typeof debugVoucherContext.useDebugVoucherContext>>
) {
  vi.spyOn(debugVoucherContext, 'useDebugVoucherContext').mockReturnValue(
    returnValue as ReturnType<typeof debugVoucherContext.useDebugVoucherContext>
  )
}
