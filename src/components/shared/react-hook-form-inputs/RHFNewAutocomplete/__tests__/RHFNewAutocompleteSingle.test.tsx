import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { vi, describe, it, expect } from 'vitest'
import { RHFNewAutocompleteSingle } from '..'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const renderWithAppContext = (ui: React.ReactElement) => renderWithApplicationContext(ui, {})

type FormValues = {
  selectedOption: string | null
}

const mockOptions = [
  { label: 'Option Alpha', value: 'alpha' },
  { label: 'Option Beta', value: 'beta' },
  { label: 'Option Gamma', value: 'gamma' },
  { label: 'Delta Item', value: 'delta' },
]

function TestWrapper({
  children,
  defaultValues = { selectedOption: null },
  onSubmit = vi.fn(),
}: {
  children: React.ReactNode
  defaultValues?: FormValues
  onSubmit?: (data: FormValues) => void
}) {
  const methods = useForm<FormValues>({
    defaultValues,
  })

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit((data) => onSubmit(data))}>
        {children}
      </form>
    </FormProvider>
  )
}

describe('RHFNewAutocompleteSingle', () => {
  it('renders correctly with label and placeholder', () => {
    renderWithAppContext(
      <TestWrapper>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          placeholder="Type to search"
          options={mockOptions}
        />
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Type to search')
    expect(screen.getByRole('combobox', { name: 'Select an option' })).toBeInTheDocument()
  })

  it('opens options listbox and displays all available options when clicked', async () => {
    const user = userEvent.setup()
    renderWithAppContext(
      <TestWrapper>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          options={mockOptions}
        />
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    await user.click(input)

    const listbox = await screen.findByRole('listbox')
    expect(listbox).toBeInTheDocument()

    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(mockOptions.length)
    expect(options[0]).toHaveTextContent('Option Alpha')
    expect(options[1]).toHaveTextContent('Option Beta')
    expect(options[2]).toHaveTextContent('Option Gamma')
    expect(options[3]).toHaveTextContent('Delta Item')
  })

  it('filters options based on user text input', async () => {
    const user = userEvent.setup()
    renderWithAppContext(
      <TestWrapper>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          options={mockOptions}
        />
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'Beta')

    const options = await screen.findAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Option Beta')
    expect(screen.queryByRole('option', { name: 'Option Alpha' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Option Gamma' })).not.toBeInTheDocument()
  })

  it('filters options with case-insensitive matching', async () => {
    const user = userEvent.setup()
    renderWithAppContext(
      <TestWrapper>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          options={mockOptions}
        />
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'option')

    const options = await screen.findAllByRole('option')
    expect(options).toHaveLength(3)
    expect(screen.getByRole('option', { name: 'Option Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Option Beta' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Option Gamma' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Delta Item' })).not.toBeInTheDocument()
  })

  it('selects an option on click and updates the input and form state', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    const handleValueChange = vi.fn()

    renderWithAppContext(
      <TestWrapper onSubmit={handleSubmit}>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          options={mockOptions}
          onValueChange={handleValueChange}
        />
        <button type="submit">Submit</button>
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    await user.click(input)

    const optionToSelect = await screen.findByRole('option', { name: 'Option Beta' })
    await user.click(optionToSelect)

    expect(input).toHaveValue('Option Beta')
    expect(handleValueChange).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'Option Beta', value: 'beta' })
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ selectedOption: 'beta' })
    })
  })

  it('synchronizes internal state with existing initial form value', async () => {
    renderWithAppContext(
      <TestWrapper defaultValues={{ selectedOption: 'gamma' }}>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          options={mockOptions}
        />
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    await waitFor(() => {
      expect(input).toHaveValue('Option Gamma')
    })
  })

  it('calls onInputChange when user types into the input', async () => {
    const user = userEvent.setup()
    const handleInputChange = vi.fn()

    renderWithAppContext(
      <TestWrapper>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          options={mockOptions}
          onInputChange={handleInputChange}
        />
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    await user.type(input, 'Delta')

    expect(handleInputChange).toHaveBeenCalled()
  })

  it('displays validation error when required rule fails on submit', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    renderWithAppContext(
      <TestWrapper onSubmit={handleSubmit}>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          options={mockOptions}
          rules={{ required: true }}
        />
        <button type="submit">Submit</button>
      </TestWrapper>
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(screen.getByText('validation.mixed.required')).toBeInTheDocument()
    })
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('clears selection when clear button is clicked', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    renderWithAppContext(
      <TestWrapper onSubmit={handleSubmit}>
        <RHFNewAutocompleteSingle
          name="selectedOption"
          label="Select an option"
          options={mockOptions}
        />
        <button type="submit">Submit</button>
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.click(await screen.findByRole('option', { name: 'Option Alpha' }))
    expect(input).toHaveValue('Option Alpha')

    const clearButton = screen.getByRole('button', { name: 'Clear the entered text' })
    await user.click(clearButton)
    expect(input).toHaveValue('')
  })
})
