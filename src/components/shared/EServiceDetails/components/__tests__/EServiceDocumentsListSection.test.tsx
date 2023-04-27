import React from 'react'
import { render } from '@testing-library/react'
import { EServiceDocumentsListSection } from '../EServiceDocumentsListSection'
import { mockEServiceDetailsContext } from './test.commons'
import { createMockEServiceDescriptorCatalog } from '__mocks__/data/eservice.mocks'
import type { EServiceDoc } from '@/api/api.generatedTypes'
import { vi } from 'vitest'
import { EServiceDownloads } from '@/api/eservice'
import userEvent from '@testing-library/user-event'

const docsMock: Array<EServiceDoc> = [
  { id: '1', name: 'doc1', prettyName: 'doc1', contentType: 'application/pdf' },
  { id: '2', name: 'doc2', prettyName: 'doc2', contentType: 'application/pdf' },
]

describe('EServiceDocumentsListSection', () => {
  it('should match the snapshot', () => {
    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog(),
      docs: docsMock,
    })
    const { container } = render(<EServiceDocumentsListSection />)
    expect(container).toMatchSnapshot()
  })

  it('should call downloadDocument when document is clicked', async () => {
    const downloadDocFn = vi.fn()
    vi.spyOn(EServiceDownloads, 'useDownloadVersionDocument').mockReturnValue(downloadDocFn)

    mockEServiceDetailsContext({
      descriptor: createMockEServiceDescriptorCatalog(),
      docs: docsMock,
    })
    const screen = render(<EServiceDocumentsListSection />)
    const user = userEvent.setup()
    const doc1 = screen.getByRole('button', { name: 'doc1' })
    await user.click(doc1)
    expect(downloadDocFn).toHaveBeenCalledWith(
      {
        descriptorId: 'ec94e366-cbb2-4203-ac07-95acf5289a31',
        documentId: '1',
        eserviceId: '03d0c725-47e5-4ec5-8ecd-1a1f3ce45d29',
      },
      'doc1.doc1'
    )
  })
})
