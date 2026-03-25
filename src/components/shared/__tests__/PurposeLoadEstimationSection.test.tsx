import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { PurposeLoadEstimationSection } from '../PurposeLoadEstimationSection'
import { renderWithApplicationContext, ReactHookFormWrapper } from '@/utils/testing.utils'

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

function renderComponent() {
  return renderWithApplicationContext(
    <ReactHookFormWrapper defaultValues={{ dailyCalls: 100 }}>
      <PurposeLoadEstimationSection
        purposeId="purpose-1"
        dailyCallsPerConsumer={200}
        dailyCallsTotal={1000}
      />
    </ReactHookFormWrapper>,
    { withReactQueryContext: true }
  )
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
})
