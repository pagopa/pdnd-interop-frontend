import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { MemoryRouter } from 'react-router-dom'
import { ApiVersionSummary } from '../ApiVersionSummary'

describe('ApiVersionSummary', () => {
  it('should able to see api V2 and api V3 fields', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <ApiVersionSummary keyPrefix="secondDPoPProofStep" />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('pdndInteroperability.title')).toBeInTheDocument()
    expect(await screen.findByText('pdndInteroperability.description')).toBeInTheDocument()

    expect(await screen.findByText('pdndInteroperability.apiV3.title')).toBeInTheDocument()
    expect(await screen.findByText('pdndInteroperability.apiV3.description')).toBeInTheDocument()

    expect(await screen.findByText('pdndInteroperability.apiV2.title')).toBeInTheDocument()
    expect(await screen.findByText('pdndInteroperability.apiV2.description')).toBeInTheDocument()
  })

  it('should not render v2 api fields if we need to hide this section', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <ApiVersionSummary keyPrefix="secondDPoPProofStep" hideV2={true} />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('pdndInteroperability.title')).toBeInTheDocument()
    expect(await screen.findByText('pdndInteroperability.description')).toBeInTheDocument()

    expect(await screen.findByText('pdndInteroperability.apiV3.title')).toBeInTheDocument()
    expect(await screen.findByText('pdndInteroperability.apiV3.description')).toBeInTheDocument()

    expect(screen.queryByText('pdndInteroperability.apiV2.title')).not.toBeInTheDocument()
    expect(screen.queryByText('pdndInteroperability.apiV2.description')).not.toBeInTheDocument()
  })
})
