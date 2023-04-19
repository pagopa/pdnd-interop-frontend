import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { AgreementDetails, AgreementDetailsSkeleton } from '../AgreementDetails'
import {
  mockUseCurrentRoute,
  mockUseJwt,
  renderWithApplicationContext,
  setupQueryServer,
} from '@/utils/testing.utils'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { createMockEServiceDescriptorProvider } from '__mocks__/data/eservice.mocks'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'

function createAgreementDetailsContextServerMock(
  agreementMock = createMockAgreement(),
  descriptorMock = createMockEServiceDescriptorProvider()
) {
  return setupQueryServer([
    {
      url: `${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId`,
      result: agreementMock,
    },
    {
      url: `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/:eserviceId/descriptor/:descriptorId`,
      result: descriptorMock,
    },
    {
      url: `${BACKEND_FOR_FRONTEND_URL}/tenants/:partyId/attributes/certified`,
      result: { attributes: [] },
    },
    {
      url: `${BACKEND_FOR_FRONTEND_URL}/tenants/:partyId/attributes/verified`,
      result: { attributes: [] },
    },
    {
      url: `${BACKEND_FOR_FRONTEND_URL}/tenants/:partyId/attributes/declared`,
      result: { attributes: [] },
    },
  ])
}

mockUseJwt({ isAdmin: true })

describe('AgreementDetails', () => {
  it('should match the snapshot (consumer)', async () => {
    mockUseCurrentRoute({ mode: 'consumer', isEditPath: true })
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
    mockUseCurrentRoute({ mode: 'provider', isEditPath: true })
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
