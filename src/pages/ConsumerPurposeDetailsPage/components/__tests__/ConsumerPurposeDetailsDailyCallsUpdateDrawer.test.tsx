import { renderWithApplicationContext } from '@/utils/testing.utils'
import { createMockPurpose } from '../../../../../__mocks__/data/purpose.mocks'
import { fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ConsumerPurposeDetailsDailyCallsUpdateDrawer } from '../PurposeDetailsTab/ConsumerPurposeDetailsDailyCallsUpdateDrawer'

const purpose = createMockPurpose()

const updateDailyCallsMock = vi.fn()

vi.mock('@/api/purpose', () => ({
  PurposeMutations: {
    useUpdateDailyCalls: () => ({
      mutate: updateDailyCallsMock,
    }),
  },
  PurposeQueries: {
    getRemainingDailyCalls: vi.fn(() => ({
      queryKey: ['purposeId', purpose.id],
      queryFn: vi.fn().mockResolvedValue({
        remainingDailyCallsPerConsumer: 5,
        remainingDailyCallsTotal: 100,
      }),
    })),
  },
}))

vi.mock('@/api/attribute', () => ({
  AttributeQueries: {
    getSingle: vi.fn((id: string) => ({ queryKey: ['attribute', id], queryFn: vi.fn() })),
  },
}))

describe('ConsumerPurposeDetailsDailyCallsUpdateDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page title', () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        purpose={purpose}
        isOpen={true}
        onClose={vi.fn()}
      />,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByText('title')).toBeInTheDocument()
  })

  it('should show current dailyCalls value inside input', () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        purpose={purpose}
        isOpen={true}
        onClose={vi.fn()}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveValue(purpose.currentVersion?.dailyCalls ?? 1)
  })

  it('should call updateDailyCalls on submit with correct payload', async () => {
    const onClose = vi.fn()

    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        purpose={purpose}
        isOpen={true}
        onClose={onClose}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: 15 } })

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    const submitButton = screen.getByRole('button', {
      name: 'submitButton.label',
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(updateDailyCallsMock).toHaveBeenCalledWith(
        { purposeId: purpose.id, dailyCalls: 15 },
        { onSuccess: onClose }
      )
    })
  })

  it('should accept 1000000000 daily calls', async () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        purpose={purpose}
        isOpen={true}
        onClose={vi.fn()}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('max', '1000000000')
    fireEvent.change(input, { target: { value: 1_000_000_000 } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'submitButton.label' }))

    await waitFor(() => {
      expect(updateDailyCallsMock).toHaveBeenCalledWith(
        { purposeId: purpose.id, dailyCalls: 1_000_000_000 },
        { onSuccess: expect.any(Function) }
      )
    })
  })

  it('should reject daily calls above 1000000000 with the maximum validation message', async () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        purpose={purpose}
        isOpen={true}
        onClose={vi.fn()}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: 1_000_000_001 } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'submitButton.label' }))

    expect(await screen.findByText('validation.number.max')).toBeInTheDocument()
    expect(updateDailyCallsMock).not.toHaveBeenCalled()
  })

  it('should keep rejecting an unchanged daily calls value', async () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        purpose={purpose}
        isOpen={true}
        onClose={vi.fn()}
      />,
      {
        withReactQueryContext: true,
      }
    )

    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'submitButton.label' }))

    expect(await screen.findByText('dailyCallsFormField.validation.sameValue')).toBeInTheDocument()
    expect(updateDailyCallsMock).not.toHaveBeenCalled()
  })

  it('should keep requiring a daily calls value', async () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        purpose={purpose}
        isOpen={true}
        onClose={vi.fn()}
      />,
      {
        withReactQueryContext: true,
      }
    )

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'submitButton.label' }))

    expect(await screen.findByText('validation.mixed.required')).toBeInTheDocument()
    expect(updateDailyCallsMock).not.toHaveBeenCalled()
  })

  it('should not submit if riskAnalysis checkbox is not checked', async () => {
    const screen = renderWithApplicationContext(
      <ConsumerPurposeDetailsDailyCallsUpdateDrawer
        purpose={purpose}
        isOpen={true}
        onClose={vi.fn()}
      />,
      {
        withReactQueryContext: true,
      }
    )

    const input = screen.getByRole('spinbutton')
    fireEvent.change(input, { target: { value: 20 } })

    const submitButton = screen.getByRole('button', {
      name: 'submitButton.label',
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(updateDailyCallsMock).not.toHaveBeenCalled()
    })
  })
})
