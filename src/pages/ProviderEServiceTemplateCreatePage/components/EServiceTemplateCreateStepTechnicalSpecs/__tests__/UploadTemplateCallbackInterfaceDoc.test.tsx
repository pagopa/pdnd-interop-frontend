import { renderWithApplicationContext } from '@/utils/testing.utils'
import {
  createMockEServiceTemplateVersionDetailsAsync,
  mockUseEServiceTemplateCreateContext,
} from '@/../__mocks__/data/eserviceTemplate.mocks'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { UploadTemplateCallbackInterfaceDoc } from '../UploadTemplateCallbackInterfaceDoc'

const uploadDocument = vi.fn()
const deleteDocument = vi.fn()

vi.mock('@/api/eserviceTemplate', () => ({
  EServiceTemplateMutations: {
    usePostVersionDraftDocument: () => ({ mutate: uploadDocument }),
    useDeleteVersionDraftDocument: () => ({ mutate: deleteDocument }),
  },
}))

vi.mock('@/api/eserviceTemplate/eserviceTemplate.downloads', () => ({
  EServiceTemplateDownloads: {
    useDownloadVersionDocument: () => vi.fn(),
  },
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('UploadTemplateCallbackInterfaceDoc', () => {
  it('shows the DocumentContainer when a callback interface is already uploaded', () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetailsAsync(),
    })
    renderWithApplicationContext(<UploadTemplateCallbackInterfaceDoc />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByDisplayValue('Specifica callback')).toBeInTheDocument()
  })

  it('shows the upload dropzone when no callback interface is present', () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetailsAsync({
        asyncExchangeCallbackInterface: undefined,
      }),
    })
    renderWithApplicationContext(<UploadTemplateCallbackInterfaceDoc />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByTestId('fileInput')).toBeInTheDocument()
  })

  it('calls uploadDocument with kind ASYNC_EXCHANGE_CALLBACK_INTERFACE on submit', async () => {
    mockUseEServiceTemplateCreateContext({
      eserviceTemplateVersion: createMockEServiceTemplateVersionDetailsAsync({
        asyncExchangeCallbackInterface: undefined,
      }),
    })
    renderWithApplicationContext(<UploadTemplateCallbackInterfaceDoc />, {
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
          eServiceTemplateId: 'template-id-001',
          eServiceTemplateVersionId: 'version-id-001',
          kind: 'ASYNC_EXCHANGE_CALLBACK_INTERFACE',
          doc: file,
        })
      )
    })
  })
})
