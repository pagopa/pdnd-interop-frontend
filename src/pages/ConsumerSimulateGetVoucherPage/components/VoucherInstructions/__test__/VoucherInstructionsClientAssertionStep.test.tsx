import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsClientAssertionStep } from '../steps/VoucherInstructionsClientAssertionStep'

const goToPreviousStepMock = vi.fn()
const goToNextStepMock = vi.fn()

vi.mock('../VoucherInstructionsContext', () => ({
  useVoucherInstructionsContext: () => ({
    goToPreviousStep: goToPreviousStepMock,
    goToNextStep: goToNextStepMock,
  }),
}))

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => 'CONSUMER',
}))

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useSearchParams: () => [
      new URLSearchParams({
        clientId: 'client-123',
        purposeId: 'purpose-456',
        keyId: 'kid-789',
      }),
    ],
  }
})

describe('VoucherInstructionsClientAssertionStep', () => {
  it('renders base assertion fields', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('clientAssertionStep.assertionHeader.title')).toBeInTheDocument()

    expect(
      await screen.findByText('clientAssertionStep.assertionPayload.title')
    ).toBeInTheDocument()
  })

  it('renders client assertion identifiers (kid, alg, typ)', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('clientAssertionStep.assertionHeader.kidField.label')
    ).toBeInTheDocument()
    expect(
      await screen.findByText('clientAssertionStep.assertionHeader.algField.label')
    ).toBeInTheDocument()
    expect(
      await screen.findByText('clientAssertionStep.assertionHeader.typField.label')
    ).toBeInTheDocument()
  })

  it('renders payload fields (iss, sub, aud)', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('clientAssertionStep.assertionPayload.issField.label')
    ).toBeInTheDocument()
    expect(
      await screen.findByText('clientAssertionStep.assertionPayload.subField.label')
    ).toBeInTheDocument()
    expect(
      await screen.findByText('clientAssertionStep.assertionPayload.audField.label')
    ).toBeInTheDocument()
  })

  it('renders purposeId only for CONSUMER with purposeId present', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('clientAssertionStep.assertionPayload.purposeIdField.label')
    ).toBeInTheDocument()
  })

  it('renders script steps section', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('clientAssertionStep.assertionScript.title')).toBeInTheDocument()

    expect(
      await screen.findByText('clientAssertionStep.assertionScript.steps.1')
    ).toBeInTheDocument()
  })

  it('calls goToPreviousStep on back click', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    fireEvent.click(await screen.findByText('backBtn'))

    expect(goToPreviousStepMock).toHaveBeenCalledTimes(1)
  })

  it('calls goToNextStep on forward click', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    fireEvent.click(await screen.findByText('proceedBtn'))

    expect(goToNextStepMock).toHaveBeenCalledTimes(1)
  })
})
