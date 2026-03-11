import { render, screen } from '@testing-library/react'
import { ProviderThresholdsInfoAlert } from '../ProviderThresholdsInfoAlert'

describe('ProviderThresholdsInfoAlert', () => {
  it('renders the alert title', () => {
    render(<ProviderThresholdsInfoAlert dailyCallsPerConsumer={100} dailyCallsTotal={1000} />)
    expect(screen.getByText('label')).toBeInTheDocument()
  })

  it('renders the daily calls per consumer label and value', () => {
    render(<ProviderThresholdsInfoAlert dailyCallsPerConsumer={100} dailyCallsTotal={1000} />)
    expect(screen.getByText('dailyCallsPerConsumer.label')).toBeInTheDocument()
    expect(screen.getByText('dailyCallsPerConsumer.value')).toBeInTheDocument()
  })

  it('renders the daily calls total label and value', () => {
    render(<ProviderThresholdsInfoAlert dailyCallsPerConsumer={100} dailyCallsTotal={1000} />)
    expect(screen.getByText('dailyCallsTotal.label')).toBeInTheDocument()
    expect(screen.getByText('dailyCallsTotal.value')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<ProviderThresholdsInfoAlert dailyCallsPerConsumer={100} dailyCallsTotal={1000} />)
    expect(screen.getByText('description')).toBeInTheDocument()
  })
})
