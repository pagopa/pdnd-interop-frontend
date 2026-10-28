import React from 'react'
import { render as rtlRender, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import { FiltersSection } from '../FiltersSection'

const withTheme = (ui: React.ReactElement) => <ThemeProvider theme={theme}>{ui}</ThemeProvider>

const render = (ui: React.ReactElement) => {
  const result = rtlRender(withTheme(ui))
  return {
    ...result,
    rerender: (next: React.ReactElement) => result.rerender(withTheme(next)),
  }
}

const filtersMock = vi.fn()
const additionalFiltersMock = vi.fn()
const sortByMock = vi.fn()

vi.mock('../Filters', () => ({
  Filters: (props: unknown) => {
    filtersMock(props)
    return <div data-testid="filters" />
  },
}))

vi.mock('../AdditionalFilters', () => ({
  AdditionalFilters: (props: unknown) => {
    additionalFiltersMock(props)
    return <div data-testid="additional-filters" />
  },
}))

vi.mock('../../SortBy', () => ({
  SortBy: (props: unknown) => {
    sortByMock(props)
    return <div data-testid="sort-by" />
  },
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { count?: number }) =>
      opts?.count !== undefined ? `${key}:${opts.count}` : key,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const defaultProps = {
  filters: {},
  fields: [],
  onChangeActiveFilters: vi.fn(),
  onResetActiveFilters: vi.fn(),
}

describe('FiltersSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Filters with the given props', () => {
    const filters = { q: 'abc' }
    render(<FiltersSection {...defaultProps} filters={filters} />)
    expect(screen.getByTestId('filters')).toBeInTheDocument()
    expect(filtersMock).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: defaultProps.fields,
        filters,
        onChangeActiveFilters: defaultProps.onChangeActiveFilters,
      })
    )
  })

  it('shows 0 results by default and the given number when provided', () => {
    const { rerender } = render(<FiltersSection {...defaultProps} />)
    expect(screen.getByText('results:0')).toBeInTheDocument()

    rerender(<FiltersSection {...defaultProps} results={42} />)
    expect(screen.getByText('results:42')).toBeInTheDocument()
  })

  it('hides results and the empty metadata row when showResults is false', () => {
    render(<FiltersSection {...defaultProps} showResults={false} />)

    expect(screen.queryByText('results:0')).not.toBeInTheDocument()
    expect(screen.getByTestId('filters').parentElement?.children).toHaveLength(1)
  })

  it('does not render AdditionalFilters when additionals is undefined or empty', () => {
    const { rerender } = render(<FiltersSection {...defaultProps} />)
    expect(screen.queryByTestId('additional-filters')).not.toBeInTheDocument()

    rerender(<FiltersSection {...defaultProps} additionals={[]} />)
    expect(screen.queryByTestId('additional-filters')).not.toBeInTheDocument()
  })

  it('renders AdditionalFilters when additionals are provided', () => {
    const additionals = [{ label: 'section', fields: [] }] as never
    render(<FiltersSection {...defaultProps} additionals={additionals} />)
    expect(screen.getByTestId('additional-filters')).toBeInTheDocument()
    expect(additionalFiltersMock).toHaveBeenCalledWith(
      expect.objectContaining({ fields: additionals, filters: defaultProps.filters })
    )
  })

  it('hides the remove button when there are no active filters', () => {
    render(<FiltersSection {...defaultProps} filters={{ q: '' }} />)
    expect(screen.queryByText('remove')).not.toBeInTheDocument()
  })

  it('shows the remove button with active filters and calls onResetActiveFilters on click', () => {
    render(<FiltersSection {...defaultProps} filters={{ q: 'abc' }} />)
    fireEvent.click(screen.getByText('remove'))
    expect(defaultProps.onResetActiveFilters).toHaveBeenCalledTimes(1)
  })

  it('does not render SortBy without sorting or with empty options', () => {
    const { rerender } = render(<FiltersSection {...defaultProps} />)
    expect(screen.queryByTestId('sort-by')).not.toBeInTheDocument()

    rerender(
      <FiltersSection
        {...defaultProps}
        sorting={{ options: [], sortBy: 'a', onSortingChange: vi.fn() }}
      />
    )
    expect(screen.queryByTestId('sort-by')).not.toBeInTheDocument()
  })

  it('renders SortBy with sorting props when options exist', () => {
    const sorting = {
      options: [{ label: 'A', value: 'a' }],
      sortBy: 'a',
      onSortingChange: vi.fn(),
    }
    render(<FiltersSection {...defaultProps} sorting={sorting} />)
    expect(screen.getByTestId('sort-by')).toBeInTheDocument()
    expect(sortByMock).toHaveBeenCalledWith(expect.objectContaining(sorting))
  })
})
