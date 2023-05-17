import React from 'react'
import { DialogSessionExpired } from '../DialogSessionExpired'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import * as router from '@/router'
import userEvent from '@testing-library/user-event'

const mockFn = vi.fn()

vi.spyOn(router, 'useNavigate').mockReturnValue(mockFn)

afterEach(() => {
  mockFn.mockClear()
})

describe('DialogSessionExpired testing', () => {
  it('should match the snapshot', () => {
    const screen = render(<DialogSessionExpired type="sessionExpired" />)
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should call navigate when click button', async () => {
    const screen = render(<DialogSessionExpired type="sessionExpired" />)
    const button = screen.getByRole('button', { name: 'actions.exitLabel' })
    const user = userEvent.setup()
    await user.click(button)
    expect(mockFn).toHaveBeenCalledWith('LOGOUT')
  })

  it('should call navigate after timeout', async () => {
    vi.useFakeTimers()
    render(<DialogSessionExpired type="sessionExpired" />)
    vi.advanceTimersByTime(2500)
    expect(mockFn).toHaveBeenCalledWith('LOGOUT')
  })
})
