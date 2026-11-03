import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogBasic } from '../DialogBasic'
import { apiGuideLink } from '@/config/constants'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { SupportActionGuardProvider } from '@/hooks/useIsActionDisabledBySupport'
import { Dialog } from '../Dialog'
import { useDialog } from '@/stores'

describe('DialogBasic', () => {
  it('keeps a regular basic mutation confirmation disabled for support through the dialog host', async () => {
    const user = userEvent.setup()
    const onProceed = vi.fn()
    const MutationAction = () => {
      const { openDialog } = useDialog()
      return (
        <button
          onClick={() =>
            openDialog({
              type: 'basic',
              title: 'Confirm mutation',
              onProceed,
              disabled: false,
              checkbox: 'I understand',
            })
          }
        >
          Open mutation
        </button>
      )
    }

    renderWithApplicationContext(
      <SupportActionGuardProvider isSupport>
        <MutationAction />
        <Dialog />
      </SupportActionGuardProvider>,
      {}
    )

    await user.click(screen.getByRole('button', { name: 'Open mutation' }))
    await user.click(screen.getByRole('checkbox', { name: 'I understand' }))
    expect(screen.getByRole('checkbox', { name: 'I understand' })).toBeChecked()
    const confirmButton = screen.getByRole('button', { name: 'confirm' })
    expect(confirmButton).toBeDisabled()
    expect(onProceed).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog', { name: 'Confirm mutation' })).toBeVisible()
  })

  it('should render a description link when provided', () => {
    renderWithApplicationContext(
      <DialogBasic
        type="basic"
        title="Dialog title"
        description="Dialog description with <1>guide</1>."
        descriptionLink={{ href: apiGuideLink }}
        onProceed={vi.fn()}
      />,
      {}
    )

    expect(screen.getByRole('link', { name: 'guide' })).toHaveAttribute('href', apiGuideLink)
  })

  it('should render strong description text', () => {
    renderWithApplicationContext(
      <DialogBasic
        type="basic"
        title="Dialog title"
        description="Dialog description with <strong>important text</strong>."
        onProceed={vi.fn()}
      />,
      {}
    )

    expect(screen.getByText('important text')).toBeVisible()
  })

  it('should render placeholder tags as plain text when no link is provided', () => {
    renderWithApplicationContext(
      <DialogBasic
        type="basic"
        title="Dialog title"
        description="Dialog description with <1>guide</1>."
        onProceed={vi.fn()}
      />,
      {}
    )

    expect(screen.getByText('Dialog description with guide.')).toBeVisible()
    expect(screen.queryByRole('link', { name: 'guide' })).not.toBeInTheDocument()
  })

  it('should require checking the confirmation checkbox before proceeding', async () => {
    const user = userEvent.setup()
    const onProceed = vi.fn()

    renderWithApplicationContext(
      <DialogBasic
        type="basic"
        title="Dialog title"
        checkbox="I understand"
        onProceed={onProceed}
      />,
      {}
    )

    const confirmButton = screen.getByRole('button', { name: 'confirm' })
    expect(confirmButton).toBeDisabled()

    await user.click(screen.getByRole('checkbox', { name: 'I understand' }))
    expect(confirmButton).toBeEnabled()

    await user.click(confirmButton)

    expect(onProceed).toHaveBeenCalledTimes(1)
  })
})
