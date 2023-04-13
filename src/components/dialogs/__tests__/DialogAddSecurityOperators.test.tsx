import React from 'react'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { DialogAddSecurityOperators } from '../DialogAddSecurityOperators'
import { vi } from 'vitest'
import { createMockSelfCareUser } from '__mocks__/data/user.mocks'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import userEvent from '@testing-library/user-event'

mockUseJwt()

const operatorsMocks = [
  createMockSelfCareUser({ id: 'id-1', name: 'Operator1', familyName: '' }),
  createMockSelfCareUser({ id: 'id-2', name: 'Operator2', familyName: '' }),
  createMockSelfCareUser({ id: 'id-3', name: 'Operator3', familyName: '' }),
]

const server = setupServer(
  rest.get(`${BACKEND_FOR_FRONTEND_URL}/tenants/:tenantId/relationships`, (req, res, ctx) => {
    return res(ctx.json(operatorsMocks))
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())

const onSubmitFn = vi.fn()

describe('DialogAddSecurityOperators testing', () => {
  it('should match the snapshot', () => {
    const screen = renderWithApplicationContext(
      <DialogAddSecurityOperators
        type="addSecurityOperator"
        excludeOperatorsIdsList={[]}
        onSubmit={onSubmitFn}
      />,
      {
        withReactQueryContext: true,
      }
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should filter out the excluded operators', async () => {
    const screen = renderWithApplicationContext(
      <DialogAddSecurityOperators
        type="addSecurityOperator"
        excludeOperatorsIdsList={['id-1', 'id-2']}
        onSubmit={onSubmitFn}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.queryByRole('option', { name: 'Operator1' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Operator2' })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Operator3' })).toBeInTheDocument()
  })

  it('should call onSubmit with the selected operators', async () => {
    const screen = renderWithApplicationContext(
      <DialogAddSecurityOperators
        type="addSecurityOperator"
        excludeOperatorsIdsList={[]}
        onSubmit={onSubmitFn}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    const openButton = screen.getByRole('button', { name: 'Open' })
    await user.click(openButton)
    await user.click(screen.getByRole('option', { name: 'Operator1' }))
    await user.click(openButton)
    await user.click(screen.getByRole('option', { name: 'Operator2' }))
    await user.click(openButton)
    await user.click(screen.getByRole('option', { name: 'Operator3' }))
    await user.click(screen.getByRole('button', { name: 'actions.confirmLabel' }))

    expect(onSubmitFn).toHaveBeenCalledWith(operatorsMocks)
  })
})
