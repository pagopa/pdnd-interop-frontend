import React from 'react'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { TestInputWrapper } from './test-utils'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import userEvent from '@testing-library/user-event'
import { useFormContext } from 'react-hook-form'

const testValues = {
  first: 'test',
  second: 'input',
}

describe('determine whether the integration between react-hook-form and MUI’s TextField works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const textField = render(
      <TestInputWrapper>
        <RHFTextField label={'label'} name={'testText'} />
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

  it('gets the value type as number if type prop number is given', async () => {
    const user = userEvent.setup()
    const formContext = renderHook(() => useFormContext(), {
      wrapper: ({ children }) => (
        <TestInputWrapper>
          {children}
          <RHFTextField label={'label'} name={'testText'} type="number" />
        </TestInputWrapper>
      ),
    })

    const input = screen.getByRole('spinbutton')
    user.type(input, '1')
    await waitFor(() => {
      expect(input).toHaveValue(1)
    })

    const value = formContext.result.current.watch('testText')
    expect(typeof value).toBe('number')
  })

  it('should focus on mount', async () => {
    const textField = render(
      <TestInputWrapper>
        <RHFTextField label={'input label'} name={'testText'} focusOnMount={true} />
      </TestInputWrapper>
    )
    const input = textField.getByRole('textbox')

    expect(document.activeElement).toBe(input)
  })
})
