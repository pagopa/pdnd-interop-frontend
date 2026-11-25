import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFNewSelect } from '@/components/shared/react-hook-form-inputs/RHFNewSelect'
import { theme } from '@pagopa/mui-italia'
import { FormProvider, useForm } from 'react-hook-form'

const options = [
  { label: 'option1', value: 'option1' },
  { label: 'option2', value: 'option2' },
  { label: 'option3', value: 'option3', disabled: true },
]

const props = {
  label: 'label',
  infoLabel: 'testInfoLabel',
  name: 'testSelect',
  options: options,
}

const renderSelect = () => {
  render(
    <ThemeProvider theme={theme}>
      <TestInputWrapper>
        <RHFNewSelect {...props} />
      </TestInputWrapper>
    </ThemeProvider>
  )
}

describe('determine whether the integration between react-hook-form and MUI’s Select works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    renderSelect()

    const selectInput = screen.getByRole('combobox', { name: 'label' })
    expect(selectInput).not.toHaveTextContent(/option/i)

    await user.click(selectInput)
    await user.click(screen.getByRole('option', { name: 'option1' }))
    expect(selectInput).toHaveTextContent('option1')

    await user.click(selectInput)
    await user.click(screen.getByRole('option', { name: 'option2' }))
    expect(selectInput).toHaveTextContent('option2')
  })

  it('should disable options marked as disabled', async () => {
    const user = userEvent.setup()
    renderSelect()

    const selectInput = screen.getByRole('combobox', { name: 'label' })
    await user.click(selectInput)

    const disabledOption = screen.getByRole('option', { name: 'option3' })
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true')
  })

  it('opts into checkbox multiselection and toggles only enabled options with select all', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <TestInputWrapper>
          <RHFNewSelect {...props} name="checkedItems" multiple selectAllLabel="Select all" />
        </TestInputWrapper>
      </ThemeProvider>
    )
    const select = screen.getByRole('combobox', { name: 'label' })
    await user.click(select)
    const all = screen.getByRole('option', { name: 'Select all' })
    expect(all).toHaveAttribute('aria-selected', 'false')
    await user.click(all)
    expect(all).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'option1' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'option2' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'option3' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
    await user.click(screen.getByRole('option', { name: 'option1' }))
    expect(all).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('option', { name: 'option1' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
    expect(screen.getByRole('option', { name: 'option2' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('option', { name: 'Select all' }))
    expect(all).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('option', { name: 'Select all' }))
    expect(all).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByRole('option', { name: 'option1' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
    expect(screen.getByRole('option', { name: 'option2' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
    await user.keyboard('{Escape}')
    expect(select).not.toHaveTextContent('option')
  })

  it('preserves disabled selections and supports an option matching the select-all sentinel', async () => {
    const user = userEvent.setup()
    const WithDisabledSelection = () => {
      const methods = useForm({ defaultValues: { checkedItems: ['option3'] } })
      return (
        <FormProvider {...methods}>
          <RHFNewSelect
            {...props}
            name="checkedItems"
            multiple
            selectAllLabel="Select all"
            options={[...options, { value: '__select_all__', label: 'Sentinel value' }]}
          />
        </FormProvider>
      )
    }
    render(
      <ThemeProvider theme={theme}>
        <WithDisabledSelection />
      </ThemeProvider>
    )
    await user.click(screen.getByRole('combobox', { name: 'label' }))
    await user.click(screen.getByRole('option', { name: 'Sentinel value' }))
    expect(screen.getByRole('option', { name: 'Sentinel value' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('option', { name: 'option1' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
    await user.click(screen.getByRole('option', { name: 'Select all' }))
    expect(screen.getByRole('option', { name: 'Select all' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getByRole('option', { name: 'option3' })).toHaveAttribute('aria-selected', 'true')
    await user.click(screen.getByRole('option', { name: 'Select all' }))
    expect(screen.getByRole('option', { name: 'option3' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'Sentinel value' })).toHaveAttribute(
      'aria-selected',
      'false'
    )
  })

  it('should render the infoLabel when passed', () => {
    renderSelect()

    expect(screen.getByText('testInfoLabel')).toBeInTheDocument()
  })

  it('calls onValueChange with the selected value', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ThemeProvider theme={theme}>
        <TestInputWrapper>
          <RHFNewSelect {...props} onValueChange={onValueChange} />
        </TestInputWrapper>
      </ThemeProvider>
    )

    await user.click(screen.getByRole('combobox', { name: 'label' }))
    await user.click(screen.getByRole('option', { name: 'option2' }))

    expect(onValueChange).toHaveBeenCalledWith('option2')
  })

  it('renders the emptyLabel option when there are no options', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <TestInputWrapper>
          <RHFNewSelect {...props} options={[]} emptyLabel="no options" />
        </TestInputWrapper>
      </ThemeProvider>
    )

    await user.click(screen.getByRole('combobox', { name: 'label' }))
    expect(screen.getByRole('option', { name: 'no options' })).toBeInTheDocument()
  })

  it('links the infoLabel to the select via aria-describedby', () => {
    renderSelect()

    const selectInput = screen.getByRole('combobox', { name: 'label' })
    expect(selectInput).toHaveAccessibleDescription('testInfoLabel')
  })

  it('marks the field as required and shows the validation error linked to the select', async () => {
    const user = userEvent.setup()
    const Form = () => {
      const methods = useForm({ defaultValues: { testSelect: '' } })
      return (
        <ThemeProvider theme={theme}>
          <FormProvider {...methods}>
            <form noValidate onSubmit={methods.handleSubmit(() => undefined)}>
              <RHFNewSelect
                name="testSelect"
                label="label"
                options={options}
                rules={{ required: true }}
              />
              <button type="submit">submit</button>
            </form>
          </FormProvider>
        </ThemeProvider>
      )
    }
    render(<Form />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'submit' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /label/ })).toHaveAccessibleDescription(
      alert.textContent ?? ''
    )

    await user.click(screen.getByRole('combobox', { name: /label/ }))
    await user.click(screen.getByRole('option', { name: 'option1' }))
    await user.click(screen.getByRole('button', { name: 'submit' }))
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })

  it('does not open when disabled and renders without infoLabel', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <TestInputWrapper>
          <RHFNewSelect name="testSelect" label="label" options={options} disabled />
        </TestInputWrapper>
      </ThemeProvider>
    )
    const select = screen.getByRole('combobox', { name: 'label' })
    await user.click(select)
    expect(screen.queryByRole('option', { name: 'option1' })).not.toBeInTheDocument()
    expect(select).not.toHaveAccessibleDescription()
  })
})
