import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { MemoryRouter } from 'react-router-dom'
import { DPoPAssertionHeader } from '../DPoPAssertionHeader'

describe('DPoPAssertionHeader', () => {
  it('should render assertion header fields', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <DPoPAssertionHeader keyPrefix="firstDPoPProofStep" />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('assertionHeader.title')).toBeInTheDocument()

    expect(await screen.findByText('assertionHeader.typField.label')).toBeInTheDocument()
    expect(await screen.findByText('assertionHeader.typField.description')).toBeInTheDocument()

    expect(await screen.findByText('assertionHeader.algField.label')).toBeInTheDocument()
    expect(await screen.findByText('assertionHeader.algField.description')).toBeInTheDocument()

    expect(await screen.findByText('assertionHeader.jwkField.label')).toBeInTheDocument()
    expect(await screen.findByText('assertionHeader.jwkField.description')).toBeInTheDocument()
  })
})
