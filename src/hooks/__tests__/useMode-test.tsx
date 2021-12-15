import React from 'react'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { useMode } from '../useMode'

function TestComponent() {
  const mode = useMode()
  return <div>modalità attiva: {mode ?? 'nessuna'}</div>
}

fit('Gets the current mode correctly', () => {
  const history = createMemoryHistory()
  render(
    <Router history={history}>
      <TestComponent />
    </Router>
  )

  history.push('/erogazione/e-service/crea')
  expect(screen.getByText('modalità attiva: provider')).toBeInTheDocument()

  history.push('/fruizione/client/sdifoen-dsfhdsi-fjsdi')
  expect(screen.getByText('modalità attiva: subscriber')).toBeInTheDocument()

  history.push('/notifiche')
  expect(screen.getByText('modalità attiva: nessuna')).toBeInTheDocument()
})
