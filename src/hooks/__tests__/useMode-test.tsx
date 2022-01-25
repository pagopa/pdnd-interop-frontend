import React from 'react'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { useMode } from '../useMode'
import { AllTheProviders } from '../../__mocks__/providers'

function TestComponent() {
  const mode = useMode()
  return <div>modalità attiva: {mode ?? 'nessuna'}</div>
}

it('Gets the current mode correctly', () => {
  const history = createMemoryHistory()
  render(
    <AllTheProviders defaultHistory={history}>
      <TestComponent />
    </AllTheProviders>
  )

  history.push('/erogazione/e-service/crea')
  expect(screen.getByText('modalità attiva: provider')).toBeInTheDocument()

  history.push('/fruizione/client/sdifoen-dsfhdsi-fjsdi')
  expect(screen.getByText('modalità attiva: subscriber')).toBeInTheDocument()

  history.push('/notifiche')
  expect(screen.getByText('modalità attiva: nessuna')).toBeInTheDocument()
})
