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
} from '@/../__mocks__/data/voucher.mocks'
import type { TokenGenerationValidationResult } from '@/api/api.generatedTypes'
import { VoucherMutations } from '@/api/voucher'

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
  it('should call the onSuccess function', async () => {
    const setDebugVoucherValuesMockFn = vi.fn()
    const screen = renderWithApplicationContext(
      <DebugVoucherForm setDebugVoucherValues={setDebugVoucherValuesMockFn} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const clientAssertionInput = screen.getByRole('textbox', {
      name: 'clientAssertionLabel',
    })
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
        withRouterContext: true,
      }
    )

    const clientAssertionInput = screen.getByRole('textbox', {
      name: 'clientAssertionLabel',
    })
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

  it('should call both APIs and merge responses when dPopProof is provided', async () => {
    const setDebugVoucherValuesMockFn = vi.fn()

    const tokenResponse = createMockDebugVoucherResultPassed()

    const dpopResponse = createMockDebugVoucherResultPassed()

    const validateVoucherMock = vi.fn().mockResolvedValue(tokenResponse)
    const validateDPoPMock = vi.fn().mockResolvedValue(dpopResponse)

    vi.spyOn(VoucherMutations, 'useValidateTokenGeneration').mockReturnValue({
      mutateAsync: validateVoucherMock,
    } as never)

    vi.spyOn(VoucherMutations, 'useValidateDPoPProof').mockReturnValue({
      mutateAsync: validateDPoPMock,
    } as never)

    const screen = renderWithApplicationContext(
      <DebugVoucherForm setDebugVoucherValues={setDebugVoucherValuesMockFn} />,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    const clientAssertionInput = await screen.findByRole('textbox', {
      name: 'clientAssertionLabel',
    })

    const dpopInput = await screen.findByRole('textbox', {
      name: 'dPopProofLabel',
    })

    const submitButton = screen.getByRole('button', { name: 'submitBtn' })

    fireEvent.change(clientAssertionInput, {
      target: { value: 'test client assertion' },
    })

    fireEvent.change(dpopInput, {
      target: { value: 'test dpop proof' },
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(validateVoucherMock).toHaveBeenCalledTimes(1)
      expect(validateDPoPMock).toHaveBeenCalledTimes(1)
    })

    expect(setDebugVoucherValuesMockFn).toHaveBeenCalledWith({
      request: expect.objectContaining({
        client_assertion: 'test client assertion',
      }),
      response: {
        steps: {
          ...tokenResponse.steps,
          ...dpopResponse.steps,
        },
      },
    })
  })
})
