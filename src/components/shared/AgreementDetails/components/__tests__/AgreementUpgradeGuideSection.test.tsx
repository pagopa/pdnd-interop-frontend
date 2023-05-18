import React from 'react'
import { AgreementUpgradeGuideSection } from '../AgreementUpgradeGuideSection'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { mockAgreementDetailsContext } from './test.commons'
import { vi } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/react'
import * as router from '@/router'

const server = setupServer(
  rest.post(`${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId/upgrade`, (req, res, ctx) => {
    return res(ctx.json(createMockAgreement({ id: 'new updated agreement id' })))
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())

const useNavigateSpy = vi.spyOn(router, 'useNavigateRouter')

describe('AgreementUpgradeGuideSection', () => {
  it('should match the snapshot', () => {
    mockUseJwt({ isAdmin: true })
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      canBeUpgraded: true,
    })

    const { baseElement } = renderWithApplicationContext(<AgreementUpgradeGuideSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if user is not an admin', () => {
    mockUseJwt({ isAdmin: false })
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      canBeUpgraded: true,
    })

    const { container } = renderWithApplicationContext(<AgreementUpgradeGuideSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('should not render if the agreement cannot be upgraded', () => {
    mockUseJwt({ isAdmin: true })
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      canBeUpgraded: false,
    })

    const { container } = renderWithApplicationContext(<AgreementUpgradeGuideSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('should redirect to the new agreement details after upgrading', async () => {
    const navigateRouterFn = vi.fn()
    useNavigateSpy.mockReturnValue({ navigate: navigateRouterFn, getRouteUrl: () => '' })

    mockUseJwt({ isAdmin: true })
    mockAgreementDetailsContext({
      agreement: createMockAgreement(),
      canBeUpgraded: true,
    })

    const screen = renderWithApplicationContext(<AgreementUpgradeGuideSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'upgradeBtn' }))
    await user.click(screen.getByRole('button', { name: /confirm/i }))

    await waitFor(() => {
      expect(navigateRouterFn).toBeCalledWith('SUBSCRIBE_AGREEMENT_READ', {
        params: {
          agreementId: 'new updated agreement id',
        },
      })
    })
  })
})
