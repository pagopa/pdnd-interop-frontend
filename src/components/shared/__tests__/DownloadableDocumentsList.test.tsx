import React from 'react'
import { render } from '@testing-library/react'
import { DownloadableDocumentsList } from '../DownloadableDocumentsList'
import { vi } from 'vitest'
import type { EServiceDoc } from '@/api/api.generatedTypes'

const documentListMock: Array<EServiceDoc> = [
  {
    id: '1',
    name: 'Document 1',
    prettyName: 'Document 1',
    contentType: 'pdf',
  },
  {
    id: '2',
    name: 'Document 2',
    prettyName: 'Document 2',
    contentType: 'pdf',
  },
]

describe('DownloadableDocumentsList', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(
      <DownloadableDocumentsList docs={documentListMock} onDocumentDownload={vi.fn()} />
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot on empty documents list', () => {
    const { baseElement } = render(
      <DownloadableDocumentsList docs={[]} onDocumentDownload={vi.fn()} />
    )
    expect(baseElement).toMatchSnapshot()
  })
})
