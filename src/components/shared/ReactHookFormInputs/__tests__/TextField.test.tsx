import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { TestInputWrapper } from '@/__mocks__/mock.utils'
import { TextField } from '@/components/shared/ReactHookFormInputs'
import userEvent from '@testing-library/user-event'

const testValues = {
  first: 'test',
  second: 'input',
}

describe('determine whether the integration between react-hook-form and MUI’s TextField works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const textField = render(
      <TestInputWrapper>
        <TextField label={'label'} name={'testText'} />
      </TestInputWrapper>
    )

    const input = textField.getByRole('textbox')
    user.type(input, testValues.first)
    await waitFor(() => {
      expect(input).toHaveValue(testValues.first)
    })
    user.type(input!, testValues.second)
    await waitFor(() => {
      expect(input).toHaveValue(testValues.first + testValues.second)
    })
  })

  it('should focus on mount', async () => {
    const textField = render(
      <TestInputWrapper>
        <TextField label={'input label'} name={'testText'} focusOnMount={true} />
      </TestInputWrapper>
    )
    const input = textField.getByRole('textbox')

    expect(document.activeElement).toBe(input)
  })
})
