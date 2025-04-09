import React from 'react'
import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { TestInputWrapper } from './test-utils'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { vi } from 'vitest'

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

  it('should call onValueChange when the value changes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const textField = render(
      <TestInputWrapper>
        <RHFTextField label={'input label'} name={'testText'} onValueChange={onValueChange} />
      </TestInputWrapper>
    )
    const input = textField.getByRole('textbox')

    user.type(input, testValues.first)
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith(testValues.first)
    })
  })

  it('should be able to show errors when are present in case of indexFieldArray and fieldArrayKeyName are populated', async () => {
    const FieldArrayErrorTestWrapper = () => {
      const formMethods = useForm({
        defaultValues: {
          users: [{ name: '' }, { name: '' }],
        },
        mode: 'onBlur',
      })

      return (
        <FormProvider {...formMethods}>
          <RHFTextField
            label="username"
            name="users"
            indexFieldArray={0}
            fieldArrayKeyName="name"
            rules={{ required: true, minLength: 5 }}
          />
        </FormProvider>
      )
    }

    const { getByRole } = render(<FieldArrayErrorTestWrapper />)
    const input = getByRole('textbox')
    input.focus()
    input.blur()

    await waitFor(() => {
      screen.debug()
      expect(screen.getByText('validation.mixed.required')).toBeInTheDocument()
    })
  })
  it('should be able to show errors when are present without indexFieldArray and fieldArrayKeyName', async () => {
    const FieldArrayErrorTestWrapper = () => {
      const formMethods = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onBlur',
      })

      return (
        <FormProvider {...formMethods}>
          <RHFTextField label="username" name="users" rules={{ required: true }} />
        </FormProvider>
      )
    }

    const { getByRole } = render(<FieldArrayErrorTestWrapper />)
    const input = getByRole('textbox')
    input.focus()
    input.blur()

    await waitFor(() => {
      screen.debug()
      expect(screen.getByText('validation.mixed.required')).toBeInTheDocument()
    })
  })
})
