import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material'

import { TestInputWrapper } from '@/components/shared/react-hook-form-inputs/__tests__/test-utils'
import { RHFNewSelect } from '@/components/shared/react-hook-form-inputs/RHFNewSelect'
import { theme } from '@pagopa/mui-italia'

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
})
