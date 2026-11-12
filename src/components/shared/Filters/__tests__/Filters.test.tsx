import React from 'react'
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { useFormContext } from 'react-hook-form'
import type { FilterFields } from '@/types/filters.types'
import { Filters } from '../Filters'

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

const fields: FilterFields = [
  { name: 'q', label: 'Query', type: 'freetext' },
  { name: 'name', label: 'Name', type: 'freetext' },
]

describe('Filters', () => {
  const onChangeActiveFilters = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a FilterField for each field and the submit button', () => {
    render(<Filters fields={fields} filters={{}} onChangeActiveFilters={onChangeActiveFilters} />)
    expect(screen.getByTestId('field-q')).toBeInTheDocument()
    expect(screen.getByTestId('field-name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'button' })).toHaveAttribute('type', 'submit')
  })

  it('initializes the fields with the given filters values', () => {
    render(
      <Filters
        fields={fields}
        filters={{ q: 'abc' }}
        onChangeActiveFilters={onChangeActiveFilters}
      />
    )
    expect(screen.getByTestId('field-q')).toHaveValue('abc')
    expect(screen.getByTestId('field-name')).toHaveValue('')
  })

  it('calls onChangeActiveFilters with the form values on submit', async () => {
    render(<Filters fields={fields} filters={{}} onChangeActiveFilters={onChangeActiveFilters} />)
    fireEvent.change(screen.getByTestId('field-q'), { target: { value: 'hello' } })
    fireEvent.click(screen.getByRole('button', { name: 'button' }))

    await waitFor(() => expect(onChangeActiveFilters).toHaveBeenCalledTimes(1))
    expect(onChangeActiveFilters).toHaveBeenCalledWith({ q: 'hello', name: '' })
  })

  it('resets the form to default values when filters are removed', async () => {
    const { rerender } = render(
      <Filters
        fields={fields}
        filters={{ q: 'abc' }}
        onChangeActiveFilters={onChangeActiveFilters}
      />
    )
    expect(screen.getByTestId('field-q')).toHaveValue('abc')

    rerender(<Filters fields={fields} filters={{}} onChangeActiveFilters={onChangeActiveFilters} />)
    await waitFor(() => expect(screen.getByTestId('field-q')).toHaveValue(''))
  })
})
