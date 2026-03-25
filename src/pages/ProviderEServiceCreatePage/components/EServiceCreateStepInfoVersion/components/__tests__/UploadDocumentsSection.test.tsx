import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { UploadDocumentsSection } from '../UploadDocumentsSection'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorProvider,
  createMockEServiceDescriptorProviderWithDocs,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    useDeleteVersionDraftDocument: () => ({ mutate: vi.fn() }),
    useUpdateVersionDraftDocumentDescription: () => ({ mutate: vi.fn() }),
    usePostVersionDraftDocument: () => ({ mutate: vi.fn() }),
  },
  EServiceDownloads: {
    useDownloadVersionDocument: () => vi.fn(),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('UploadDocumentsSection', () => {
  it('should show file input when there are no docs', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProvider(),
    })
    renderWithApplicationContext(<UploadDocumentsSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('loadFromPc')).toBeInTheDocument()
    expect(screen.queryByText('addBtn')).not.toBeInTheDocument()
  })

  it('should show add button and document list when docs exist', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithDocs(),
    })
    renderWithApplicationContext(<UploadDocumentsSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByDisplayValue('Document PDF')).toBeInTheDocument()
    expect(screen.getByText('addBtn')).toBeInTheDocument()
  })

  it('should show file input after clicking add button', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithDocs(),
    })
    renderWithApplicationContext(<UploadDocumentsSection />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    await userEvent.click(screen.getByText('addBtn'))
    expect(screen.getByTestId('loadFromPc')).toBeInTheDocument()
    expect(screen.queryByText('addBtn')).not.toBeInTheDocument()
  })

  it('should render readonly mode with download links', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderWithDocs(),
    })
    renderWithApplicationContext(<UploadDocumentsSection readonly />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByText('Document PDF')).toBeInTheDocument()
    expect(screen.queryByText('addBtn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loadFromPc')).not.toBeInTheDocument()
  })
})
