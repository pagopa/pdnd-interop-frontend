import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { mockAgreementDetailsContext } from './test.commons'
import { AgreementAttachedDocumentsDrawer } from '../AgreementAttachedDocumentsDrawer'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import { vi } from 'vitest'
import { AgreementDownloads } from '@/api/agreement'
import { fireEvent } from '@testing-library/react'

describe('AgreementAttachedDocumentsDrawer', () => {
  it('it should not render if agreement is falsy', () => {
    mockAgreementDetailsContext({
      agreement: undefined,
      isAttachedDocsDrawerOpen: true,
    })

    const { container } = renderWithApplicationContext(<AgreementAttachedDocumentsDrawer />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('should match the snapshot with documents and consumer notes', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        consumerNotes: 'test',
        consumerDocuments: [
          {
            id: 'document-id',
            name: 'document-name',
            prettyName: 'document-name.pdf',
          },
        ],
      }),
      isAttachedDocsDrawerOpen: true,
    })

    const { baseElement } = renderWithApplicationContext(<AgreementAttachedDocumentsDrawer />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should match the snapshot without documents and consumer notes', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        consumerNotes: undefined,
        consumerDocuments: [],
      }),
      isAttachedDocsDrawerOpen: true,
    })

    const { baseElement } = renderWithApplicationContext(<AgreementAttachedDocumentsDrawer />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should not show the consumer notes if the agreement does not have any', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumerNotes: undefined }),
      isAttachedDocsDrawerOpen: true,
    })

    const { queryByText } = renderWithApplicationContext(<AgreementAttachedDocumentsDrawer />, {
      withRouterContext: true,
    })

    expect(queryByText('consumerMessage.title')).not.toBeInTheDocument()
  })

  it('should show the consumer notes if the agreement does have them', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumerNotes: 'test' }),
      isAttachedDocsDrawerOpen: true,
    })

    const { queryByText } = renderWithApplicationContext(<AgreementAttachedDocumentsDrawer />, {
      withRouterContext: true,
    })

    expect(queryByText('consumerMessage.title')).toBeInTheDocument()
  })

  it('should show render the an empty label if there are no documents', () => {
    mockAgreementDetailsContext({
      agreement: createMockAgreement({ consumerDocuments: [] }),
      isAttachedDocsDrawerOpen: true,
    })

    const { queryByText } = renderWithApplicationContext(<AgreementAttachedDocumentsDrawer />, {
      withRouterContext: true,
    })

    expect(queryByText('attachedDocuments.noDocumentsLabel')).toBeInTheDocument()
  })

  it('should correctly call the downloadDocument function when clicking on a document', async () => {
    const documentName = 'document-name.pdf'
    const downloadDocument = vi.fn()
    vi.spyOn(AgreementDownloads, 'useDownloadDocument').mockReturnValue(downloadDocument)

    mockAgreementDetailsContext({
      agreement: createMockAgreement({
        id: 'agreement-id',
        consumerDocuments: [
          {
            id: 'document-id',
            name: documentName,
            prettyName: 'document-name',
          },
        ],
      }),
      isAttachedDocsDrawerOpen: true,
    })

    const { getByRole } = renderWithApplicationContext(<AgreementAttachedDocumentsDrawer />, {
      withRouterContext: true,
    })

    const documentLink = getByRole('button', { name: 'document-name' })
    fireEvent.click(documentLink)

    expect(downloadDocument).toHaveBeenCalledWith(
      { agreementId: 'agreement-id', documentId: 'document-id' },
      documentName
    )
  })
})
