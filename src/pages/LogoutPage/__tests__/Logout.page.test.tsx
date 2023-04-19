import React from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import LogoutPage from '../Logout.page'
import { FE_LOGIN_URL } from '@/config/env'

const assignFn = vi.fn()

describe('LogoutPage', () => {
  it('should navigate to the login url', () => {
    Object.defineProperty(window, 'location', {
      value: {
        assign: assignFn,
      },
    })
    render(<LogoutPage />)
    expect(assignFn).toHaveBeenCalledWith(FE_LOGIN_URL)
  })
})
