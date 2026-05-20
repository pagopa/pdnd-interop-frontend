import { renderHook } from '@testing-library/react'
import { vi } from 'vitest'
import { useInterfaceDocActions } from '../useInterfaceDocActions'
import {
  createMockEServiceDescriptorProviderAsync,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'

const uploadDocument = vi.fn()
const deleteDocument = vi.fn()
const downloadDocument = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    usePostVersionDraftDocument: () => ({ mutate: uploadDocument }),
    useDeleteVersionDraftDocument: () => ({ mutate: deleteDocument }),
  },
  EServiceDownloads: {
    useDownloadVersionDocument: () => downloadDocument,
  },
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => ({ jwt: { organization: { name: 'Test Org' } } }),
  },
}))

vi.mock('@/utils/eservice.utils', () => ({
  getDownloadDocumentName: (doc: { name: string }) => doc.name,
}))

afterEach(() => {
  vi.clearAllMocks()
})

const mockDoc = {
  checksum: 'checksum',
  contentType: 'application/octet-stream',
  id: 'doc-id-001',
  name: 'interface.yaml',
  prettyName: 'Specifica API',
}

describe('useInterfaceDocActions', () => {
  describe('onUpload', () => {
    it('should call uploadDocument with the right payload including the descriptor name and version', () => {
      const descriptor = createMockEServiceDescriptorProviderAsync()
      mockUseEServiceCreateContext({ descriptor })

      const { result } = renderHook(() =>
        useInterfaceDocActions({ doc: null, kind: 'INTERFACE', prettyName: 'Specifica API' })
      )

      const file = new File(['hello'], 'spec.yaml', { type: 'application/yaml' })
      result.current.onUpload(file)

      expect(uploadDocument).toHaveBeenCalledWith({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        doc: file,
        prettyName: `Specifica API_${descriptor.eservice.name}_Test Org_v${descriptor.version}`,
        kind: 'INTERFACE',
      })
    })

    it('should call uploadDocument with kind ASYNC_EXCHANGE_CALLBACK_INTERFACE when kind is set', () => {
      mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProviderAsync() })

      const { result } = renderHook(() =>
        useInterfaceDocActions({
          doc: null,
          kind: 'ASYNC_EXCHANGE_CALLBACK_INTERFACE',
          prettyName: 'Specifica callback',
        })
      )

      const file = new File(['hello'], 'callback.yaml', { type: 'application/yaml' })
      result.current.onUpload(file)

      expect(uploadDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'ASYNC_EXCHANGE_CALLBACK_INTERFACE',
          doc: file,
        })
      )
    })

    it('should not call uploadDocument when the descriptor is not defined', () => {
      mockUseEServiceCreateContext({ descriptor: undefined })

      const { result } = renderHook(() =>
        useInterfaceDocActions({ doc: null, kind: 'INTERFACE', prettyName: 'Specifica API' })
      )

      result.current.onUpload(new File(['x'], 'x.yaml'))

      expect(uploadDocument).not.toHaveBeenCalled()
    })
  })

  describe('onDelete', () => {
    it('should call deleteDocument with the right payload', () => {
      const descriptor = createMockEServiceDescriptorProviderAsync()
      mockUseEServiceCreateContext({ descriptor })

      const { result } = renderHook(() =>
        useInterfaceDocActions({ doc: mockDoc, kind: 'INTERFACE', prettyName: 'Specifica API' })
      )

      result.current.onDelete()

      expect(deleteDocument).toHaveBeenCalledWith({
        eserviceId: descriptor.eservice.id,
        descriptorId: descriptor.id,
        documentId: mockDoc.id,
      })
    })

    it('should not call deleteDocument when the doc is null', () => {
      mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProviderAsync() })

      const { result } = renderHook(() =>
        useInterfaceDocActions({ doc: null, kind: 'INTERFACE', prettyName: 'Specifica API' })
      )

      result.current.onDelete()

      expect(deleteDocument).not.toHaveBeenCalled()
    })

    it('should not call deleteDocument when the descriptor is not defined', () => {
      mockUseEServiceCreateContext({ descriptor: undefined })

      const { result } = renderHook(() =>
        useInterfaceDocActions({ doc: mockDoc, kind: 'INTERFACE', prettyName: 'Specifica API' })
      )

      result.current.onDelete()

      expect(deleteDocument).not.toHaveBeenCalled()
    })
  })

  describe('onDownload', () => {
    it('should call downloadDocument with the right payload and document name', () => {
      const descriptor = createMockEServiceDescriptorProviderAsync()
      mockUseEServiceCreateContext({ descriptor })

      const { result } = renderHook(() =>
        useInterfaceDocActions({ doc: mockDoc, kind: 'INTERFACE', prettyName: 'Specifica API' })
      )

      result.current.onDownload()

      expect(downloadDocument).toHaveBeenCalledWith(
        {
          eserviceId: descriptor.eservice.id,
          descriptorId: descriptor.id,
          documentId: mockDoc.id,
        },
        mockDoc.name
      )
    })

    it('should not call downloadDocument when the doc is null', () => {
      mockUseEServiceCreateContext({ descriptor: createMockEServiceDescriptorProviderAsync() })

      const { result } = renderHook(() =>
        useInterfaceDocActions({ doc: null, kind: 'INTERFACE', prettyName: 'Specifica API' })
      )

      result.current.onDownload()

      expect(downloadDocument).not.toHaveBeenCalled()
    })

    it('should not call downloadDocument when the descriptor is not defined', () => {
      mockUseEServiceCreateContext({ descriptor: undefined })

      const { result } = renderHook(() =>
        useInterfaceDocActions({ doc: mockDoc, kind: 'INTERFACE', prettyName: 'Specifica API' })
      )

      result.current.onDownload()

      expect(downloadDocument).not.toHaveBeenCalled()
    })
  })
})
