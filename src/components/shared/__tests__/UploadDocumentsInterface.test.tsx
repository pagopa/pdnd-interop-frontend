import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { UploadDocumentsInterface } from '../UploadDocumentsInterface'
import userEvent from '@testing-library/user-event'

const mockSubmit = vi.fn()

const file = new File(['testFile'], 'testFile.pdf', { type: 'document/pdf' })

describe('UploadDocumentsInterface', () => {
  it('renders the form with file input and submit button hidden initially', () => {
    render(<UploadDocumentsInterface onSubmit={mockSubmit} />)

    // Check that the file input is rendered
    const fileInput = screen.getByTestId('fileInput')
    expect(fileInput).toBeInTheDocument()

    // // Check that the submit button is not rendered initially
    const submitButton = screen.queryByRole('button', { name: /uploadInterfaceDocBtn/i })
    expect(submitButton).not.toBeInTheDocument()
  })

  it('show the submit button when a file is ready to uploaded', async () => {
    const user = userEvent.setup()
    render(<UploadDocumentsInterface onSubmit={mockSubmit} />)

    const fileInput = screen.getByTestId('fileInput').querySelector('input')!

    await user.upload(fileInput, file)

    const submitButton = await screen.findByTestId('submitButton')

    expect(submitButton).toBeInTheDocument()
  })

  it('calls onSubmit with userEvent', async () => {
    const user = userEvent.setup()
    render(<UploadDocumentsInterface onSubmit={mockSubmit} />)

    const fileInput = screen.getByTestId('fileInput').querySelector('input')!

    await user.upload(fileInput, file)

    const submitButton = await screen.findByTestId('submitButton')
    await user.click(submitButton)

    await waitFor(() => expect(mockSubmit).toHaveBeenCalled())
  })
})
