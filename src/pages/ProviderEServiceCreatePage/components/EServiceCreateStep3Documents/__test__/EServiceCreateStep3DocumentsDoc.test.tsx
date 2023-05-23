import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { vi } from 'vitest'
import * as EServiceCreateContext from '../../EServiceCreateContext'
import type { EServiceDoc, ProducerEServiceDescriptor } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockEServiceDescriptorProvider } from '__mocks__/data/eservice.mocks'
import userEvent from '@testing-library/user-event'
import { BACKEND_FOR_FRONTEND_URL } from '@/config/env'
import { EServiceCreateStep3DocumentsDoc } from '../EServiceCreateStep3DocumentsDoc'
import { waitFor } from '@testing-library/react'
import { EServiceDownloads, EServiceMutations } from '@/api/eservice'

const docMock: EServiceDoc = {
  id: '1',
  name: 'name',
  contentType: 'pdf',
  prettyName: 'document',
}

const server = setupServer(
  rest.delete(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  ),
  rest.get(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId/update`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  ),
  rest.post(
    `${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  )
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mockUseEServiceCreateContext = (descriptor: ProducerEServiceDescriptor | undefined) => {
  vi.spyOn(EServiceCreateContext, 'useEServiceCreateContext').mockReturnValue({
    descriptor,
  } as unknown as ReturnType<typeof EServiceCreateContext.useEServiceCreateContext>)
}

describe('EServiceCreateStep3DocumentsDoc', () => {
  it('should match snapshot if there is a doc and showWriteDocInput is false', () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: [docMock] })
    mockUseEServiceCreateContext(descriptor)

    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot if there is no docs and showWriteDocInput is false', () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: undefined })
    mockUseEServiceCreateContext(descriptor)

    const { baseElement } = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot if there is a doc and showWriteDocInput is true', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: [docMock] })
    mockUseEServiceCreateContext(descriptor)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const addButton = screen.getByRole('button', { name: 'addBtn' })
    await user.click(addButton)

    await waitFor(() => expect(screen.asFragment).toMatchSnapshot())
  })

  it('should match snapshot if there are no docs and showWriteDocInput is true', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: undefined })
    mockUseEServiceCreateContext(descriptor)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const addButton = screen.getByRole('button', { name: 'addBtn' })
    await user.click(addButton)

    await waitFor(() => expect(screen.asFragment).toMatchSnapshot())
  })

  it('should call downloadDocument', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: [docMock] })
    mockUseEServiceCreateContext(descriptor)

    const downloadDocumentFn = vi.fn()
    vi.spyOn(EServiceDownloads, 'useDownloadVersionDocument').mockReturnValue(
      downloadDocumentFn as unknown as ReturnType<
        typeof EServiceDownloads.useDownloadVersionDocument
      >
    )

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const downloadButton = screen.getByRole('button', { name: 'downloadDocument' })
    await user.click(downloadButton)

    await waitFor(() =>
      expect(downloadDocumentFn).toBeCalledWith(
        {
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
          documentId: docMock.id,
        },
        'document.name' // getDownloadDocumentName(docMock)
      )
    )
  })

  it('should call the deleteDocument mutation', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: [docMock] })
    mockUseEServiceCreateContext(descriptor)

    const deleteVersionDraftDocumentFn = vi.fn()
    vi.spyOn(EServiceMutations, 'useDeleteVersionDraftDocument').mockReturnValue({
      mutate: deleteVersionDraftDocumentFn,
    } as unknown as ReturnType<typeof EServiceMutations.useDeleteVersionDraftDocument>)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const deleteButton = screen.getByRole('button', { name: 'deleteDocument' })
    await user.click(deleteButton)

    await waitFor(() =>
      expect(deleteVersionDraftDocumentFn).toBeCalledWith({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: docMock.id,
      })
    )
  })

  it('should call the updateDocumentName mutation', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: [docMock] })
    mockUseEServiceCreateContext(descriptor)

    const updateVersionDraftDocumentDescriptionFn = vi.fn()
    vi.spyOn(EServiceMutations, 'useUpdateVersionDraftDocumentDescription').mockReturnValue({
      mutate: updateVersionDraftDocumentDescriptionFn,
    } as unknown as ReturnType<typeof EServiceMutations.useUpdateVersionDraftDocumentDescription>)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const startEditingButton = screen.getByRole('button', { name: 'editDocumentName' })
    await user.click(startEditingButton)

    const prettyNameInput = screen.getByLabelText('prettyName.label')
    await user.clear(prettyNameInput)
    await user.type(prettyNameInput, 'new pretty name')
    prettyNameInput.blur()

    await waitFor(() =>
      expect(updateVersionDraftDocumentDescriptionFn).toBeCalledWith({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: docMock.id,
        prettyName: 'new pretty name',
      })
    )
  })

  it('should call the uploadDocument mutation', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: [docMock] })
    mockUseEServiceCreateContext(descriptor)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const addButton = screen.getByRole('button', { name: 'addBtn' })
    await user.click(addButton)

    const docInput = screen.getByLabelText('')
    const testFile = new File(['file-test'], 'test.pdf', { type: 'pdf' })
    await user.upload(docInput, testFile)

    const prettyNameInput = screen.getByLabelText('create.step3.nameField.label')
    await user.clear(prettyNameInput)
    await user.type(prettyNameInput, 'new pretty name')

    const submitButton = screen.getByRole('button', { name: 'create.step3.uploadBtn' })
    await user.click(submitButton)

    await waitFor(() => expect(screen.queryByLabelText('')).not.toBeInTheDocument())
  })

  it('should skip the uploadDocument mutation if there is no file', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ docs: [docMock] })
    mockUseEServiceCreateContext(descriptor)

    const postVersionDraftDocumentFn = vi.fn()
    vi.spyOn(EServiceMutations, 'usePostVersionDraftDocument').mockReturnValue({
      mutate: postVersionDraftDocumentFn,
    } as unknown as ReturnType<typeof EServiceMutations.usePostVersionDraftDocument>)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const addButton = screen.getByRole('button', { name: 'addBtn' })
    await user.click(addButton)

    const prettyNameInput = screen.getByLabelText('create.step3.nameField.label')
    await user.clear(prettyNameInput)
    await user.type(prettyNameInput, 'new pretty name')

    const submitButton = screen.getByRole('button', { name: 'create.step3.uploadBtn' })
    await user.click(submitButton)

    await waitFor(() => expect(postVersionDraftDocumentFn).not.toBeCalled())
  })

  it('should skip the uploadDocument mutation if there is no descriptor', async () => {
    mockUseEServiceCreateContext(undefined)

    const postVersionDraftDocumentFn = vi.fn()
    vi.spyOn(EServiceMutations, 'usePostVersionDraftDocument').mockReturnValue({
      mutate: postVersionDraftDocumentFn,
    } as unknown as ReturnType<typeof EServiceMutations.usePostVersionDraftDocument>)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsDoc />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const addButton = screen.getByRole('button', { name: 'addBtn' })
    await user.click(addButton)

    const docInput = screen.getByLabelText('')
    const testFile = new File(['file-test'], 'test.pdf', { type: 'pdf' })
    await user.upload(docInput, testFile)

    const prettyNameInput = screen.getByLabelText('create.step3.nameField.label')
    await user.clear(prettyNameInput)
    await user.type(prettyNameInput, 'new pretty name')

    const submitButton = screen.getByRole('button', { name: 'create.step3.uploadBtn' })
    await user.click(submitButton)

    await waitFor(() => expect(postVersionDraftDocumentFn).not.toBeCalled())
  })
})
