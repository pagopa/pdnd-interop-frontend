import React from 'react'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { mockAgreementDetailsContext } from './test.commons'
import { vi } from 'vitest'
import {
  AgreementDocumentListSection,
  AgreementDocumentListSectionSkeleton,
} from '../AgreementDocumentListSection'
import { render } from '@testing-library/react'
import { AgreementDownloads } from '@/api/agreement'
import type { Document } from '@/api/api.generatedTypes'
import userEvent from '@testing-library/user-event'
import { mockUseCurrentRoute } from '@/utils/testing.utils'

const downloadDocumentFn = vi.fn()
const downloadContractFn = vi.fn()

vi.spyOn(AgreementDownloads, 'useDownloadDocument').mockReturnValue(downloadDocumentFn)
vi.spyOn(AgreementDownloads, 'useDownloadContract').mockReturnValue(downloadContractFn)

afterEach(() => {
  downloadDocumentFn.mockClear()
  downloadContractFn.mockClear()
})

const docsMock: Array<Document> = [
  {
    id: '1',
    name: 'doc-1.pdf',
    prettyName: 'doc-1',
    contentType: 'pdf',
    createdAt: '2021-09-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'doc-2.pdf',
    prettyName: 'doc-2',
    contentType: 'pdf',
    createdAt: '2021-09-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'doc-3.pdf',
    prettyName: 'doc-3',
    contentType: 'pdf',
    createdAt: '2021-09-01T00:00:00.000Z',
  },
]

describe('AgreementDocumentListSection', () => {
  it('should match the snapshot with contract', () => {
    mockUseCurrentRoute({ isEditPath: false })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumerDocuments: docsMock, isContractPresent: true }),
    })

    const { baseElement } = render(<AgreementDocumentListSection />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot without contract', () => {
    mockUseCurrentRoute({ isEditPath: false })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumerDocuments: docsMock, isContractPresent: false }),
    })

    const { baseElement } = render(<AgreementDocumentListSection />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with loading skeleton', () => {
    mockUseCurrentRoute({ isEditPath: false })

    mockAgreementDetailsContext({
      agreement: undefined,
    })

    const { baseElement } = render(<AgreementDocumentListSection />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should not render if it is edit path', () => {
    mockUseCurrentRoute({ isEditPath: true })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumerDocuments: docsMock, isContractPresent: false }),
    })

    const { container } = render(<AgreementDocumentListSection />)

    expect(container).toBeEmptyDOMElement()
  })

  it('should correctly call the document download service', async () => {
    mockUseCurrentRoute({ isEditPath: false })

    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumerDocuments: docsMock, isContractPresent: true }),
    })

    const screen = render(<AgreementDocumentListSection />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'doc-1' }))
    expect(downloadDocumentFn).toHaveBeenCalledWith(
      {
        agreementId: 'e8a8153e-9ab2-4aeb-a14c-96aebd4fa049',
        documentId: '1',
      },
      'doc-1.pdf'
    )
    await user.click(screen.getByRole('button', { name: 'doc-2' }))
    expect(downloadDocumentFn).toHaveBeenCalledWith(
      {
        agreementId: 'e8a8153e-9ab2-4aeb-a14c-96aebd4fa049',
        documentId: '2',
      },
      'doc-2.pdf'
    )
    await user.click(screen.getByRole('button', { name: 'doc-3' }))
    expect(downloadDocumentFn).toHaveBeenCalledWith(
      {
        agreementId: 'e8a8153e-9ab2-4aeb-a14c-96aebd4fa049',
        documentId: '3',
      },
      'doc-3.pdf'
    )

    await user.click(screen.getByRole('button', { name: 'docLabel' }))
    expect(downloadContractFn).toHaveBeenCalledWith(
      {
        agreementId: 'e8a8153e-9ab2-4aeb-a14c-96aebd4fa049',
      },
      'docLabel.pdf'
    )
  })
})

describe('AgreementDocumentListSectionSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<AgreementDocumentListSectionSkeleton />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should not render in editing path ', () => {
    mockUseCurrentRoute({ isEditPath: true })
    const { container } = render(<AgreementDocumentListSectionSkeleton />)

    expect(container).toBeEmptyDOMElement()
  })
})
