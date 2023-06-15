import React from 'react'
import { DebugVoucherForm } from '../DebugVoucherForm'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { rest } from 'msw'
import { fireEvent, waitFor } from '@testing-library/react'
import {
  createMockDebugVoucherRequest,
  createMockDebugVoucherResultPassed,
} from '__mocks__/data/voucher.mocks'
import type { TokenGenerationValidationResult } from '@/api/api.generatedTypes'

const response = createMockDebugVoucherResultPassed()

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/tools/validateTokenGeneration`, (_, res, ctx) => {
    return res(ctx.json<TokenGenerationValidationResult>(response))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('DebugVoucherForm testing', () => {
  it('should render correclty', () => {
    const screen = renderWithApplicationContext(
      <DebugVoucherForm setDebugVoucherValues={vi.fn()} />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should call the onSuccess function', async () => {
    const setDebugVoucherValuesMockFn = vi.fn()
    const screen = renderWithApplicationContext(
      <DebugVoucherForm setDebugVoucherValues={setDebugVoucherValuesMockFn} />,
      {
        withReactQueryContext: true,
      }
    )

    const clientAssertionInput = screen.getByLabelText('clientAssertionLabel')
    const clientIdInput = screen.getByLabelText('clientIdLabel')
    const submitButton = screen.getByRole('button', { name: 'submitBtn' })

    fireEvent.change(clientAssertionInput, { target: { value: 'test client assertion' } })
    fireEvent.change(clientIdInput, { target: { value: 'test client Id' } })
    fireEvent.click(submitButton)

    const request = createMockDebugVoucherRequest({
      client_id: 'test client Id',
      client_assertion: 'test client assertion',
    })

    await waitFor(() =>
      expect(setDebugVoucherValuesMockFn).toBeCalledWith({
        request: request,
        response: response,
      })
    )
  })

  it('should call the onSuccess function when clientId is not compiled', async () => {
    const setDebugVoucherValuesMockFn = vi.fn()
    const screen = renderWithApplicationContext(
      <DebugVoucherForm setDebugVoucherValues={setDebugVoucherValuesMockFn} />,
      {
        withReactQueryContext: true,
      }
    )

    const clientAssertionInput = screen.getByLabelText('clientAssertionLabel')
    const submitButton = screen.getByRole('button', { name: 'submitBtn' })

    fireEvent.change(clientAssertionInput, { target: { value: 'test client assertion' } })
    fireEvent.click(submitButton)

    const request = createMockDebugVoucherRequest({
      client_id: undefined,
      client_assertion: 'test client assertion',
    })

    await waitFor(() =>
      expect(setDebugVoucherValuesMockFn).toBeCalledWith({
        request: request,
        response: response,
      })
    )
  })
})
