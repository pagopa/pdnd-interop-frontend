import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type * as ReactQuery from '@tanstack/react-query'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorCatalog,
  createMockEServiceDescriptorCatalogAsync,
} from '@/../__mocks__/data/eservice.mocks'
import TechnicalSpecsTab from '../TechnicalSpecsTab'

const mockedDownload = vi.fn()
let descriptor = createMockEServiceDescriptorCatalog()

vi.mock('@/router', () => ({
  useParams: () => ({ eserviceId: 'eservice-id', descriptorId: 'descriptor-id' }),
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: { getDescriptorCatalog: vi.fn(() => ({ queryKey: ['descriptor'] })) },
  EServiceDownloads: { useDownloadVersionDocument: () => mockedDownload },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => ({
  ...(await importOriginal<typeof ReactQuery>()),
  useSuspenseQuery: () => ({ data: descriptor }),
}))

describe('TechnicalSpecsTab', () => {
  it('renders interface, voucher and documentation information and downloads a document', async () => {
    const user = userEvent.setup()
    descriptor = createMockEServiceDescriptorCatalog({
      docs: [
        {
          id: 'doc-id',
          name: 'documentation.pdf',
          prettyName: 'Documentation',
          contentType: 'application/pdf',
        },
      ],
    })

    renderWithApplicationContext(<TechnicalSpecsTab />, { withRouterContext: true })

    expect(screen.getByText('Specifica API')).toBeInTheDocument()
    expect(screen.getByText('Documentation')).toBeInTheDocument()
    expect(screen.getByText('Lorem')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Documentation' }))
    expect(mockedDownload).toHaveBeenCalledWith(
      { eserviceId: 'eservice-id', descriptorId: 'descriptor-id', documentId: 'doc-id' },
      'Documentation.pdf'
    )
  })

  it('renders asynchronous exchange details only for async e-services', () => {
    descriptor = createMockEServiceDescriptorCatalogAsync()

    renderWithApplicationContext(<TechnicalSpecsTab />, { withRouterContext: true })

    expect(screen.getByText('Specifica callback')).toBeInTheDocument()
  })
})
