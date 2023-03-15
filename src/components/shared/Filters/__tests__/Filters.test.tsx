import React from 'react'
import type { ActiveFilters, FilterFields } from '@/types/filter.types'
import renderer from 'react-test-renderer'
import { vi } from 'vitest'
import { Filters } from '../Filters'
import { Route, Router, Routes } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import { fireEvent, waitFor } from '@testing-library/react'

const setAutocompleteInputFn = vi.fn()

const fieldMocks: FilterFields = [
  { name: 'single-field', type: 'single', label: 'Single Filter Field' },
  {
    name: 'multiple-field',
    type: 'multiple',
    options: [
      { label: 'Option1', value: 'option-1' },
      { label: 'Option2', value: 'option-2' },
    ],
    label: 'Multiple Filter Field',
    setAutocompleteInput: setAutocompleteInputFn,
  },
]

const activeFiltersMocks: ActiveFilters = [
  { label: 'Option1', value: 'option-1', type: 'multiple', filterKey: 'multiple-field' },
  { label: 'Option2', value: 'option-2', type: 'multiple', filterKey: 'multiple-field' },
  { label: 'Test', value: 'test-value', type: 'single', filterKey: 'single-field' },
]

const history = createMemoryHistory()

const SnapshotWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Router location={history.location} navigator={history}>
      <Routes>
        <Route path="/" element={children} />
      </Routes>
    </Router>
  )
}

describe('Filters component', () => {
  it('matches the snapshot without active filters', () => {
    const tree = renderer
      .create(
        <SnapshotWrapper>
          <Filters
            fields={fieldMocks}
            activeFilters={[]}
            onChangeActiveFilter={vi.fn()}
            onRemoveActiveFilter={vi.fn()}
            onResetActiveFilters={vi.fn()}
          />
        </SnapshotWrapper>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches the snapshot with one active filter', () => {
    const tree = renderer
      .create(
        <SnapshotWrapper>
          <Filters
            fields={fieldMocks}
            activeFilters={[activeFiltersMocks[0]]}
            onChangeActiveFilter={vi.fn()}
            onRemoveActiveFilter={vi.fn()}
            onResetActiveFilters={vi.fn()}
          />
        </SnapshotWrapper>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('matches the snapshot with more than one active filters', () => {
    const tree = renderer
      .create(
        <SnapshotWrapper>
          <Filters
            fields={fieldMocks}
            activeFilters={activeFiltersMocks}
            onChangeActiveFilter={vi.fn()}
            onRemoveActiveFilter={vi.fn()}
            onResetActiveFilters={vi.fn()}
          />
        </SnapshotWrapper>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should correctly add a filter using single filter field', async () => {
    const user = userEvent.setup()
    const onChangeActiveFilterFn = vi.fn()
    const screen = renderWithApplicationContext(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onChangeActiveFilter={onChangeActiveFilterFn}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
      />,
      { withRouterContext: true }
    )

    const singleFilterField = screen.getByLabelText('Single Filter Field') as HTMLInputElement
    await user.type(singleFilterField, 'test-value')
    expect(singleFilterField.value).toBe('test-value')
    await user.type(singleFilterField, '{enter}')
    expect(onChangeActiveFilterFn).toBeCalledWith('single', 'single-field', 'test-value')
    expect(singleFilterField.value).toBe('')
  })

  it('should correctly add a filter using multiple filter field', async () => {
    const user = userEvent.setup()

    const onChangeActiveFilterFn = vi.fn()
    const screen = renderWithApplicationContext(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onChangeActiveFilter={onChangeActiveFilterFn}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
      />,
      { withRouterContext: true }
    )

    const multipleFilterField = screen.getByLabelText('Multiple Filter Field') as HTMLSelectElement
    await user.click(multipleFilterField)
    vi.useFakeTimers()
    const option1 = screen.getByRole('option', { name: 'Option1' })
    fireEvent.click(option1)
    const option2 = screen.getByRole('option', { name: 'Option2' })
    fireEvent.click(option2)
    vi.advanceTimersByTime(400)
    expect(onChangeActiveFilterFn).toBeCalledWith('multiple', 'multiple-field', [
      {
        label: 'Option1',
        value: 'option-1',
      },
      {
        label: 'Option2',
        value: 'option-2',
      },
    ])
    vi.useRealTimers()
  })

  it('should correctly remove a filter', async () => {
    const onRemoveActiveFilterFn = vi.fn()
    const screen = renderWithApplicationContext(
      <Filters
        fields={fieldMocks}
        activeFilters={activeFiltersMocks}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={onRemoveActiveFilterFn}
        onResetActiveFilters={vi.fn()}
      />,
      { withRouterContext: true }
    )

    const activeFilterChip = screen.getAllByTestId('CancelIcon')[0]
    fireEvent.click(activeFilterChip)
    expect(onRemoveActiveFilterFn).toBeCalledWith('multiple', 'multiple-field', 'option-1')
  })

  it('should clear filters on remove filters button click', async () => {
    const onResetActiveFilters = vi.fn()
    const user = userEvent.setup()

    const screen = renderWithApplicationContext(
      <Filters
        fields={fieldMocks}
        activeFilters={activeFiltersMocks}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={onResetActiveFilters}
      />,
      { withRouterContext: true }
    )

    const clearFiltersButton = screen.getByRole('button', { name: 'cancelFilter' })
    await user.click(clearFiltersButton)
    expect(onResetActiveFilters).toBeCalled()
  })

  it('should call setAutocompleteInput only if there are more than two chars', async () => {
    const user = userEvent.setup()

    const screen = renderWithApplicationContext(
      <Filters
        fields={fieldMocks}
        activeFilters={[]}
        onChangeActiveFilter={vi.fn()}
        onRemoveActiveFilter={vi.fn()}
        onResetActiveFilters={vi.fn()}
      />,
      { withRouterContext: true }
    )

    const multipleFilterField = screen.getByLabelText('Multiple Filter Field') as HTMLInputElement
    await user.type(multipleFilterField, 'te')
    await waitFor(() => {
      expect(setAutocompleteInputFn).toBeCalledWith('')
    })
    await user.type(multipleFilterField, 'st')
    await waitFor(() => {
      expect(setAutocompleteInputFn).toBeCalledWith('test')
    })

    screen.unmount()
  })
})
