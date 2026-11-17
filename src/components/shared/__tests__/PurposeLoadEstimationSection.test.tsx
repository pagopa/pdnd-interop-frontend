import { describe, it, expect, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { PurposeLoadEstimationSection } from '../PurposeLoadEstimationSection'
import { renderWithApplicationContext } from '@/utils/testing.utils'

vi.mock('@tanstack/react-query', async () => {
  const actual: Record<string, unknown> = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useQuery: vi.fn().mockReturnValue({ data: undefined }),
  }
})

const mockUseGetPurposeInfoAlert = vi.fn()

vi.mock('@/hooks/useGetPurposeInfoAlert', () => ({
  useGetPurposeInfoAlert: (...args: unknown[]) => mockUseGetPurposeInfoAlert(...args),
}))

function PurposeLoadEstimationForm({
  onSubmit = vi.fn(),
}: {
  onSubmit?: (values: { dailyCalls: number }) => void
}) {
  const methods = useForm<{ dailyCalls: number }>({
    defaultValues: { dailyCalls: 100 },
  })

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        <PurposeLoadEstimationSection
          purposeId="purpose-1"
          dailyCallsPerConsumer={200}
          dailyCallsTotal={1000}
        />
        <button type="submit">submit</button>
      </form>
    </FormProvider>
  )
}

function renderComponent(onSubmit: (values: { dailyCalls: number }) => void = vi.fn()) {
  return renderWithApplicationContext(<PurposeLoadEstimationForm onSubmit={onSubmit} />, {
    withReactQueryContext: true,
  })
}

describe('PurposeLoadEstimationSection', () => {
  it('should render the daily calls input field', () => {
    mockUseGetPurposeInfoAlert.mockReturnValue(undefined)
    renderComponent()

    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('should not render the info alert when useGetPurposeInfoAlert returns undefined', () => {
    mockUseGetPurposeInfoAlert.mockReturnValue(undefined)
    renderComponent()

    expect(screen.queryByText('Test alert message')).not.toBeInTheDocument()
  })

  it('should render the info alert when useGetPurposeInfoAlert returns alert props', () => {
    mockUseGetPurposeInfoAlert.mockReturnValue({
      severity: 'info',
      children: 'Test alert message',
    })
    renderComponent()

    expect(screen.getByText('Test alert message')).toBeInTheDocument()
  })

  it('accepts 1000000000 daily calls', async () => {
    mockUseGetPurposeInfoAlert.mockReturnValue(undefined)
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent(onSubmit)

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('max', '1000000000')
    await user.clear(input)
    await user.type(input, '1000000000')
    await user.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ dailyCalls: 1_000_000_000 }, expect.anything())
    })
  })

  it('rejects daily calls above 1000000000 and shows the maximum validation message', async () => {
    mockUseGetPurposeInfoAlert.mockReturnValue(undefined)
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent(onSubmit)

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    await user.type(input, '1000000001')
    await user.click(screen.getByRole('button', { name: 'submit' }))

    expect(await screen.findByText('validation.number.max')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('keeps the minimum and integer validation rules', async () => {
    mockUseGetPurposeInfoAlert.mockReturnValue(undefined)
    const user = userEvent.setup()

    renderComponent()

    const input = screen.getByRole('spinbutton')
    await user.clear(input)
    fireEvent.change(input, { target: { value: '0' } })
    await user.click(screen.getByRole('button', { name: 'submit' }))
    expect(await screen.findByText('validation.number.min')).toBeInTheDocument()

    await user.clear(input)
    fireEvent.change(input, { target: { value: '1.5' } })
    await user.click(screen.getByRole('button', { name: 'submit' }))
    expect(
      await screen.findByText('edit.loadEstimationSection.dailyCalls.validation.integer')
    ).toBeInTheDocument()
  })

  it('keeps daily calls required', async () => {
    mockUseGetPurposeInfoAlert.mockReturnValue(undefined)
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderComponent(onSubmit)

    await user.clear(screen.getByRole('spinbutton'))
    await user.click(screen.getByRole('button', { name: 'submit' }))

    expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
