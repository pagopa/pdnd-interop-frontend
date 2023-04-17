import { vi } from 'vitest'
import * as eServiceDetailsContext from '../../EServiceDetailsContext'

export function mockEServiceDetailsContext(
  returnValue: Partial<ReturnType<typeof eServiceDetailsContext.useEServiceDetailsContext>>
) {
  vi.spyOn(eServiceDetailsContext, 'useEServiceDetailsContext').mockReturnValue(
    returnValue as ReturnType<typeof eServiceDetailsContext.useEServiceDetailsContext>
  )
}
