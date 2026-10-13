import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FilterField } from '../FilterField'
import type { FilterField as TFilterField } from '@/types/filters.types'

const mocks = vi.hoisted(() => ({
  textField: vi.fn(),
  select: vi.fn(),
  switchMock: vi.fn(),
  autoSingle: vi.fn(),
  autoMultiple: vi.fn(),
  datePicker: vi.fn(),
}))

vi.mock('../../react-hook-form-inputs', () => ({
  RHFNewTextField: (props: unknown) => {
    mocks.textField(props)
    return <div data-testid="text-field" />
  },
  RHFNewSelect: (props: unknown) => {
    mocks.select(props)
    return <div data-testid="select" />
  },
  RHFNewSwitch: (props: unknown) => {
    mocks.switchMock(props)
    return <div data-testid="switch" />
  },
  RHFNewAutocompleteSingle: (props: unknown) => {
    mocks.autoSingle(props)
    return <div data-testid="autocomplete-single" />
  },
  RHFNewAutocompleteMultiple: (props: unknown) => {
    mocks.autoMultiple(props)
    return <div data-testid="autocomplete-multiple" />
  },
}))

vi.mock('../../react-hook-form-inputs/RHFDatePicker', () => ({
  RHFDatePicker: (props: unknown) => {
    mocks.datePicker(props)
    return <div data-testid="date-picker" />
  },
}))

const options = [{ label: 'A', value: 'a' }]

const renderField = (field: Record<string, unknown>) =>
  render(<FilterField field={{ name: 'f', label: 'Label', ...field } as unknown as TFilterField} />)

describe('FilterField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a text field for freetext', () => {
    renderField({ type: 'freetext' })
    expect(screen.getByTestId('text-field')).toBeInTheDocument()
    expect(mocks.textField).toHaveBeenCalledWith({ name: 'f', label: 'Label' })
  })

  it('renders a number text field for numeric', () => {
    renderField({ type: 'numeric' })
    expect(mocks.textField).toHaveBeenCalledWith({ name: 'f', label: 'Label', type: 'number' })
  })

  it('renders a switch for boolean', () => {
    renderField({ type: 'boolean', description: 'desc' })
    expect(screen.getByTestId('switch')).toBeInTheDocument()
    expect(mocks.switchMock).toHaveBeenCalledWith({
      name: 'f',
      label: 'Label',
      description: 'desc',
    })
  })

  it('renders a date picker with min and max dates', () => {
    const minDate = new Date(2020, 0, 1)
    const maxDate = new Date(2030, 0, 1)
    renderField({ type: 'datepicker', minDate, maxDate })
    expect(screen.getByTestId('date-picker')).toBeInTheDocument()
    expect(mocks.datePicker).toHaveBeenCalledWith({ name: 'f', label: 'Label', minDate, maxDate })
  })

  it('renders a single select for select-single', () => {
    renderField({ type: 'select-single', options })
    expect(screen.getByTestId('select')).toBeInTheDocument()
    expect(mocks.select).toHaveBeenCalledWith({ name: 'f', label: 'Label', options })
  })

  it('renders a multiple select for select-multiple', () => {
    renderField({ type: 'select-multiple', options })
    expect(mocks.select).toHaveBeenCalledWith({
      multiple: true,
      name: 'f',
      label: 'Label',
      options,
    })
  })

  it('renders autocomplete single and forwards text input changes', () => {
    const onTextInputChange = vi.fn()
    renderField({ type: 'autocomplete-single', options, onTextInputChange })
    expect(screen.getByTestId('autocomplete-single')).toBeInTheDocument()
    const props = mocks.autoSingle.mock.calls[0][0]
    expect(props).toMatchObject({
      name: 'f',
      label: 'Label',
      options,
      showSelectionCountOnly: true,
    })
    props.onInputChange('abc')
    expect(onTextInputChange).toHaveBeenCalledWith('abc')
  })

  it('renders autocomplete multiple and forwards text input changes', () => {
    const onTextInputChange = vi.fn()
    renderField({ type: 'autocomplete-multiple', options, onTextInputChange })
    expect(screen.getByTestId('autocomplete-multiple')).toBeInTheDocument()
    const props = mocks.autoMultiple.mock.calls[0][0]
    expect(props).toMatchObject({ options, showSelectionCountOnly: true })
    props.onInputChange('xyz')
    expect(onTextInputChange).toHaveBeenCalledWith('xyz')
  })

  it('does not throw when onTextInputChange is missing', () => {
    renderField({ type: 'autocomplete-single', options })
    const props = mocks.autoSingle.mock.calls[0][0]
    expect(() => props.onInputChange('abc')).not.toThrow()
  })
})
