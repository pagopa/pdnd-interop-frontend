import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { TestInputWrapper } from './test-utils'
import { RHFNewTextField } from '@/components/shared/react-hook-form-inputs'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { vi } from 'vitest'
import { ThemeProvider } from '@mui/material'
import { theme } from '@pagopa/mui-italia'
import type { PropsWithChildren } from 'react'

const testValues = {
  first: 'test',
  second: 'input',
}

const WithTheme = ({ children }: PropsWithChildren) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('determine whether the integration between react-hook-form and MUI’s TextField works', () => {
  it('gets the input from the user correctly', async () => {
    const user = userEvent.setup()
    const textField = render(
      <WithTheme>
        <TestInputWrapper>
          <RHFNewTextField label={'label'} name={'testText'} />
        </TestInputWrapper>
      </WithTheme>
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
        <WithTheme>
          <TestInputWrapper>
            {children}
            <RHFNewTextField label={'label'} name={'testText'} type="number" />
          </TestInputWrapper>
        </WithTheme>
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
      <WithTheme>
        <TestInputWrapper>
          <RHFNewTextField label={'input label'} name={'testText'} focusOnMount={true} />
        </TestInputWrapper>
      </WithTheme>
    )
    const input = textField.getByRole('textbox')

    expect(document.activeElement).toBe(input)
  })

  it('should call onValueChange when the value changes', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const textField = render(
      <WithTheme>
        <TestInputWrapper>
          <RHFNewTextField label={'input label'} name={'testText'} onValueChange={onValueChange} />
        </TestInputWrapper>
      </WithTheme>
    )
    const input = textField.getByRole('textbox')

    user.type(input, testValues.first)
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith(testValues.first)
    })
  })

  it('should allow clearing a number input without forcing 0', async () => {
    const user = userEvent.setup()
    const formContext = renderHook(() => useFormContext(), {
      wrapper: ({ children }) => (
        <WithTheme>
          <TestInputWrapper>
            {children}
            <RHFNewTextField label={'label'} name={'testNumber'} type="number" />
          </TestInputWrapper>
        </WithTheme>
      ),
    })

    const input = screen.getByRole('spinbutton')
    await user.type(input, '42')
    await waitFor(() => {
      expect(input).toHaveValue(42)
    })

    await user.clear(input)
    await waitFor(() => {
      expect(input).not.toHaveValue(0)
      const value = formContext.result.current.watch('testNumber')
      expect(value).toBe('')
    })
  })

  it('should prevent non-numeric characters from being entered in number inputs', async () => {
    const user = userEvent.setup()
    const formContext = renderHook(() => useFormContext(), {
      wrapper: ({ children }) => (
        <WithTheme>
          <TestInputWrapper>
            {children}
            <RHFNewTextField label={'label'} name={'testNumber'} type="number" />
          </TestInputWrapper>
        </WithTheme>
      ),
    })

    const input = screen.getByRole('spinbutton')
    await user.type(input, '12abc34')
    await waitFor(() => {
      expect(input).toHaveValue(1234)
      const value = formContext.result.current.watch('testNumber')
      expect(value).toBe(1234)
    })
  })

  it('should prevent leading zero in number inputs', async () => {
    const user = userEvent.setup()
    const formContext = renderHook(() => useFormContext(), {
      wrapper: ({ children }) => (
        <WithTheme>
          <TestInputWrapper>
            {children}
            <RHFNewTextField label={'label'} name={'testNumber'} type="number" />
          </TestInputWrapper>
        </WithTheme>
      ),
    })

    const input = screen.getByRole('spinbutton')
    await user.type(input, '0123')
    await waitFor(() => {
      expect(input).toHaveValue(123)
      const value = formContext.result.current.watch('testNumber')
      expect(value).toBe(123)
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
          <RHFNewTextField
            label="username"
            name="users"
            indexFieldArray={0}
            fieldArrayKeyName="name"
            rules={{ required: true, minLength: 5 }}
          />
        </FormProvider>
      )
    }

    const { getByRole } = render(
      <WithTheme>
        <FieldArrayErrorTestWrapper />
      </WithTheme>
    )
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
          <RHFNewTextField label="username" name="users" rules={{ required: true }} />
        </FormProvider>
      )
    }

    const { getByRole } = render(
      <WithTheme>
        <FieldArrayErrorTestWrapper />
      </WithTheme>
    )
    const input = getByRole('textbox')
    input.focus()
    input.blur()

    await waitFor(() => {
      screen.debug()
      expect(screen.getByText('validation.mixed.required')).toBeInTheDocument()
    })
  })

  it('should treat a whitespace-only value as empty for required validation', async () => {
    const user = userEvent.setup()
    const WhitespaceWrapper = () => {
      const formMethods = useForm({
        defaultValues: {
          username: '',
        },
        mode: 'onBlur',
      })

      return (
        <FormProvider {...formMethods}>
          <RHFNewTextField label="username" name="username" rules={{ required: true }} />
        </FormProvider>
      )
    }

    const { getByRole } = render(
      <WithTheme>
        <WhitespaceWrapper />
      </WithTheme>
    )
    const input = getByRole('textbox')

    await user.type(input, '   ')
    input.blur()

    await waitFor(() => {
      expect(screen.getByText('validation.mixed.required')).toBeInTheDocument()
    })
  })
})
