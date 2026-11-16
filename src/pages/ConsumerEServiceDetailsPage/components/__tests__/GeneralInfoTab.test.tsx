import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import type * as ReactQuery from '@tanstack/react-query'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorCatalog } from '@/../__mocks__/data/eservice.mocks'
import GeneralInfoTab from '../GeneralInfoTab'

const descriptor = createMockEServiceDescriptorCatalog({
  eservice: {
    name: 'Consumer e-service',
    description: 'Service description',
    producer: { name: 'Producer organization' },
  },
  description: 'Version description',
  publishedAt: '2026-01-02T00:00:00.000Z',
})

vi.mock('@/router', () => ({
  useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: { getDescriptorCatalog: vi.fn(() => ({ queryKey: ['descriptor'] })) },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useSuspenseQuery: () => ({ data: descriptor }),
  useQuery: () => ({ data: descriptor }),
}))

describe('GeneralInfoTab', () => {
  it('renders e-service, version, lifecycle and useful-link information', () => {
    renderWithApplicationContext(<GeneralInfoTab />, { withRouterContext: true })

    expect(screen.getByText('Consumer e-service')).toBeInTheDocument()
    expect(screen.getByText('Service description')).toBeInTheDocument()
    expect(screen.getByText('Producer organization')).toBeInTheDocument()
    expect(screen.getByText('Version description')).toBeInTheDocument()
    expect(screen.getAllByText('02/01/2026')).not.toHaveLength(0)
    expect(screen.getByText('integration')).toBeInTheDocument()
    expect(screen.getByText('checksum')).toBeInTheDocument()
  })
})
