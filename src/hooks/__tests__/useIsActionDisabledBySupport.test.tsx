import { renderHook } from '@testing-library/react'
import React from 'react'
import {
  SupportActionGuardProvider,
  useIsActionDisabledBySupport,
} from '../useIsActionDisabledBySupport'

describe('useIsActionDisabledBySupport', () => {
  it.each([true, false, undefined])(
    'should return the incoming disabled value when the user is not support',
    (disabled) => {
      const { result } = renderHook(() => useIsActionDisabledBySupport(disabled), {
        wrapper: ({ children }) => (
          <SupportActionGuardProvider isSupport={false}>{children}</SupportActionGuardProvider>
        ),
      })

      expect(result.current).toBe(disabled)
    }
  )

  it.each([true, false, undefined])(
    'should force the action disabled when the user is support',
    (disabled) => {
      const { result } = renderHook(() => useIsActionDisabledBySupport(disabled), {
        wrapper: ({ children }) => (
          <SupportActionGuardProvider isSupport>{children}</SupportActionGuardProvider>
        ),
      })

      expect(result.current).toBe(true)
    }
  )
})
