import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  AgreementDocsInputSection,
  AgreementDocsInputSectionSkeleton,
} from '../AgreementDocsInputSection'
import { render, waitFor } from '@testing-library/react'
import { createMockAgreement } from '__mocks__/data/agreement.mocks'
import type { Document } from '@/api/api.generatedTypes'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { vi } from 'vitest'
import { AgreementDownloads, AgreementMutations } from '@/api/agreement'

const documentsMock: Array<Document> = [
  {
    id: 'doc-1',
    name: 'doc-1.pdf',
    prettyName: 'doc-1',
    contentType: 'application/pdf',
    createdAt: '2021-01-01T00:00:00.000Z',
  },
  {
    id: 'doc-2',
    name: 'doc-2.pdf',
    prettyName: 'doc-2',
    contentType: 'application/pdf',
    createdAt: '2021-01-01T00:00:00.000Z',
  },
]

describe('AgreementDocsInputSection', () => {
  it('should match snapshot when no agreements is passed', () => {
    const { baseElement } = renderWithApplicationContext(
      <AgreementDocsInputSection agreement={undefined} />,
      {
        withReactQueryContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot when passed agreement has no docs', () => {
    const { baseElement } = renderWithApplicationContext(
      <AgreementDocsInputSection agreement={createMockAgreement({ consumerDocuments: [] })} />,
      {
        withReactQueryContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot when passed agreement has docs', () => {
    const { baseElement } = renderWithApplicationContext(
      <AgreementDocsInputSection
        agreement={createMockAgreement({ consumerDocuments: documentsMock })}
      />,
      {
        withReactQueryContext: true,
      }
    )
    expect(baseElement).toMatchSnapshot()
  })

  it('should correctly validate the prettyname field user input', async () => {
    const screen = renderWithApplicationContext(
      <AgreementDocsInputSection agreement={createMockAgreement({ consumerDocuments: [] })} />,
      {
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    const addBtn = screen.getByRole('button', { name: 'addBtn' })
    await user.click(addBtn)

    await user.upload(
      screen.getByLabelText(''),
      new File(['file-test'], 'test.pdf', { type: 'pdf' })
    )

    const uploadButton = screen.getByRole('button', { name: 'uploadBtn' })
    await user.click(uploadButton)

    expect(screen.getByText('validation.mixed.required')).toBeInTheDocument()
    const prettyNameInput = screen.getByRole('textbox', { name: 'documentPrettynameField.label' })
    await user.type(prettyNameInput, 'test')
    expect(screen.getByText('validation.string.minLength')).toBeInTheDocument()
    await user.type(prettyNameInput, 'testtesttt')
    expect(screen.queryByText('validation.string.minLength')).not.toBeInTheDocument()
    expect(screen.queryByText('validation.mixed.required')).not.toBeInTheDocument()
  })

  it('should correctly insert a document', async () => {
    const server = setupServer(
      rest.post(
        `${BACKEND_FOR_FRONTEND_URL}/agreements/:agreementId/consumer-documents`,
        (req, res, ctx) => {
          return res(ctx.status(200))
        }
      )
    )
    server.listen()
    const screen = renderWithApplicationContext(
      <AgreementDocsInputSection agreement={createMockAgreement({ consumerDocuments: [] })} />,
      {
        withReactQueryContext: true,
      }
    )

    const user = userEvent.setup()
    const addBtn = screen.getByRole('button', { name: 'addBtn' })
    await user.click(addBtn)

    await user.upload(
      screen.getByLabelText(''),
      new File(['file-test'], 'test.pdf', { type: 'pdf' })
    )

    const uploadButton = screen.getByRole('button', { name: 'uploadBtn' })
    await user.click(uploadButton)

    const prettyNameInput = screen.getByRole('textbox', { name: 'documentPrettynameField.label' })
    await user.type(prettyNameInput, 'test-file')

    await user.click(uploadButton)

    await waitFor(() => expect(screen.getByRole('button', { name: 'addBtn' })).toBeInTheDocument())
  })

  it('should correctly call the delete document function', async () => {
    const deleteFn = vi.fn()

    vi.spyOn(AgreementMutations, 'useDeleteDraftDocument').mockReturnValue({
      mutate: deleteFn,
    } as unknown as ReturnType<typeof AgreementMutations.useDeleteDraftDocument>)

    const screen = renderWithApplicationContext(
      <AgreementDocsInputSection
        agreement={createMockAgreement({ consumerDocuments: documentsMock })}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const deleteButton = screen.getAllByRole('button', { name: 'deleteDocument' })[0]
    const user = userEvent.setup()
    await user.click(deleteButton)
    expect(deleteFn).toBeCalledWith({
      agreementId: 'e8a8153e-9ab2-4aeb-a14c-96aebd4fa049',
      documentId: 'doc-1',
    })
  })

  it('should correctly call the download document function', async () => {
    const downloadFn = vi.fn()

    vi.spyOn(AgreementDownloads, 'useDownloadDocument').mockReturnValue(downloadFn)

    const screen = renderWithApplicationContext(
      <AgreementDocsInputSection
        agreement={createMockAgreement({ consumerDocuments: documentsMock })}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const downloadButton = screen.getAllByRole('button', { name: 'downloadDocument' })[0]
    const user = userEvent.setup()
    await user.click(downloadButton)
    expect(downloadFn).toBeCalledWith(
      {
        agreementId: 'e8a8153e-9ab2-4aeb-a14c-96aebd4fa049',
        documentId: 'doc-1',
      },
      'doc-1.pdf'
    )
  })
})

describe('AgreementDocsInputSectionSkeleton', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<AgreementDocsInputSectionSkeleton />)
    expect(baseElement).toMatchSnapshot()
  })
})
