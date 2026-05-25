import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { UploadCallbackInterfaceDoc } from '../UploadCallbackInterfaceDoc'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceDescriptorProviderAsync,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'

const uploadDocument = vi.fn()
const deleteDocument = vi.fn()

vi.mock('@/api/eservice', () => ({
  EServiceMutations: {
    usePostVersionDraftDocument: () => ({ mutate: uploadDocument }),
    useDeleteVersionDraftDocument: () => ({ mutate: deleteDocument }),
  },
  EServiceDownloads: {
    useDownloadVersionDocument: () => vi.fn(),
  },
}))

vi.mock('@/api/auth', () => ({
  AuthHooks: {
    useJwt: () => ({ jwt: { organization: { name: 'Test Org' } } }),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('UploadCallbackInterfaceDoc', () => {
  it('shows the DocumentContainer when a callback interface is already uploaded', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync(),
    })
    renderWithApplicationContext(<UploadCallbackInterfaceDoc />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByDisplayValue('Specifica callback')).toBeInTheDocument()
  })

  it('shows the upload dropzone when no callback interface is present', () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync({
        asyncExchangeCallbackInterface: undefined,
      }),
    })
    renderWithApplicationContext(<UploadCallbackInterfaceDoc />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('fileInput')).toBeInTheDocument()
  })

  it('calls uploadDocument with kind ASYNC_EXCHANGE_CALLBACK_INTERFACE on submit', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync({
        asyncExchangeCallbackInterface: undefined,
      }),
    })
    renderWithApplicationContext(<UploadCallbackInterfaceDoc />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const file = new File(['hello'], 'callback.yaml', { type: 'application/yaml' })
    const input = screen
      .getByTestId('fileInput')
      .querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(input, file)

    await userEvent.click(screen.getByTestId('submitButton'))

    await waitFor(() => {
      expect(uploadDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: 'ASYNC_EXCHANGE_CALLBACK_INTERFACE',
          doc: file,
        })
      )
    })
  })

  it('waits for the upload preparation before uploading the callback interface', async () => {
    const onBeforeUpload = vi.fn().mockResolvedValue(true)
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync({
        asyncExchangeCallbackInterface: undefined,
      }),
    })
    renderWithApplicationContext(<UploadCallbackInterfaceDoc onBeforeUpload={onBeforeUpload} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const file = new File(['hello'], 'callback.yaml', { type: 'application/yaml' })
    const input = screen
      .getByTestId('fileInput')
      .querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(input, file)

    await userEvent.click(screen.getByTestId('submitButton'))

    await waitFor(() => expect(uploadDocument).toHaveBeenCalled())
    expect(onBeforeUpload.mock.invocationCallOrder[0]).toBeLessThan(
      uploadDocument.mock.invocationCallOrder[0]
    )
  })

  it('does not upload the callback interface when the upload preparation fails', async () => {
    mockUseEServiceCreateContext({
      descriptor: createMockEServiceDescriptorProviderAsync({
        asyncExchangeCallbackInterface: undefined,
      }),
    })
    renderWithApplicationContext(<UploadCallbackInterfaceDoc onBeforeUpload={() => false} />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    const file = new File(['hello'], 'callback.yaml', { type: 'application/yaml' })
    const input = screen
      .getByTestId('fileInput')
      .querySelector('input[type="file"]') as HTMLInputElement
    await userEvent.upload(input, file)

    await userEvent.click(screen.getByTestId('submitButton'))

    expect(uploadDocument).not.toHaveBeenCalled()
  })
})
