import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import EmptyStateBanner from '../components/EmptyStateBanner'

describe('EmptyStateBanner', () => {
  const props = {
    title: 'No suggested e-services',
    description: 'There are no suggestions available.',
  }

  it('renders the title and description', () => {
    const { getByText } = renderWithApplicationContext(<EmptyStateBanner {...props} />, {})

    expect(getByText(props.title)).toBeInTheDocument()
    expect(getByText(props.description)).toBeInTheDocument()
  })

  it('does not render the catalog button without onGoToCatalog', () => {
    const { queryByRole } = renderWithApplicationContext(<EmptyStateBanner {...props} />, {})

    expect(
      queryByRole('button', { name: 'emptyStateBanner.eservices.goToCatalogButtonLabel' })
    ).not.toBeInTheDocument()
  })

  it('renders the catalog button and calls onGoToCatalog when clicked', async () => {
    const user = userEvent.setup()
    const onGoToCatalog = vi.fn()
    const { getByRole } = renderWithApplicationContext(
      <EmptyStateBanner {...props} onGoToCatalog={onGoToCatalog} />,
      {}
    )
    const button = getByRole('button', {
      name: 'emptyStateBanner.eservices.goToCatalogButtonLabel',
    })

    expect(button).toHaveAttribute('type', 'button')
    expect(onGoToCatalog).not.toHaveBeenCalled()

    await user.click(button)

    expect(onGoToCatalog).toHaveBeenCalledTimes(1)
  })
})
