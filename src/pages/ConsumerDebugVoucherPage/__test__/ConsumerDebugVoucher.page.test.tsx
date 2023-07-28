import React from 'react'
import ConsumerDebugVoucherPage from '../ConsumerDebugVoucher.page'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { rest } from 'msw'
import { fireEvent, waitFor } from '@testing-library/react'
import type { TokenGenerationValidationResult } from '@/api/api.generatedTypes'

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/tools/validateTokenGeneration`, (_, res, ctx) => {
    return res(
      ctx.json<TokenGenerationValidationResult>({
        clientKind: 'API',
        steps: {
          clientAssertionValidation: {
            result: 'PASSED',
            failures: [],
          },
          publicKeyRetrieve: {
            result: 'PASSED',
            failures: [],
          },
          clientAssertionSignatureVerification: {
            result: 'PASSED',
            failures: [],
          },
          platformStatesVerification: {
            result: 'SKIPPED',
            failures: [],
          },
        },
      })
    )
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('ConsumerDebugVoucherPage testing', () => {
  it('should render correctly when the debugVoucherValues are undefined', () => {
    const screen = renderWithApplicationContext(<ConsumerDebugVoucherPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should render correctly when the debugVoucherValues are defined', async () => {
    const screen = renderWithApplicationContext(<ConsumerDebugVoucherPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const clientAssertionInput = screen.getByLabelText('clientAssertionLabel')
    const clientIdInput = screen.getByLabelText('clientIdLabel')
    const submitButton = screen.getByRole('button', { name: 'submitBtn' })

    fireEvent.change(clientAssertionInput, { target: { value: 'test client assertion' } })
    fireEvent.change(clientIdInput, { target: { value: 'test client Id' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'newRequestBtn' })).toBeInTheDocument()

      expect(screen.baseElement).toMatchSnapshot()
    })
  })

  it('should render correctly when resetting to make new request', async () => {
    const screen = renderWithApplicationContext(<ConsumerDebugVoucherPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const clientAssertionInput = screen.getByLabelText('clientAssertionLabel')
    const clientIdInput = screen.getByLabelText('clientIdLabel')
    const submitButton = screen.getByRole('button', { name: 'submitBtn' })

    fireEvent.change(clientAssertionInput, { target: { value: 'test client assertion' } })
    fireEvent.change(clientIdInput, { target: { value: 'test client Id' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      const newRequestButton = screen.getByRole('button', { name: 'newRequestBtn' })

      fireEvent.click(newRequestButton)
    })

    expect(screen.getByLabelText('clientIdLabel')).toBeInTheDocument()
  })
})
