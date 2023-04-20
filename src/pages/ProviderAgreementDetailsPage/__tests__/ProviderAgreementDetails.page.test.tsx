import React from 'react'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import {
  mockUseCurrentRoute,
  mockUseRouteParams,
  renderWithApplicationContext,
  setupQueryServer,
} from '@/utils/testing.utils'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { createMockEServiceDescriptorProvider } from '__mocks__/data/eservice.mocks'
import ProviderAgreementDetailsPage from '../ProviderAgreementDetails.page'
import { waitFor } from '@testing-library/react'

mockUseRouteParams({ agreementId: 'agreementId' })
mockUseCurrentRoute({ mode: 'provider' })

const queryServer = setupQueryServer([
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId`,
    result: createMockAgreement(),
  },
  {
    url: `${BACKEND_FOR_FRONTEND_URL}/catalog/eservices/:eserviceId/descriptor/:descriptorId`,
    result: createMockEServiceDescriptorProvider(),
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

beforeAll(() => {
  queryServer.listen()
})

afterEach(() => {
  queryServer.resetHandlers()
})

afterAll(() => {
  queryServer.close()
})

describe('ProviderAgreementDetails', () => {
  it('should match the snapshot', async () => {
    const screen = renderWithApplicationContext(<ProviderAgreementDetailsPage />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.baseElement).toMatchSnapshot('loading')
    await waitFor(() => {
      expect(screen.queryByText('requestStatusField.label')).toBeInTheDocument()
    })
    expect(screen.baseElement).toMatchSnapshot('full')
  })
})
