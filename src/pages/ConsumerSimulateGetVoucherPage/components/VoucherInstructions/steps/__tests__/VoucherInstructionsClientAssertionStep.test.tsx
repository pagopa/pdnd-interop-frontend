import { vi } from 'vitest'
export const mockAxiosGet = vi.fn()
export const mockAxiosCreate = vi.fn()

vi.mock('axios', () => ({
  default: {
    get: vi.fn((url: string) =>
      Promise.resolve({
        data: '',
        config: { url },
      })
    ),

    create: vi.fn(() => ({
      get: vi.fn((url: string) =>
        Promise.resolve({
          data: '',
          config: { url },
        })
      ),

      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}))

vi.mock('../CodeSnippetPreview', () => ({
  CodeSnippetPreview: () => null,
  default: () => null,
}))

vi.mock('../VoucherInstructionsContext', () => ({
  useVoucherInstructionsContext: () => ({
    goToPreviousStep: vi.fn(),
    goToNextStep: vi.fn(),
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

import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsClientAssertionStep } from '../VoucherInstructionsClientAssertionStep'

describe('VoucherInstructionsClientAssertionStep', () => {
  it('renders base assertion sections', async () => {
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

  it('renders identifier fields', async () => {
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

  it('renders payload fields', async () => {
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

  it('renders purposeId when present', async () => {
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

  it('renders script section', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('clientAssertionStep.assertionScript.title')).toBeInTheDocument()
  })
})
