import React from 'react'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { vi, describe, it, expect } from 'vitest'
import { RHFNewAutocompleteMultiple } from '..'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const renderWithAppContext = (ui: React.ReactElement) => renderWithApplicationContext(ui, {})

type FormValues = {
  selectedOptions: Array<string>
}

const mockOptions = [
  { label: 'Option Alpha', value: 'alpha' },
  { label: 'Option Beta', value: 'beta' },
  { label: 'Option Gamma', value: 'gamma' },
  { label: 'Delta Item', value: 'delta' },
]

function TestWrapper({
  children,
  defaultValues = { selectedOptions: [] },
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

describe('RHFNewAutocompleteMultiple', () => {
  it('renders correctly with label and placeholder', () => {
    renderWithAppContext(
      <TestWrapper>
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
          placeholder="Type to search"
          options={mockOptions}
        />
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Type to search')
    expect(screen.getByLabelText('Select multiple options')).toBeInTheDocument()
  })

  it('opens options listbox and displays all available options when clicked', async () => {
    const user = userEvent.setup()
    renderWithAppContext(
      <TestWrapper>
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
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
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
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
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
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

  it('selects multiple options and submits them correctly', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    const handleValueChange = vi.fn()

    renderWithAppContext(
      <TestWrapper onSubmit={handleSubmit}>
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
          options={mockOptions}
          onValueChange={handleValueChange}
        />
        <button type="submit">Submit</button>
      </TestWrapper>
    )

    const input = screen.getByRole('combobox')
    await user.click(input)

    const firstOption = await screen.findByRole('option', { name: 'Option Alpha' })
    await user.click(firstOption)

    await user.click(input)
    const secondOption = await screen.findByRole('option', { name: 'Option Gamma' })
    await user.click(secondOption)

    const selectedOptions = screen.getByRole('list', { name: 'Selected options' })
    expect(within(selectedOptions).getByText('Option Alpha')).toBeInTheDocument()
    expect(within(selectedOptions).getByText('Option Gamma')).toBeInTheDocument()

    expect(handleValueChange).toHaveBeenCalledWith([
      expect.objectContaining({ label: 'Option Alpha', value: 'alpha' }),
      expect.objectContaining({ label: 'Option Gamma', value: 'gamma' }),
    ])

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ selectedOptions: ['alpha', 'gamma'] })
      )
    })
  })

  it('removes a selected tag when its delete button is clicked', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    renderWithAppContext(
      <TestWrapper defaultValues={{ selectedOptions: ['alpha', 'beta'] }} onSubmit={handleSubmit}>
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
          options={mockOptions}
        />
        <button type="submit">Submit</button>
      </TestWrapper>
    )

    const selectedOptions = await screen.findByRole('list', { name: 'Selected options' })
    await waitFor(() => {
      expect(within(selectedOptions).getByText('Option Alpha')).toBeInTheDocument()
      expect(within(selectedOptions).getByText('Option Beta')).toBeInTheDocument()
    })

    const deleteButton = within(selectedOptions).getAllByRole('button', { name: /Delete/i })[0]
    await user.click(deleteButton)
    await waitFor(() => {
      expect(within(selectedOptions).queryByText('Option Alpha')).not.toBeInTheDocument()
      expect(within(selectedOptions).getByText('Option Beta')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ selectedOptions: ['beta'] })
      )
    })
  })

  it('synchronizes internal state with existing initial form values', async () => {
    renderWithAppContext(
      <TestWrapper defaultValues={{ selectedOptions: ['beta', 'delta'] }}>
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
          options={mockOptions}
        />
      </TestWrapper>
    )

    const selectedOptions = await screen.findByRole('list', { name: 'Selected options' })
    await waitFor(() => {
      expect(within(selectedOptions).getByText('Option Beta')).toBeInTheDocument()
      expect(within(selectedOptions).getByText('Delta Item')).toBeInTheDocument()
    })
  })

  it('displays validation error when required rule fails on submit', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    renderWithAppContext(
      <TestWrapper defaultValues={{ selectedOptions: [] }} onSubmit={handleSubmit}>
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
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

  it('clears all selected options when clear button is clicked', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()

    renderWithAppContext(
      <TestWrapper defaultValues={{ selectedOptions: ['alpha', 'beta'] }} onSubmit={handleSubmit}>
        <RHFNewAutocompleteMultiple
          name="selectedOptions"
          label="Select multiple options"
          options={mockOptions}
        />
        <button type="submit">Submit</button>
      </TestWrapper>
    )

    const selectedOptions = await screen.findByRole('list', { name: 'Selected options' })
    await waitFor(() => {
      expect(within(selectedOptions).getByText('Option Alpha')).toBeInTheDocument()
      expect(within(selectedOptions).getByText('Option Beta')).toBeInTheDocument()
    })

    const clearButton = screen.getByRole('button', { name: 'Clear the entered text' })
    await user.click(clearButton)
    await waitFor(() => {
      expect(within(selectedOptions).queryByText('Option Alpha')).not.toBeInTheDocument()
      expect(within(selectedOptions).queryByText('Option Beta')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({ selectedOptions: [] })
    })
  })
})
