import React from 'react'
import { render } from '@testing-library/react'
import {
  ClientAddPublicKeyButton,
  ClientAddPublicKeyButtonSkeleton,
} from '../ClientAddPublicKeyButton'
import { vi } from 'vitest'
import { ClientQueries } from '@/api/client'
import { createMockSelfCareUser } from '__mocks__/data/user.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'

vi.spyOn(ClientQueries, 'useGetOperatorsList').mockReturnValue({
  data: [],
} as unknown as ReturnType<typeof ClientQueries.useGetOperatorsList>)

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    ...actual,
    useQueries: () => [{ data: createMockSelfCareUser({ from: 'from-id' }) }],
  }
})

describe('ClientAddPublicKeyButton', () => {
  it('should be disabled and render a tooltip when the user is an admin but it is not in the client', async () => {
    const screen = render(<ClientAddPublicKeyButton clientId="clientId" />)
    const button = screen.getByRole('button', { name: 'addBtn' })
    expect(button).toBeDisabled()
    expect(screen.getByTestId('InfoIcon')).toBeInTheDocument()
  })

  it('should be admin if the user is an admin and it is in the client', async () => {
    mockUseJwt({ isOperatorSecurity: false, isAdmin: true, jwt: { uid: 'from-id' } })
    const screen = render(<ClientAddPublicKeyButton clientId="clientId" />)
    const button = screen.getByRole('button', { name: 'addBtn' })
    expect(button).toBeEnabled()
    expect(screen.queryByTestId('InfoIcon')).not.toBeInTheDocument()
  })

  it('should be active if user is a security operator', async () => {
    mockUseJwt({ isOperatorSecurity: true, isAdmin: false })
    const screen = render(<ClientAddPublicKeyButton clientId="clientId" />)
    const button = screen.getByRole('button', { name: 'addBtn' })
    expect(button).toBeEnabled()
  })

  it('should open the dialog when the button is clicked', async () => {
    mockUseJwt({ isOperatorSecurity: true, isAdmin: false })
    const screen = renderWithApplicationContext(<ClientAddPublicKeyButton clientId="clientId" />, {
      withDialogContext: true,
    })
    const button = screen.getByRole('button', { name: 'addBtn' })
    const user = userEvent.setup()
    await user.click(button)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

describe('ClientAddPublicKeyButtonSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<ClientAddPublicKeyButtonSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
