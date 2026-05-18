import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { screen, waitFor } from '@testing-library/react'
import { EServiceAsyncExchangeSection } from '../EServiceAsyncExchangeSection'
import {
  createMockEServiceDescriptorProviderAsync,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'

vi.mock('../../components/UploadCallbackInterfaceDoc', () => ({
  UploadCallbackInterfaceDoc: ({ readOnly }: { readOnly?: boolean }) => (
    <div>{readOnly ? 'UploadCallbackInterfaceDoc-readOnly' : 'UploadCallbackInterfaceDoc'}</div>
  ),
}))

vi.mock('@/api/eservice', () => ({
  EServiceDownloads: {
    useDownloadVersionDocument: () => vi.fn(),
  },
}))

const defaultFormValues = {
  asyncExchangeProperties: {
    responseTime: 1,
    resourceAvailableTime: 1,
    maxResultSet: 1,
    confirmation: false,
    bulk: false,
  },
}

const renderComponent = (
  areEServiceGeneralInfoEditable = true,
  descriptorOverrides: Parameters<typeof createMockEServiceDescriptorProviderAsync>[0] = {},
  formValues: typeof defaultFormValues = defaultFormValues
) => {
  mockUseEServiceCreateContext({
    descriptor: createMockEServiceDescriptorProviderAsync(descriptorOverrides),
    areEServiceGeneralInfoEditable,
  })
  return renderWithApplicationContext(
    <ReactHookFormWrapper defaultValues={formValues}>
      <EServiceAsyncExchangeSection
        areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
      />
    </ReactHookFormWrapper>,
    { withReactQueryContext: true, withRouterContext: true }
  )
}

describe('EServiceAsyncExchangeSection', () => {
  it('should render the section in editing mode with upload, alert and all fields', () => {
    renderComponent(true)

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('editableInfoAlert')).toBeInTheDocument()
    expect(screen.getByText('UploadCallbackInterfaceDoc')).toBeInTheDocument()
    expect(screen.getByText('configSubsection.title')).toBeInTheDocument()
    expect(screen.getByText('advancedSubsection.title')).toBeInTheDocument()
    expect(screen.getByLabelText(/responseTimeField.label/)).toBeInTheDocument()
    expect(screen.getByLabelText(/maxResultSetField.label/)).toBeInTheDocument()
    expect(screen.getByLabelText(/resourceAvailableTimeField.label/)).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /confirmationField.label/ })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /bulkField.label/ })).toBeInTheDocument()
  })

  it('should disable the bulk checkbox when technology is SOAP', () => {
    renderComponent(true, {
      eservice: {
        ...createMockEServiceDescriptorProviderAsync().eservice,
        technology: 'SOAP',
      },
    })

    const bulkCheckbox = screen.getByRole('checkbox', {
      name: /bulkField.label/,
    }) as HTMLInputElement
    expect(bulkCheckbox).toBeDisabled()
  })

  it('should force bulk to false when technology is SOAP, even if it starts as true', async () => {
    renderComponent(
      true,
      {
        eservice: {
          ...createMockEServiceDescriptorProviderAsync().eservice,
          technology: 'SOAP',
        },
      },
      {
        asyncExchangeProperties: {
          ...defaultFormValues.asyncExchangeProperties,
          bulk: true,
        },
      }
    )

    const bulkCheckbox = screen.getByRole('checkbox', {
      name: /bulkField.label/,
    }) as HTMLInputElement

    await waitFor(() => {
      expect(bulkCheckbox.checked).toBe(false)
    })
  })

  it('should not disable the bulk checkbox when technology is REST', () => {
    renderComponent(true)
    const bulkCheckbox = screen.getByRole('checkbox', {
      name: /bulkField.label/,
    }) as HTMLInputElement
    expect(bulkCheckbox).not.toBeDisabled()
  })

  it('should render in read-only mode when areEServiceGeneralInfoEditable is false', () => {
    renderComponent(false)

    expect(screen.queryByText('editableInfoAlert')).not.toBeInTheDocument()
    expect(screen.queryByText('UploadCallbackInterfaceDoc')).not.toBeInTheDocument()
    expect(screen.getByText('UploadCallbackInterfaceDoc-readOnly')).toBeInTheDocument()
    expect(screen.queryByLabelText(/responseTimeField.label/)).not.toBeInTheDocument()
    expect(screen.getByText('callbackInterface.readOnlyLabel')).toBeInTheDocument()
  })
})
