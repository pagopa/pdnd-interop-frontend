import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Router, BrowserRouter } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { useActiveStep } from '../useActiveStep'
import { AllTheProviders } from '../../__mocks__/providers'

function TestComponent() {
  const { activeStep, back, forward } = useActiveStep()
  return (
    <div>
      <button onClick={back} id="back">
        indietro
      </button>
      <div id="step">Step: {activeStep}</div>
      <button onClick={forward} id="forward">
        avanti
      </button>
    </div>
  )
}

describe('Active step navigation', () => {
  it('Updates step index correctly on click actions', () => {
    render(
      <BrowserRouter>
        <TestComponent />
      </BrowserRouter>
    )
    expect(screen.getByText('Step: 0')).toBeInTheDocument()

    userEvent.click(screen.getByText('avanti'))
    expect(screen.getByText('Step: 1')).toBeInTheDocument()

    userEvent.click(screen.getByText('indietro'))
    expect(screen.getByText('Step: 0')).toBeInTheDocument()
  })

  it('Sets step index according to history.location.state', () => {
    const history = createMemoryHistory()
    history.push('/not-relevant', { stepIndexDestination: 3 })
    render(
      <AllTheProviders defaultHistory={history}>
        <TestComponent />
      </AllTheProviders>
    )

    expect(screen.getByText('Step: 3')).toBeInTheDocument()
  })
})
