import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DialogBasic } from '../DialogBasic'
import { apiGuideLink } from '@/config/constants'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('DialogBasic', () => {
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
