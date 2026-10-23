import { render, renderHook, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { RHFDatePicker } from '../RHFDatePicker'

vi.mock('@/hooks/useCurrentLanguage', () => ({ default: () => 'en' }))

type FormValues = { testDate: Date | null; items: Array<{ date: Date | null }> }

const Wrapper = ({
  children,
  defaultValues = { testDate: null, items: [{ date: null }] },
}: {
  children: React.ReactNode
  defaultValues?: FormValues
}) => {
  const methods = useForm<FormValues>({ defaultValues })
  return <FormProvider {...methods}>{children}</FormProvider>
}

describe('RHFDatePicker', () => {
  it('renders the label and the initial value', () => {
    render(
      <Wrapper defaultValues={{ testDate: new Date(2024, 0, 15), items: [] }}>
        <RHFDatePicker name="testDate" label="Date label" />
      </Wrapper>
    )

    expect(screen.getByLabelText('Date label')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveValue('01/15/2024')
  })

  it('updates the form value when the user types a date', async () => {
    const user = userEvent.setup()
    const { result } = renderHook(() => useFormContext<FormValues>(), {
      wrapper: ({ children }) => (
        <Wrapper>
          {children}
          <RHFDatePicker name="testDate" label="Date label" />
        </Wrapper>
      ),
    })

    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.keyboard('03202024')

    await waitFor(() => {
      const value = result.current.getValues('testDate') as Date
      expect(value).toBeInstanceOf(Date)
      expect(value.getFullYear()).toBe(2024)
      expect(value.getMonth()).toBe(2)
      expect(value.getDate()).toBe(20)
    })
  })

  it('focuses the input on mount when focusOnMount is true', () => {
    render(
      <Wrapper>
        <RHFDatePicker name="testDate" label="Date label" focusOnMount />
      </Wrapper>
    )

    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('does not focus the input on mount by default', () => {
    render(
      <Wrapper>
        <RHFDatePicker name="testDate" label="Date label" />
      </Wrapper>
    )

    expect(screen.getByRole('textbox')).not.toHaveFocus()
  })

  it('disables the input when disabled is true', () => {
    render(
      <Wrapper>
        <RHFDatePicker name="testDate" label="Date label" disabled />
      </Wrapper>
    )

    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('shows the error message of a direct field', async () => {
    const Errored = () => {
      const { setError } = useFormContext<FormValues>()
      return (
        <>
          <button onClick={() => setError('testDate', { message: 'direct error' })}>set</button>
          <RHFDatePicker name="testDate" label="Date label" />
        </>
      )
    }
    const user = userEvent.setup()
    render(
      <Wrapper>
        <Errored />
      </Wrapper>
    )

    await user.click(screen.getByText('set'))
    expect(await screen.findByText('direct error')).toBeInTheDocument()
  })

  it('shows the error message of a nested field name', async () => {
    const Errored = () => {
      const { setError } = useFormContext<FormValues>()
      return (
        <>
          <button onClick={() => setError('items.0.date', { message: 'nested error' })}>set</button>
          <RHFDatePicker name="items.0.date" label="Date label" />
        </>
      )
    }
    const user = userEvent.setup()
    render(
      <Wrapper>
        <Errored />
      </Wrapper>
    )

    await user.click(screen.getByText('set'))
    expect(await screen.findByText('nested error')).toBeInTheDocument()
  })

  it('shows the error message of a field array item', async () => {
    const Errored = () => {
      const { setError } = useFormContext<FormValues>()
      return (
        <>
          <button onClick={() => setError('items.0.date', { message: 'array error' })}>set</button>
          <RHFDatePicker
            name="items"
            indexFieldArray={0}
            fieldArrayKeyName="date"
            label="Date label"
          />
        </>
      )
    }
    const user = userEvent.setup()
    render(
      <Wrapper>
        <Errored />
      </Wrapper>
    )

    await user.click(screen.getByText('set'))
    expect(await screen.findByText('array error')).toBeInTheDocument()
  })

  it('shows the infoLabel', () => {
    render(
      <Wrapper>
        <RHFDatePicker name="testDate" label="Date label" infoLabel="Some info" />
      </Wrapper>
    )

    expect(screen.getByText('Some info')).toBeInTheDocument()
  })
})
