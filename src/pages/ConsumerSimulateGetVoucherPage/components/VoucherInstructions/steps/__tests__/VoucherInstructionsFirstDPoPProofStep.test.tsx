import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsFirstDPoPProofStep } from '../VoucherInstructionsFirstDPoPProofStep'

vi.mock('../../CodeSnippetPreview', () => ({
  CodeSnippetPreview: () => null,
  default: () => null,
}))

vi.mock('../../VoucherInstructionsContext', () => ({
  useVoucherInstructionsContext: () => ({
    goToPreviousStep: vi.fn(),
    goToNextStep: vi.fn(),
  }),
}))

describe('VoucherInstructionsFirstDPoPProofStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders main sections', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsFirstDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('firstDPoPProofStep.title')).toBeInTheDocument()
    expect(await screen.findByText('firstDPoPProofStep.assertionHeader.title')).toBeInTheDocument()
    expect(await screen.findByText('firstDPoPProofStep.assertionPayload.title')).toBeInTheDocument()
  })

  it('renders assertion header fields', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsFirstDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('firstDPoPProofStep.assertionHeader.typField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('firstDPoPProofStep.assertionHeader.algField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('firstDPoPProofStep.assertionHeader.jwkField.label')
    ).toBeInTheDocument()
  })

  it('renders assertion payload fields', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsFirstDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('firstDPoPProofStep.assertionPayload.htmField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('firstDPoPProofStep.assertionPayload.htuField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('firstDPoPProofStep.assertionPayload.jtiField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('firstDPoPProofStep.assertionPayload.iatField.label')
    ).toBeInTheDocument()
  })

  it('renders navigation buttons', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsFirstDPoPProofStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('backBtn')).toBeInTheDocument()
    expect(await screen.findByText('proceedBtn')).toBeInTheDocument()

    expect(
      await screen.findByText('firstDPoPProofStep.navigateToDebugButton.label')
    ).toBeInTheDocument()
  })
})
