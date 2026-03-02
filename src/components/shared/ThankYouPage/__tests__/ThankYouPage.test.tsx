import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckIcon from '@mui/icons-material/Check'
import { ThankYouPage } from '../ThankYouPage'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('ThankYouPage', () => {
  const defaultProps = {
    icon: CheckIcon,
    title: 'Thank you!',
    description: <p>Your action was successful.</p>,
    buttonLabel: 'Go back',
    onButtonClick: vi.fn(),
  }

  it('renders the title', () => {
    renderWithApplicationContext(<ThankYouPage {...defaultProps} />, {
      withRouterContext: true,
    })

    expect(screen.getByRole('heading', { name: 'Thank you!' })).toBeInTheDocument()
  })

  it('renders the description', () => {
    renderWithApplicationContext(<ThankYouPage {...defaultProps} />, {
      withRouterContext: true,
    })

    expect(screen.getByText('Your action was successful.')).toBeInTheDocument()
  })

  it('renders the button with the correct label', () => {
    renderWithApplicationContext(<ThankYouPage {...defaultProps} />, {
      withRouterContext: true,
    })

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument()
  })

  it('calls onButtonClick when button is clicked', async () => {
    const user = userEvent.setup()
    const onButtonClick = vi.fn()

    renderWithApplicationContext(<ThankYouPage {...defaultProps} onButtonClick={onButtonClick} />, {
      withRouterContext: true,
    })

    await user.click(screen.getByRole('button', { name: 'Go back' }))
    expect(onButtonClick).toHaveBeenCalledOnce()
  })

  it('renders the icon', () => {
    renderWithApplicationContext(<ThankYouPage {...defaultProps} />, {
      withRouterContext: true,
    })

    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument()
  })
})
