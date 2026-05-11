import * as useClientKindHook from '@/hooks/useClientKind'
import { vi } from 'vitest'

import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { renderWithApplicationContext } from '@/utils/testing.utils'

import { VoucherInstructionsClientAssertionStep } from '../VoucherInstructionsClientAssertionStep'
import { ASYNC_EXCHANGE_STEP, INTERACTION_TYPE } from '../../VoucherInstructionsGeneralForm'

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

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: vi.fn(),
}))

const useClientKindMock = vi.mocked(useClientKindHook.useClientKind)
const useSearchParamsMock = vi.fn()

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useSearchParams: () => useSearchParamsMock(),
  }
})

describe('VoucherInstructionsClientAssertionStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useClientKindMock.mockReturnValue('CONSUMER')

    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        clientId: 'client-123',
        purposeId: 'purpose-456',
        keyId: 'kid-789',
        interactionType: INTERACTION_TYPE.SYNC,
      }),
      vi.fn(),
    ])
  })

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

  it('does not render purposeId when async callback invocation', () => {
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        clientId: 'client-123',
        purposeId: 'purpose-456',
        keyId: 'kid-789',
        interactionType: INTERACTION_TYPE.ASYNC,
        asyncExchangeStep: ASYNC_EXCHANGE_STEP.CALLBACK_INVOCATION,
      }),
      vi.fn(),
    ])

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      screen.queryByText('clientAssertionStep.assertionPayload.purposeIdField.label')
    ).not.toBeInTheDocument()
  })

  it('renders async start interaction fields', async () => {
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        clientId: 'client-123',
        purposeId: 'purpose-456',
        keyId: 'kid-789',
        interactionType: INTERACTION_TYPE.ASYNC,
        asyncExchangeStep: ASYNC_EXCHANGE_STEP.START_INTERACTION,
      }),
      vi.fn(),
    ])

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByLabelText('clientAssertionStep.assertionPayload.urlCallbackField.label')
    ).toBeInTheDocument()
  })

  it('renders async callback invocation fields', async () => {
    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        clientId: 'client-123',
        purposeId: 'purpose-456',
        keyId: 'kid-789',
        interactionType: INTERACTION_TYPE.ASYNC,
        asyncExchangeStep: ASYNC_EXCHANGE_STEP.CALLBACK_INVOCATION,
      }),
      vi.fn(),
    ])

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsClientAssertionStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByLabelText('clientAssertionStep.assertionPayload.interactionIDField.label')
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('clientAssertionStep.assertionPayload.entityNumberField.label')
    ).toBeInTheDocument()
  })
})
