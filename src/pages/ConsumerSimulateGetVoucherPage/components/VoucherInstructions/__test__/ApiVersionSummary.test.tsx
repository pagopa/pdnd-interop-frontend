import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { MemoryRouter } from 'react-router-dom'
import { ApiVersionSummary } from '../ApiVersionSummary'

const useClientKindMock = vi.fn()
vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => useClientKindMock(),
}))

vi.mock('../CodeSnippetPreview', () => ({
  CodeSnippetPreview: () => null,
  default: () => null,
}))

describe('ApiVersionSummary.test', () => {
  it('renders api version fields', async () => {
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

  it('does not render v2 api fields', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <ApiVersionSummary keyPrefix="secondDPoPProofStep" hideV2 />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('pdndInteroperability.title')).toBeInTheDocument()
    expect(await screen.findByText('pdndInteroperability.description')).toBeInTheDocument()

    expect(await screen.findByText('pdndInteroperability.apiV3.title')).toBeInTheDocument()
    expect(await screen.findByText('pdndInteroperability.apiV3.description')).toBeInTheDocument()

    expect(await screen.findByText('pdndInteroperability.apiV2.title')).not.toBeInTheDocument()
    expect(
      await screen.findByText('pdndInteroperability.apiV2.description')
    ).not.toBeInTheDocument()
  })
})
