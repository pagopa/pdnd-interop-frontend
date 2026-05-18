import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsDataAccessStep } from '../VoucherInstructionsDataAccessStep'
import { INTERACTION_TYPE, VOUCHER_TYPE } from '../../VoucherInstructionsGeneralForm'

const goToPreviousStepMock = vi.fn()
const goToNextStepMock = vi.fn()
const resetStepperMock = vi.fn()

const useClientKindMock = vi.fn()
const useQueryMock = vi.fn()
const navigateMock = vi.fn()

vi.mock('../VoucherInstructionsContext', () => ({
  useVoucherInstructionsContext: () => ({
    goToPreviousStep: goToPreviousStepMock,
    goToNextStep: goToNextStepMock,
    resetStepper: resetStepperMock,
  }),
}))

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => useClientKindMock(),
}))

vi.mock('@/router', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ({
      queryKey: ['PurposeGetSingle', id],
    }),
  },
}))

vi.mock('@/api/eservice', () => ({
  EServiceQueries: {
    getSingle: (id: string) => ({
      queryKey: ['EServiceGetSingle', id],
    }),
  },
}))

vi.mock('../../CodeSnippetPreview', () => ({
  CodeSnippetPreview: () => null,
  default: () => null,
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()

  return {
    ...actual,
    useQuery: () => useQueryMock(),
  }
})

const useSearchParamsMock = vi.fn()

vi.mock('react-router-dom', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useSearchParams: () => useSearchParamsMock(),
  }
})

describe('VoucherInstructionsDataAccessStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useSearchParamsMock.mockReturnValue([new URLSearchParams(), vi.fn()])
  })

  it('renders PDND access token section', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    useQueryMock.mockReturnValue({
      data: undefined,
    })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('dataAccessStep.pdndAccessToken.title')).toBeInTheDocument()

    expect(
      screen.getByText('dataAccessStep.pdndAccessToken.successAlert.title')
    ).toBeInTheDocument()

    expect(
      screen.getByText('dataAccessStep.pdndAccessToken.failureAlert.title')
    ).toBeInTheDocument()
  })

  it('renders interoperability sections for API sync flow', async () => {
    useClientKindMock.mockReturnValue('API')

    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        interactionType: INTERACTION_TYPE.SYNC,
      }),
      vi.fn(),
    ])

    useQueryMock.mockReturnValue({
      data: undefined,
    })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('dataAccessStep.pdndInteroperability.title')).toBeInTheDocument()

    expect(screen.getByText('dataAccessStep.pdndInteroperability.apiV2.title')).toBeInTheDocument()

    expect(screen.getByText('dataAccessStep.pdndInteroperability.apiV3.title')).toBeInTheDocument()
  })

  it('renders SignalHub section for API sync flow', async () => {
    useClientKindMock.mockReturnValue('API')

    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        interactionType: INTERACTION_TYPE.SYNC,
      }),
      vi.fn(),
    ])

    useQueryMock.mockReturnValue({
      data: undefined,
    })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('dataAccessStep.signalHub.title')).toBeInTheDocument()

    expect(screen.getByText('dataAccessStep.signalHub.pushApiSH.title')).toBeInTheDocument()

    expect(screen.getByText('dataAccessStep.signalHub.pullApiSH.title')).toBeInTheDocument()
  })

  it('renders example request section for consumer bearer flow', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        voucherType: VOUCHER_TYPE.BEARER,
      }),
      vi.fn(),
    ])

    useQueryMock.mockReturnValue({
      data: undefined,
    })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('dataAccessStep.exampleRequest.title.eservice')
    ).toBeInTheDocument()

    expect(screen.getByText('dataAccessStep.exampleRequest.description')).toBeInTheDocument()
  })

  it('renders proceed button for DPOP flow', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        voucherType: VOUCHER_TYPE.DPOP,
      }),
      vi.fn(),
    ])

    useQueryMock.mockReturnValue({
      data: undefined,
    })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('proceedBtn')).toBeInTheDocument()
  })

  it('renders reset button for non DPOP flow', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    useSearchParamsMock.mockReturnValue([
      new URLSearchParams({
        voucherType: VOUCHER_TYPE.BEARER,
      }),
      vi.fn(),
    ])

    useQueryMock.mockReturnValue({
      data: undefined,
    })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('newSimulationBtn')).toBeInTheDocument()
  })
})
