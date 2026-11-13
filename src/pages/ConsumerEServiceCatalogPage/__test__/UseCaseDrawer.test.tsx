import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { CatalogEService, CatalogUseCase } from '@/api/api.generatedTypes'
import { EServiceQueries } from '@/api/eservice'
import { createMockEServiceCatalog } from '@/../__mocks__/data/eservice.mocks'
import { queryClient } from '@/config/query-client'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import UseCaseDrawer from '../components/UseCaseDrawer'

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getDescriptorCatalog: vi.fn(),
  },
}))

vi.mock('../components/EServiceCatalogCard', () => ({
  EServiceCatalogCard: ({
    eservice,
    prefetchFn,
  }: {
    eservice: CatalogEService
    prefetchFn: () => void
  }) => <button onClick={prefetchFn}>{eservice.name}</button>,
}))

const subscribedEService = createMockEServiceCatalog({
  id: 'subscribed-eservice',
  name: 'Subscribed e-service',
})
const unsubscribedEService = createMockEServiceCatalog({
  id: 'unsubscribed-eservice',
  name: 'Unsubscribed e-service',
})

const useCase: CatalogUseCase = {
  name: 'Citizen services',
  description: 'Services for citizens',
  slug: '/use-cases/citizens',
  fieldId: 'CITIZEN_SERVICES',
  subscribedEservices: [subscribedEService],
  unsubscribedEservices: [unsubscribedEService],
}

describe('UseCaseDrawer', () => {
  beforeEach(() => {
    queryClient.clear()
    vi.mocked(EServiceQueries.getDescriptorCatalog).mockReturnValue({
      queryKey: ['descriptor'],
      queryFn: () => Promise.resolve({}),
    } as never)
  })

  afterEach(() => {
    queryClient.clear()
    vi.clearAllMocks()
  })

  it('renders both groups and links to the use-case page', () => {
    renderWithApplicationContext(<UseCaseDrawer isOpen onClose={vi.fn()} useCase={useCase} />, {
      withReactQueryContext: true,
    })

    expect(screen.getByText(useCase.name)).toBeInTheDocument()
    expect(screen.getByText('useCaseEServicesTitle')).toBeInTheDocument()
    expect(screen.getByText('useCaseSubscribedEServicesTitle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: unsubscribedEService.name })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: subscribedEService.name })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'readButtonAriaLabel' })).toHaveAttribute(
      'href',
      useCase.slug
    )
  })

  it('prefetches the active descriptor when an e-service card is selected', async () => {
    const user = userEvent.setup()

    renderWithApplicationContext(<UseCaseDrawer isOpen onClose={vi.fn()} useCase={useCase} />, {
      withReactQueryContext: true,
    })

    await user.click(screen.getByRole('button', { name: unsubscribedEService.name }))

    expect(EServiceQueries.getDescriptorCatalog).toHaveBeenCalledWith(
      unsubscribedEService.id,
      unsubscribedEService.activeDescriptor?.id
    )
  })
})
