import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { AgreementDetails, AgreementDetailsSkeleton } from '../AgreementDetails'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
} from '@/utils/testing.utils'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import { createMockEServiceDescriptorProvider } from '@/../__mocks__/data/eservice.mocks'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

function createAgreementDetailsContextServerMock(
  agreementMock = createMockAgreement(),
  descriptorMock = createMockEServiceDescriptorProvider()
) {
  return setupServer(
    rest.get(`${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId`, (req, res, ctx) => {
      return res(ctx.json(agreementMock))
    }),
    rest.get(
      `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/:eserviceId/descriptor/:descriptorId`,
      (req, res, ctx) => {
        return res(ctx.json(descriptorMock))
      }
    ),
    rest.get(
      `${BACKEND_FOR_FRONTEND_URL}/tenants/:partyId/attributes/certified`,
      (req, res, ctx) => {
        return res(ctx.json({ attributes: [] }))
      }
    ),
    rest.get(
      `${BACKEND_FOR_FRONTEND_URL}/tenants/:partyId/attributes/verified`,
      (req, res, ctx) => {
        return res(ctx.json({ attributes: [] }))
      }
    ),
    rest.get(
      `${BACKEND_FOR_FRONTEND_URL}/tenants/:partyId/attributes/declared`,
      (req, res, ctx) => {
        return res(ctx.json({ attributes: [] }))
      }
    )
  )
}

mockUseJwt({ isAdmin: true })

describe('AgreementDetails', () => {
  it('should match the snapshot (consumer)', async () => {
    mockUseCurrentRoute({ mode: 'consumer' })
    const server = createAgreementDetailsContextServerMock()
    server.listen()

    const screen = renderWithApplicationContext(
      <React.Suspense fallback={<div>loading</div>}>
        <AgreementDetails agreementId="agreementId" />
      </React.Suspense>,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument()
    })

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match the snapshot (producer)', async () => {
    mockUseCurrentRoute({ mode: 'provider' })
    const server = createAgreementDetailsContextServerMock()
    server.listen()

    const screen = renderWithApplicationContext(
      <React.Suspense fallback={<div>loading</div>}>
        <AgreementDetails agreementId="agreementId" />
      </React.Suspense>,
      {
        withReactQueryContext: true,
        withRouterContext: true,
      }
    )

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument()
    })

    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('AgreementDetailsSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<AgreementDetailsSkeleton />)
    expect(baseElement).toBeInTheDocument()
  })
})
