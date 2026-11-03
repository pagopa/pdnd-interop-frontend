import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useForm } from 'react-hook-form'
import { UploadDocumentsInterface } from '../UploadDocumentsInterface'
import userEvent from '@testing-library/user-event'
import { PageContainer } from '@/components/layout/containers'
import { usePageContainerFormDirtyState } from '@/hooks/usePageContainerFormDirtyState'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockSubmit = vi.fn()

const file = new File(['testFile'], 'testFile.pdf', { type: 'document/pdf' })

describe('UploadDocumentsInterface', () => {
  it('renders the form with file input and submit button hidden initially', () => {
    render(<UploadDocumentsInterface onSubmit={mockSubmit} technology="REST" />)

    // Check that the file input is rendered
    const fileInput = screen.getByTestId('fileInput')
    expect(fileInput).toBeInTheDocument()

    // // Check that the submit button is not rendered initially
    const submitButton = screen.queryByRole('button', { name: /uploadInterfaceDocBtn/i })
    expect(submitButton).not.toBeInTheDocument()
  })

  it('shows the submit button when a file is ready to be uploaded', async () => {
    const user = userEvent.setup()
    render(<UploadDocumentsInterface onSubmit={mockSubmit} technology="REST" />)

    const fileInput = screen.getByTestId('fileInput').querySelector('input')!

    await user.upload(fileInput, file)

    const submitButton = await screen.findByTestId('submitButton')

    expect(submitButton).toBeInTheDocument()
  })

  it('calls onSubmit with userEvent', async () => {
    const user = userEvent.setup()
    render(<UploadDocumentsInterface onSubmit={mockSubmit} technology="REST" />)

    const fileInput = screen.getByTestId('fileInput').querySelector('input')!

    await user.upload(fileInput, file)

    const submitButton = await screen.findByTestId('submitButton')
    await user.click(submitButton)

    await waitFor(() => expect(mockSubmit).toHaveBeenCalled())
  })

  it.each([
    {
      technology: 'REST' as const,
      expected: 'dropzone.allowedExtensions.rest',
    },
    {
      technology: 'SOAP' as const,
      expected: 'dropzone.allowedExtensions.soap',
    },
  ])('shows the allowed extensions for $technology interfaces', ({ technology, expected }) => {
    render(<UploadDocumentsInterface onSubmit={mockSubmit} technology={technology} />)

    expect(screen.getByText(expected)).toBeInTheDocument()
  })

  describe('PageContainer unsaved changes', () => {
    const exitDialog = { name: 'exitDialog.title' }

    // Clean outer owner registered on the same step, like the e-service tech spec step form
    const CleanOuterForm = () => {
      const methods = useForm({ defaultValues: { voucherLifespan: 1 } })
      usePageContainerFormDirtyState(methods.control)
      return null
    }

    const renderInWizard = () =>
      renderWithApplicationContext(
        // Prevents the exit link from navigating so the prompt state can be asserted repeatedly
        <div
          onClickCapture={(event) => {
            if ((event.target as Element).closest('a')) event.preventDefault()
          }}
        >
          <PageContainer navigation={{ mode: 'wizard', exitAction: { to: 'DEFAULT' } }}>
            <CleanOuterForm />
            <UploadDocumentsInterface onSubmit={mockSubmit} technology="REST" />
          </PageContainer>
        </div>,
        { withRouterContext: true, withDialogContext: true }
      )

    const getFileInput = () => screen.getByTestId('fileInput').querySelector('input')!

    it('does not prompt on exit while no interface file is selected', async () => {
      renderInWizard()

      await userEvent.click(screen.getByRole('link', { name: 'exitButton' }))

      expect(screen.queryByRole('dialog', exitDialog)).not.toBeInTheDocument()
    })

    it('prompts on exit for a pending interface file, retains it on cancel and stops after removal', async () => {
      const user = userEvent.setup()
      renderInWizard()

      await user.upload(getFileInput(), file)
      await screen.findByTestId('submitButton')

      await user.click(screen.getByRole('link', { name: 'exitButton' }))
      expect(screen.getByRole('dialog', exitDialog)).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'exitDialog.cancelButton' }))
      await waitFor(() => expect(screen.queryByRole('dialog', exitDialog)).not.toBeInTheDocument())
      expect(screen.getByTestId('submitButton')).toBeInTheDocument()

      await user.click(screen.getByRole('link', { name: 'exitButton' }))
      expect(screen.getByRole('dialog', exitDialog)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'exitDialog.cancelButton' }))
      await waitFor(() => expect(screen.queryByRole('dialog', exitDialog)).not.toBeInTheDocument())

      // Removing the selected file programmatically resets the field to null
      const removeFileButton = screen
        .getAllByTestId('CloseIcon')
        .map((icon) => icon.closest('button'))
        .find((button) => button && !button.closest('nav, a'))
      await user.click(removeFileButton!)
      await waitFor(() => expect(screen.queryByTestId('submitButton')).not.toBeInTheDocument())

      await user.click(screen.getByRole('link', { name: 'exitButton' }))
      expect(screen.queryByRole('dialog', exitDialog)).not.toBeInTheDocument()
    })
  })
})
