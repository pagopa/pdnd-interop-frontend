import React from 'react'
import { render } from '@testing-library/react'
import { TestInputWrapper } from '@/__mocks__/mock.utils'
import { AutocompleteMultiple } from '@/components/shared/ReactHookFormInputs'
import userEvent from '@testing-library/user-event'

const testOptions = [
  { value: 'option1', label: 'option1' },
  { value: 'option2', label: 'option2' },
  { value: 'option3', label: 'option3' },
]

describe('determine whether the integration between react-hook-form and the MultipleAutocomplete component works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const screen = render(
      <TestInputWrapper>
        <AutocompleteMultiple label="Test" options={testOptions} name="multipleItems" />
      </TestInputWrapper>
    )

    const inputButton = screen.getByRole('combobox')
    await user.click(inputButton)

    const option1 = screen.getByRole('option', { name: 'option1' })
    await user.click(option1)

    expect(screen.getByText('option1')).toBeInTheDocument()

    await user.click(inputButton)

    const option2 = screen.getByRole('option', { name: 'option2' })
    await user.click(option2)

    expect(screen.getByText('option1')).toBeInTheDocument()
    expect(screen.getByText('option2')).toBeInTheDocument()

    await user.click(inputButton)
    const option3 = screen.getByRole('option', { name: 'option3' })
    await user.click(option3)

    expect(screen.getByText('option1')).toBeInTheDocument()
    expect(screen.getByText('option2')).toBeInTheDocument()
    expect(screen.getByText('option3')).toBeInTheDocument()

    screen.debug()
  })
})
