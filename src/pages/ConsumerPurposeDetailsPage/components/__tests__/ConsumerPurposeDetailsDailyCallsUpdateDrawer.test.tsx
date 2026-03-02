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
}))

describe('ConsumerPurposeDetailsDailyCallsUpdateDrawer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page titlex', () => {
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
