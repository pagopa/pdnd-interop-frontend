import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactElement, ReactNode } from 'react'
import { render as rtlRender, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import * as router from '@/router'
import { mockUseJwt } from '@/utils/testing.utils'
import { DashboardEServiceAction } from '../DashboardEServiceAction'

const navigateMock = vi.fn()
const render = (ui: ReactElement) =>
  rtlRender(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    ),
  })

const baseProps = {
  eserviceId: 'es-1',
  versionAriaLabel: 'View version 1 of Service',
}

describe('DashboardEServiceAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseJwt({ currentRoles: ['admin'] })
    vi.spyOn(router, 'useNavigate').mockReturnValue(navigateMock)
  })

  it('navigates to the version detail using descriptorId alone', async () => {
    render(<DashboardEServiceAction {...baseProps} descriptorId="desc-1" listLabel="List" />)

    const user = userEvent.setup()
    const action = screen.getByRole('button', { name: 'View version 1 of Service' })
    expect(action).toHaveTextContent(/^$/)
    expect(within(action).getByTestId('ChevronRightIcon')).toHaveAttribute('aria-hidden', 'true')
    expect(action.children).toHaveLength(1)
    expect(screen.queryByText('View version')).not.toBeInTheDocument()
    await user.tab()
    expect(action).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(screen.queryByRole('button', { name: 'List' })).not.toBeInTheDocument()
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_ESERVICE_MANAGE', {
      params: { eserviceId: 'es-1', descriptorId: 'desc-1' },
    })
  })

  it('falls back to the list and uses the label as accessible name when no aria label', async () => {
    render(<DashboardEServiceAction {...baseProps} listLabel="Go to list" />)

    const action = screen.getByRole('button', { name: 'Go to list' })
    expect(action).toHaveTextContent(/^$/)
    expect(within(action).getByTestId('ChevronRightIcon')).toBeInTheDocument()
    expect(action.children).toHaveLength(1)
    await userEvent.click(action)
    expect(navigateMock).toHaveBeenCalledExactlyOnceWith('PROVIDE_ESERVICE_LIST')
  })

  it.each([undefined, ''])(
    'renders nothing without a descriptor or list label (descriptorId=%j)',
    (descriptorId) => {
      const { container } = render(
        <DashboardEServiceAction {...baseProps} descriptorId={descriptorId} />
      )
      expect(container).toBeEmptyDOMElement()
    }
  )

  it.each([[[]], [['reviewer']]] as const)(
    'renders nothing for roles %j without access to either destination',
    (roles) => {
      mockUseJwt({ currentRoles: [...roles] })
      const { rerender, container } = render(
        <DashboardEServiceAction {...baseProps} descriptorId="desc-1" />
      )
      expect(container).toBeEmptyDOMElement()
      rerender(<DashboardEServiceAction {...baseProps} listLabel="Go to list" />)
      expect(container).toBeEmptyDOMElement()
    }
  )

  it.each(['security', 'viewer', 'support', 'api'] as const)(
    'allows the %s role to reach both destinations',
    (role) => {
      mockUseJwt({ currentRoles: [role] })
      const { rerender } = render(<DashboardEServiceAction {...baseProps} descriptorId="d" />)
      expect(screen.getByRole('button', { name: 'View version 1 of Service' })).toBeInTheDocument()
      rerender(<DashboardEServiceAction {...baseProps} listLabel="Go to list" />)
      expect(screen.getByRole('button', { name: 'Go to list' })).toBeInTheDocument()
    }
  )
})
