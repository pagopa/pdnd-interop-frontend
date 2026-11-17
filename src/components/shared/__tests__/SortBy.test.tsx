import React from 'react'
import { render as rtlRender, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { SortBy } from '../SortBy'

const render = (ui: React.ReactElement) =>
  rtlRender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)

const options = [
  { label: 'Name', value: 'name' },
  { label: 'Date', value: 'date' },
]

describe('SortBy', () => {
  const onSortingChange = vi.fn()

  beforeEach(() => {
    onSortingChange.mockClear()
  })

  it('renders the label of the selected option', () => {
    render(<SortBy options={options} sortBy="date" onSortingChange={onSortingChange} />)
    expect(screen.getByRole('button', { name: 'Date' })).toBeInTheDocument()
  })

  it('renders an empty label when sortBy matches no option', () => {
    render(<SortBy options={options} sortBy="unknown" onSortingChange={onSortingChange} />)
    expect(screen.getByRole('button')).toHaveTextContent('')
  })

  it('keeps the menu closed initially', () => {
    render(<SortBy options={options} sortBy="name" onSortingChange={onSortingChange} />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-expanded')
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-controls')
  })

  it('opens the menu with all options when the button is clicked', () => {
    render(<SortBy options={options} sortBy="name" onSortingChange={onSortingChange} />)
    const button = screen.getByRole('button', { name: 'Name' })
    fireEvent.click(button)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-controls')
    expect(screen.getAllByRole('menuitem')).toHaveLength(2)
  })

  it('calls onSortingChange with the option value and close the menu when an item is clicked', () => {
    render(<SortBy options={options} sortBy="name" onSortingChange={onSortingChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Name' }))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Date' }))

    expect(onSortingChange).toHaveBeenCalledTimes(1)
    expect(onSortingChange).toHaveBeenCalledWith('date')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-expanded')
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-controls')
  })
})
