import React from 'react'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import { NotFoundError } from '@/utils/errors.utils'
import type * as ReactQuery from '@tanstack/react-query'
import type * as Router from '@/router'
import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProviderAgreementDetailsPage from '../ProviderAgreementDetails.page'

const { mockedUseSuspenseQuery } = vi.hoisted(() => ({
  mockedUseSuspenseQuery: vi.fn(),
}))

vi.mock('@/router', async (importOriginal) => ({
  ...(await importOriginal<typeof Router>()),
  useParams: () => ({ agreementId: 'agreement-id' }),
}))

vi.mock('@/hooks/useGetAgreementsActions', () => ({
  default: () => ({ actions: [] }),
}))

vi.mock('@/hooks/useMarkNotificationsAsRead', () => ({
  useMarkNotificationsAsRead: vi.fn(),
}))

vi.mock(
  '../components/ProviderAgreementDetailsGeneralInfoSection/ProviderAgreementDetailsGeneralInfoSection',
  () => ({
    ProviderAgreementDetailsGeneralInfoSection: () => <div>Agreement details</div>,
    ProviderAgreementDetailsGeneralInfoSectionSkeleton: () => null,
  })
)

vi.mock(
  '../components/ProviderAgreementDetailsAttributesSectionsList/ProviderAgreementDetailsAttributesSectionsList',
  () => ({
    ProviderAgreementDetailsAttributesSectionsList: () => null,
    ProviderAgreementDetailsAttributesSectionsListSkeleton: () => null,
  })
)

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useSuspenseQuery: mockedUseSuspenseQuery,
}))

function renderPage() {
  return renderWithApplicationContext(<ProviderAgreementDetailsPage />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })
}

function mockQueries(producerDelegations: Array<{ id: string }> = []) {
  mockedUseSuspenseQuery.mockImplementation(({ queryKey }) => {
    if (queryKey[0] === 'AgreementGetSingle') {
      return {
        data: createMockAgreement({
          consumer: { id: 'consumer-id' },
          producer: { id: 'producer-id' },
        }),
      }
    }

    return { data: { results: producerDelegations } }
  })
}

describe('ProviderAgreementDetailsPage', () => {
  beforeEach(() => {
    mockUseJwt({ jwt: { organizationId: 'consumer-id' } })
    mockQueries()
  })

  it('prevents a consumer from opening the provider agreement details via direct URL', () => {
    expect(() => renderPage()).toThrow(NotFoundError)
  })

  it('allows the producer to open the provider agreement details', () => {
    mockUseJwt({ jwt: { organizationId: 'producer-id' } })

    renderPage()

    expect(screen.getByText('Agreement details')).toBeInTheDocument()
  })

  it('allows an active producer delegate to open the provider agreement details', () => {
    mockUseJwt({ jwt: { organizationId: 'delegate-id' } })
    mockQueries([{ id: 'producer-delegation-id' }])

    renderPage()

    expect(screen.getByText('Agreement details')).toBeInTheDocument()
  })
})
