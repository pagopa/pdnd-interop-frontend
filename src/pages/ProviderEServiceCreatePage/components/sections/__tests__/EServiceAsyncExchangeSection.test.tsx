import { ReactHookFormWrapper, renderWithApplicationContext } from '@/utils/testing.utils'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { EServiceAsyncExchangeSection } from '../EServiceAsyncExchangeSection'
import { EServiceAsyncExchangeSectionBase } from '../EServiceAsyncExchangeSectionBase'
import {
  createMockEServiceDescriptorProviderAsync,
  mockUseEServiceCreateContext,
} from '@/../__mocks__/data/eservice.mocks'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'

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
  formValues: typeof defaultFormValues = defaultFormValues,
  isEServiceCreatedFromTemplate = false
) => {
  mockUseEServiceCreateContext({
    descriptor: createMockEServiceDescriptorProviderAsync(descriptorOverrides),
    areEServiceGeneralInfoEditable,
  })
  return renderWithApplicationContext(
    <ReactHookFormWrapper defaultValues={formValues}>
      <EServiceAsyncExchangeSection
        areEServiceGeneralInfoEditable={areEServiceGeneralInfoEditable}
        isEServiceCreatedFromTemplate={isEServiceCreatedFromTemplate}
      />
    </ReactHookFormWrapper>,
    { withReactQueryContext: true, withRouterContext: true }
  )
}

const AsyncExchangeValidationTestForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const methods = useForm({ defaultValues: defaultFormValues })

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        <EServiceAsyncExchangeSectionBase
          areGeneralInfoEditable={true}
          areAdvancedOptionsEditable={true}
          editableCallbackInterfaceContent="UploadCallbackInterfaceDoc"
          readOnlyCallbackInterfaceContent="UploadCallbackInterfaceDoc-readOnly"
        />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  )
}

const renderValidationTestForm = (onSubmit = vi.fn()) => {
  renderWithApplicationContext(<AsyncExchangeValidationTestForm onSubmit={onSubmit} />, {
    withReactQueryContext: true,
    withRouterContext: true,
  })

  return onSubmit
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

  it('should render the callback interface without an extra label for e-services created from template', () => {
    renderComponent(true, {}, defaultFormValues, true)

    expect(screen.getByText('UploadCallbackInterfaceDoc-readOnly')).toBeInTheDocument()
    expect(screen.queryByText('callbackInterface.readOnlyLabel')).not.toBeInTheDocument()
  })

  it('should prevent submit when async exchange numeric values exceed their limits', async () => {
    const onSubmit = renderValidationTestForm()

    await userEvent.clear(screen.getByLabelText(/responseTimeField.label/))
    await userEvent.type(screen.getByLabelText(/responseTimeField.label/), '1000000')
    await userEvent.clear(screen.getByLabelText(/resourceAvailableTimeField.label/))
    await userEvent.type(screen.getByLabelText(/resourceAvailableTimeField.label/), '1000000')
    await userEvent.clear(screen.getByLabelText(/maxResultSetField.label/))
    await userEvent.type(screen.getByLabelText(/maxResultSetField.label/), '100000')
    await userEvent.click(screen.getByText('submit'))

    expect(await screen.findAllByText('validation.number.max')).toHaveLength(3)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('should prevent submit when async exchange numeric values are below their minimum', async () => {
    const onSubmit = renderValidationTestForm()

    fireEvent.change(screen.getByLabelText(/responseTimeField.label/), { target: { value: '0' } })
    fireEvent.change(screen.getByLabelText(/resourceAvailableTimeField.label/), {
      target: { value: '0' },
    })
    fireEvent.change(screen.getByLabelText(/maxResultSetField.label/), { target: { value: '0' } })
    await userEvent.click(screen.getByText('submit'))

    expect(await screen.findAllByText('validation.number.min')).toHaveLength(3)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
