import React from 'react'
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { useFormContext } from 'react-hook-form'
import type { AdditionalFiltersSection } from '@/types/filters.types'
import { AdditionalFilters } from '../AdditionalFilters'

const withTheme = (ui: React.ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>

const render = (ui: React.ReactElement) => {
  const result = rtlRender(withTheme(ui))
  return {
    ...result,
    rerender: (next: React.ReactElement) => result.rerender(withTheme(next)),
  }
}

vi.mock('../FilterField', () => ({
  FilterField: ({ field }: { field: { name: string } }) => {
    const { register } = useFormContext()
    return <input data-testid={`field-${field.name}`} {...register(field.name)} />
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const sections: AdditionalFiltersSection[] = [
  { title: 'Section A', fields: [{ name: 'q', label: 'Query', type: 'freetext' }] },
  { title: 'Section B', fields: [{ name: 'name', label: 'Name', type: 'freetext' }] },
]

describe('AdditionalFilters', () => {
  const onChangeActiveFilters = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = (filters = {}) =>
    render(
      <AdditionalFilters
        fields={sections}
        filters={filters}
        onChangeActiveFilters={onChangeActiveFilters}
      />
    )

  it('renders the trigger and keeps the drawer closed initially', () => {
    renderComponent()
    expect(screen.getByRole('button', { name: 'trigger' })).toBeInTheDocument()
    expect(screen.queryByText('title')).not.toBeInTheDocument()
  })

  it('opens the drawer showing sections and fields', () => {
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: 'trigger' }))
    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('Section A')).toBeInTheDocument()
    expect(screen.getByText('Section B')).toBeInTheDocument()
    expect(screen.getByTestId('field-q')).toBeInTheDocument()
    expect(screen.getByTestId('field-name')).toBeInTheDocument()
  })

  it('shows the active filters count badge', () => {
    renderComponent({ q: 'abc', name: 'x' })
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('does not show the badge without active filters', () => {
    renderComponent()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('initializes fields with the given filters values', () => {
    renderComponent({ q: 'abc' })
    fireEvent.click(screen.getByRole('button', { name: 'trigger' }))
    expect(screen.getByTestId('field-q')).toHaveValue('abc')
    expect(screen.getByTestId('field-name')).toHaveValue('')
  })

  it('calls onChangeActiveFilters with form values on apply and closes the drawer', async () => {
    renderComponent()
    fireEvent.click(screen.getByRole('button', { name: 'trigger' }))
    fireEvent.change(screen.getByTestId('field-q'), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'actions.apply' }))

    await waitFor(() => expect(onChangeActiveFilters).toHaveBeenCalledTimes(1))
    expect(onChangeActiveFilters).toHaveBeenCalledWith({ q: 'hello', name: '' })
    await waitFor(() => expect(screen.queryByText('title')).not.toBeInTheDocument())
  })

  it('calls onChangeActiveFilters with default values on reset and closes the drawer', async () => {
    renderComponent({ q: 'abc' })
    fireEvent.click(screen.getByRole('button', { name: 'trigger' }))
    fireEvent.click(screen.getByRole('button', { name: 'actions.reset' }))

    expect(onChangeActiveFilters).toHaveBeenCalledWith({ q: '', name: '' })
    await waitFor(() => expect(screen.queryByText('title')).not.toBeInTheDocument())
  })

  it('closes the drawer and discards unsaved changes via the close button', async () => {
    renderComponent({ q: 'abc' })
    fireEvent.click(screen.getByRole('button', { name: 'trigger' }))
    fireEvent.change(screen.getByTestId('field-q'), { target: { value: 'changed' } })
    fireEvent.click(screen.getByRole('button', { name: 'closeIconAriaLabel' }))

    await waitFor(() => expect(screen.queryByText('title')).not.toBeInTheDocument())
    expect(onChangeActiveFilters).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'trigger' }))
    await waitFor(() => expect(screen.getByTestId('field-q')).toHaveValue('abc'))
  })
})
