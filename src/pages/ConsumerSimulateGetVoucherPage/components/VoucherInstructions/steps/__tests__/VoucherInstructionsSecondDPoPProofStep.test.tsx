import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsSecondDPoPProofStep } from '../VoucherInstructionsSecondDPoPProofStep'

const useClientKindMock = vi.fn()
vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => useClientKindMock(),
}))

vi.mock('../../CodeSnippetPreview', () => ({
  CodeSnippetPreview: () => null,
  default: () => null,
}))

const apiVersionSummaryMock = vi.fn()
vi.mock('../../ApiVersionSummary', () => ({
  ApiVersionSummary: (props: unknown) => {
    apiVersionSummaryMock(props)
    return <div data-testid="api-version-summary" />
  },
}))

vi.mock('../../VoucherScriptPreviewSection', () => ({
  VoucherScriptPreviewSection: () => null,
  default: () => null,
}))

vi.mock('../../VoucherInstructionsContext', () => ({
  useVoucherInstructionsContext: () => ({
    goToPreviousStep: vi.fn(),
    resetStepper: vi.fn(),
  }),
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: vi.fn(() => ({
      queryKey: ['purpose'],
      queryFn: vi.fn(),
    })),
  },
}))

describe('VoucherInstructionsSecondDPoPProofStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders main sections', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsSecondDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('secondDPoPProofStep.title')).toBeInTheDocument()

    expect(
      await screen.findByText('secondDPoPProofStep.assertionPayload.title')
    ).toBeInTheDocument()
  })

  it('renders assertion payload fields', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsSecondDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.getAllByText('secondDPoPProofStep.assertionPayload.htmField.label')[0]
    ).toBeInTheDocument()

    expect(
      await screen.getAllByText('secondDPoPProofStep.assertionPayload.htuField.label')[0]
    ).toBeInTheDocument()

    expect(
      await screen.findByText('secondDPoPProofStep.assertionPayload.athField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('secondDPoPProofStep.assertionPayload.jtiField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('secondDPoPProofStep.assertionPayload.iatField.label')
    ).toBeInTheDocument()
  })

  it('renders interoperability section for API clients only', async () => {
    useClientKindMock.mockReturnValue('API')

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsSecondDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByTestId('api-version-summary')).toBeInTheDocument()

    expect(apiVersionSummaryMock).toHaveBeenCalledWith(
      expect.objectContaining({
        keyPrefix: 'secondDPoPProofStep',
        hideV2: true,
      })
    )
  })

  it('renders example request section', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsSecondDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('secondDPoPProofStep.exampleRequest.title.eservice')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('secondDPoPProofStep.exampleRequest.description')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('secondDPoPProofStep.exampleRequest.alert.title')
    ).toBeInTheDocument()
  })

  it('renders navigation buttons', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsSecondDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('backBtn')).toBeInTheDocument()

    expect(await screen.findByText('newSimulationBtn')).toBeInTheDocument()
  })
})
