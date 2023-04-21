import React from 'react'
import { AgreementQueries } from '@/api/agreement'
import type { Agreement } from '@/api/api.generatedTypes'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import {
  mockUseCurrentRoute,
  mockUseRouteParams,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { vi } from 'vitest'
import ConsumerAgreementCreatePage from '../ConsumerAgreementCreate.page'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as useCanUserSubmitAgreementDraft from '../hooks/useCanUserSubmitAgreementDraft'

const mockUseGetSingle = (agreement: Agreement | undefined, isInitialLoading = false) => {
  vi.spyOn(AgreementQueries, 'useGetSingle').mockReturnValue({
    data: agreement,
    isInitialLoading,
  } as unknown as ReturnType<typeof AgreementQueries.useGetSingle>)
}

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId/submit`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId/update`, (req, res, ctx) => {
    return res(ctx.status(200))
  }),
  rest.delete(`${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId`, (req, res, ctx) => {
    return res(ctx.status(200))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

mockUseRouteParams({ agreementId: 'agreementId' })
mockUseCurrentRoute({ mode: 'consumer' })

describe('ConsumerAgreementCreatePage', () => {
  it('should match the snapshot', async () => {
    mockUseGetSingle(createMockAgreement())
    const screen = renderWithApplicationContext(<ConsumerAgreementCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match the snapshot while initial loading', async () => {
    mockUseGetSingle(undefined, true)
    const screen = renderWithApplicationContext(<ConsumerAgreementCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should correctly navigate to SUBSCRIBE_AGREEMENT_LIST on submit agreement draft success', async () => {
    mockUseGetSingle(createMockAgreement())
    vi.spyOn(useCanUserSubmitAgreementDraft, 'useCanUserSubmitAgreementDraft').mockReturnValue(true)
    const screen = renderWithApplicationContext(<ConsumerAgreementCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'edit.bottomPageActionCard.submitBtn' }))
    await user.click(screen.getByRole('button', { name: 'confirm' }))
    await waitFor(() => {
      expect(screen.history.location.pathname).toBe('/it/fruizione/richieste')
    })
  })

  it('should correctly navigate to SUBSCRIBE_AGREEMENT_LIST on submit agreement delete success', async () => {
    mockUseGetSingle(createMockAgreement())
    vi.spyOn(useCanUserSubmitAgreementDraft, 'useCanUserSubmitAgreementDraft').mockReturnValue(true)
    const screen = renderWithApplicationContext(<ConsumerAgreementCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'edit.bottomPageActionCard.cancelBtn' }))
    await user.click(screen.getByRole('button', { name: 'confirm' }))
    await waitFor(() => {
      expect(screen.history.location.pathname).toBe('/it/fruizione/richieste')
    })
  })

  it('should correctly navigate to SUBSCRIBE_AGREEMENT_LIST on submit agreement update success', async () => {
    mockUseGetSingle(createMockAgreement())
    vi.spyOn(useCanUserSubmitAgreementDraft, 'useCanUserSubmitAgreementDraft').mockReturnValue(true)
    const screen = renderWithApplicationContext(<ConsumerAgreementCreatePage />, {
      withRouterContext: true,
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'edit.bottomPageActionCard.updateBtn' }))
    await waitFor(() => {
      expect(screen.history.location.pathname).toBe('/it/fruizione/richieste')
    })
  })
})
