import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { UploadDocumentsInterfaceComponent } from '../UploadDocumentsInterfaceComponent'
import type { UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'
import React from 'react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'

type FormValues = {
  interfaceDoc: File | null
}

const mockWatch = vi.fn()
const mockSetValue = vi.fn()
const mockSubmit = vi.fn()

const file = new File(['testFile'], 'testFile.pdf', { type: 'document/pdf' })

const FormWrapper: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      interfaceDoc: file,
    },
  })

  formMethods.watch = mockWatch as UseFormWatch<FormValues>
  formMethods.setValue = mockSetValue as UseFormSetValue<FormValues>

  return <FormProvider {...formMethods}>{children}</FormProvider>
}

describe('UploadDocumentsInterfaceComponent', () => {
  it('renders the form with file input and submit button hidden initially', () => {
    render(<UploadDocumentsInterfaceComponent onSubmit={mockSubmit} />)

    // Check that the file input is rendered
    const fileInput = screen.getByTestId('fileInput')
    expect(fileInput).toBeInTheDocument()

    // // Check that the submit button is not rendered initially
    const submitButton = screen.queryByRole('button', { name: /uploadInterfaceDocBtn/i })
    expect(submitButton).not.toBeInTheDocument()
  })

  it('shows the submit button when a file is selected', async () => {
    const user = userEvent.setup()
    render(<UploadDocumentsInterfaceComponent onSubmit={mockSubmit} />)

    const fileInput = screen.getByTestId('fileInput').querySelector('input')!

    await user.upload(fileInput, file)

    const submitButton = await screen.findByTestId('submitButton')

    expect(submitButton).toBeInTheDocument()
  })

  it('calls onSubmit with userEvent', async () => {
    const user = userEvent.setup()
    render(<UploadDocumentsInterfaceComponent onSubmit={mockSubmit} />)

    const fileInput = screen.getByTestId('fileInput').querySelector('input')!

    await user.upload(fileInput, file)

    const submitButton = await screen.findByTestId('submitButton')
    await user.click(submitButton)

    await waitFor(() => expect(mockSubmit).toHaveBeenCalled())
  })
})
