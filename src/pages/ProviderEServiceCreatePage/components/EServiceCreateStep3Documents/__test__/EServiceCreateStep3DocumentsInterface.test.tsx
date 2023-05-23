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
import { waitFor } from '@testing-library/react'
import { EServiceCreateStep3DocumentsInterface } from '../EServiceCreateStep3DocumentsInterface'
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
    `${BACKEND_FOR_FRONTEND_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  )
)

const original = window.crypto.getRandomValues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.crypto.getRandomValues = () => [0, undefined] as any

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => {
  server.close()
  window.crypto.getRandomValues = original
})

const mockUseEServiceCreateContext = (descriptor: ProducerEServiceDescriptor | undefined) => {
  vi.spyOn(EServiceCreateContext, 'useEServiceCreateContext').mockReturnValue({
    descriptor,
  } as unknown as ReturnType<typeof EServiceCreateContext.useEServiceCreateContext>)
}

describe('EServiceCreateStep3DocumentsDoc', () => {
  it('should match snapshot if there is no actualInterface', () => {
    const descriptor = createMockEServiceDescriptorProvider({ interface: undefined })
    mockUseEServiceCreateContext(descriptor)

    const { baseElement } = renderWithApplicationContext(
      <EServiceCreateStep3DocumentsInterface />,
      {
        withReactQueryContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should match snapshot if there is actualInterface', () => {
    const descriptor = createMockEServiceDescriptorProvider({ interface: docMock })
    mockUseEServiceCreateContext(descriptor)

    const { baseElement } = renderWithApplicationContext(
      <EServiceCreateStep3DocumentsInterface />,
      {
        withReactQueryContext: true,
      }
    )

    expect(baseElement).toMatchSnapshot()
  })

  it('should call deleteDocument mutation', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ interface: docMock })
    mockUseEServiceCreateContext(descriptor)

    const deleteVersionDraftDocumentFn = vi.fn()
    vi.spyOn(EServiceMutations, 'useDeleteVersionDraftDocument').mockReturnValue({
      mutate: deleteVersionDraftDocumentFn,
    } as unknown as ReturnType<typeof EServiceMutations.useDeleteVersionDraftDocument>)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsInterface />, {
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

  it('should call downloadDocument', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ interface: docMock })
    mockUseEServiceCreateContext(descriptor)

    const downloadDocumentFn = vi.fn()
    vi.spyOn(EServiceDownloads, 'useDownloadVersionDocument').mockReturnValue(
      downloadDocumentFn as unknown as ReturnType<
        typeof EServiceDownloads.useDownloadVersionDocument
      >
    )

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsInterface />, {
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

  it('should call uploadDocument mutation', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ interface: undefined })
    mockUseEServiceCreateContext(descriptor)

    const postVersionDraftDocumentFn = vi.fn()
    vi.spyOn(EServiceMutations, 'usePostVersionDraftDocument').mockReturnValue({
      mutate: postVersionDraftDocumentFn,
    } as unknown as ReturnType<typeof EServiceMutations.usePostVersionDraftDocument>)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsInterface />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()

    // const docInput = screen.getByLabelText('create.step3.uploadFileField.label')
    const docInput = screen.getByLabelText('')
    const testFile = new File(['file-test'], 'test.pdf', { type: 'pdf' })
    await user.upload(docInput, testFile)

    const submitButton = screen.getByRole('button', { name: 'create.step3.uploadBtn' })
    await user.click(submitButton)

    await waitFor(() =>
      expect(postVersionDraftDocumentFn).toBeCalledWith({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        doc: testFile,
        prettyName: 'create.step3.interface.prettyName',
        kind: 'INTERFACE',
      })
    )
  })

  it('should skip uploadDocument mutation if there is no descriptor', async () => {
    mockUseEServiceCreateContext(undefined)

    const postVersionDraftDocumentFn = vi.fn()
    vi.spyOn(EServiceMutations, 'usePostVersionDraftDocument').mockReturnValue({
      mutate: postVersionDraftDocumentFn,
    } as unknown as ReturnType<typeof EServiceMutations.usePostVersionDraftDocument>)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsInterface />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()

    // const docInput = screen.getByLabelText('create.step3.uploadFileField.label')
    const docInput = screen.getByLabelText('')
    const testFile = new File(['file-test'], 'test.pdf', { type: 'pdf' })
    await user.upload(docInput, testFile)

    const submitButton = screen.getByRole('button', { name: 'create.step3.uploadBtn' })
    await user.click(submitButton)

    await waitFor(() => expect(postVersionDraftDocumentFn).not.toBeCalled())
  })

  it('should skip uploadDocument mutation if there is no interfaceDoc uploaded', async () => {
    const descriptor = createMockEServiceDescriptorProvider({ interface: undefined })
    mockUseEServiceCreateContext(descriptor)

    const postVersionDraftDocumentFn = vi.fn()
    vi.spyOn(EServiceMutations, 'usePostVersionDraftDocument').mockReturnValue({
      mutate: postVersionDraftDocumentFn,
    } as unknown as ReturnType<typeof EServiceMutations.usePostVersionDraftDocument>)

    const screen = renderWithApplicationContext(<EServiceCreateStep3DocumentsInterface />, {
      withReactQueryContext: true,
    })

    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: 'create.step3.uploadBtn' })
    await user.click(submitButton)

    await waitFor(() => expect(postVersionDraftDocumentFn).not.toBeCalled())
  })
})
