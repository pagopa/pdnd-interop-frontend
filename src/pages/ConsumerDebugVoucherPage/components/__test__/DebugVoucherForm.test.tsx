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

const response = createMockDebugVoucherResultPassed()
const validateTokenGenerationHandler = vi.fn()

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/tools/validateTokenGeneration`, (req, res, ctx) => {
    validateTokenGenerationHandler(req.body)
    return res(ctx.json<TokenGenerationValidationResult>(response))
  })
)

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  validateTokenGenerationHandler.mockClear()
})
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
    fireEvent.change(clientIdInput, { target: { value: '51c081d3-4bb3-4d6f-8889-8b7fe2ad7113' } })
    fireEvent.click(submitButton)

    const request = createMockDebugVoucherRequest({
      client_id: '51c081d3-4bb3-4d6f-8889-8b7fe2ad7113',
      client_assertion: 'test client assertion',
      is_async: 'false',
    })

    await waitFor(() =>
      expect(setDebugVoucherValuesMockFn).toBeCalledWith({
        request: request,
        response: response,
      })
    )
  })

  it('should show a validation error and not submit when clientId is not a valid UUID', async () => {
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
    fireEvent.change(clientIdInput, { target: { value: 'not-a-uuid' } })
    fireEvent.click(submitButton)

    expect(await screen.findByText('clientIdValidationError')).toBeInTheDocument()
    expect(validateTokenGenerationHandler).not.toHaveBeenCalled()
    expect(setDebugVoucherValuesMockFn).not.toHaveBeenCalled()
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
      is_async: 'false',
    })

    await waitFor(() =>
      expect(setDebugVoucherValuesMockFn).toBeCalledWith({
        request: request,
        response: response,
      })
    )
  })

  it('should include dpop_proof when user provides it', async () => {
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

    const dpopInput = screen.getByRole('textbox', {
      name: 'dpopProofLabel',
    })

    const submitButton = screen.getByRole('button', { name: 'submitBtn' })

    fireEvent.change(clientAssertionInput, {
      target: { value: 'test client assertion' },
    })

    fireEvent.change(dpopInput, {
      target: { value: 'test dpop proof' },
    })

    fireEvent.click(submitButton)

    const request = createMockDebugVoucherRequest({
      client_id: undefined,
      dpop_proof: 'test dpop proof',
      client_assertion: 'test client assertion',
      is_async: 'false',
    })

    await waitFor(() =>
      expect(setDebugVoucherValuesMockFn).toBeCalledWith({
        request: request,
        response: response,
      })
    )
  })

  it('should send dpop_proof as undefined when empty', async () => {
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

    fireEvent.change(clientAssertionInput, {
      target: { value: 'test client assertion' },
    })

    fireEvent.click(submitButton)

    const request = createMockDebugVoucherRequest({
      client_assertion: 'test client assertion',
      client_id: undefined,
      is_async: 'false',
    })

    await waitFor(() =>
      expect(setDebugVoucherValuesMockFn).toBeCalledWith({
        request: request,
        response: response,
      })
    )
  })

  it('should send is_async as true when async interaction type is selected', async () => {
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

    fireEvent.change(clientAssertionInput, {
      target: { value: 'test client assertion' },
    })

    const asyncRadio = screen.getByRole('radio', {
      name: 'interactionModelAsync',
    })

    fireEvent.click(asyncRadio)

    const submitButton = screen.getByRole('button', { name: 'submitBtn' })

    fireEvent.click(submitButton)

    const request = createMockDebugVoucherRequest({
      client_assertion: 'test client assertion',
      client_id: undefined,
      is_async: 'true',
    })

    await waitFor(() =>
      expect(setDebugVoucherValuesMockFn).toBeCalledWith({
        request,
        response,
      })
    )
  })
})
