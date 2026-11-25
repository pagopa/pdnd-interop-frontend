import { render, screen } from '@testing-library/react'
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

  it('links the infoLabel to the select via aria-describedby', () => {
    renderSelect()

    const selectInput = screen.getByRole('combobox', { name: 'label' })
    expect(selectInput).toHaveAccessibleDescription('testInfoLabel')
  })

  it('updates and submits multiple values, including when the initial value is undefined', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    const onValueChange = vi.fn()
    const Form = () => {
      const methods = useForm<{ testSelect: string[] }>()
      return (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <RHFNewSelect {...props} multiple onValueChange={onValueChange} />
            <button type="submit">Submit</button>
          </form>
        </FormProvider>
      )
    }

    render(
      <ThemeProvider theme={theme}>
        <Form />
      </ThemeProvider>
    )

    const selectInput = screen.getByRole('combobox', { name: 'label' })
    await user.click(selectInput)
    await user.click(screen.getByRole('option', { name: 'option1' }))
    await user.click(screen.getByRole('option', { name: 'option2' }))
    await user.keyboard('{Escape}')

    expect(selectInput).toHaveTextContent('option1')
    expect(selectInput).toHaveTextContent('option2')
    expect(onValueChange).toHaveBeenLastCalledWith(['option1', 'option2'])
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(onSubmit).toHaveBeenCalledWith({ testSelect: ['option1', 'option2'] }, expect.anything())
  })

  it('associates validation errors and guidance with the select', async () => {
    const user = userEvent.setup()
    const Form = () => {
      const methods = useForm({ defaultValues: { testSelect: '' } })
      return (
        <FormProvider {...methods}>
          <form noValidate onSubmit={methods.handleSubmit(() => {})}>
            <RHFNewSelect
              {...props}
              rules={{ required: 'Selection is required' }}
              error
              infoLabel="testInfoLabel Selection is required"
            />
            <button type="submit">Submit</button>
          </form>
        </FormProvider>
      )
    }

    render(
      <ThemeProvider theme={theme}>
        <Form />
      </ThemeProvider>
    )

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    const selectInput = screen.getByRole('combobox', { name: /label/ })
    expect(selectInput).toHaveAccessibleDescription('testInfoLabel Selection is required')
    expect(selectInput).toHaveFocus()
  })
})
