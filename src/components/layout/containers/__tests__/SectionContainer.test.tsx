import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SectionContainer } from '../SectionContainer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('SectionContainer', () => {
  it('renders the titleEndAdornment next to the title', () => {
    renderWithApplicationContext(
      <SectionContainer title="My section" titleEndAdornment={<span data-testid="adornment" />}>
        <div />
      </SectionContainer>,
      {}
    )

    expect(screen.getByText('My section')).toBeInTheDocument()
    expect(screen.getByTestId('adornment')).toBeInTheDocument()
  })

  it('renders the title end adornment even without a title', () => {
    renderWithApplicationContext(
      <SectionContainer titleEndAdornment={<span data-testid="adornment" />}>
        <div />
      </SectionContainer>,
      {}
    )

    expect(screen.getByTestId('adornment')).toBeInTheDocument()
  })
})
