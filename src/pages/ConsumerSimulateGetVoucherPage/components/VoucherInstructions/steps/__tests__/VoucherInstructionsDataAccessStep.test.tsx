import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsDataAccessStep } from '../VoucherInstructionsDataAccessStep'

const goToPreviousStepMock = vi.fn()
const goToNextStepMock = vi.fn()
const useClientKindMock = vi.fn()
const useQueryMock = vi.fn()

vi.mock('../VoucherInstructionsContext', () => ({
  useVoucherInstructionsContext: () => ({
    goToPreviousStep: goToPreviousStepMock,
    goToNextStep: goToNextStepMock,
  }),
}))

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => useClientKindMock(),
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ({
      queryKey: ['PurposeGetSingle', id],
    }),
  },
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQuery: () => useQueryMock(),
  }
})

describe('VoucherInstructionsDataAccessStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders base content without purpose', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')
    useQueryMock.mockReturnValue({ data: undefined })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('dataAccessStep.CONSUMER.title')).toBeInTheDocument()
    expect(await screen.findByText('dataAccessStep.CONSUMER.actionTitle')).toBeInTheDocument()
  })

  it('does not render consumer link when purpose is missing', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')
    useQueryMock.mockReturnValue({ data: undefined })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(screen.queryByText('dataAccessStep.CONSUMER.actionLabel')).not.toBeInTheDocument()
  })

  it('renders consumer link when purpose exists', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')
    useQueryMock.mockReturnValue({
      data: {
        eservice: {
          id: '1',
          name: 'ServiceName',
          producer: { name: 'ProducerName' },
          descriptor: { id: 'd1' },
        },
      },
    })

    renderWithApplicationContext(
      <MemoryRouter initialEntries={['?purposeId=123']}>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    const link = await screen.findByRole('button')
    expect(link).toBeInTheDocument()
  })

  it('renders API sections when clientKind is API', async () => {
    useClientKindMock.mockReturnValue('API')
    useQueryMock.mockReturnValue({ data: undefined })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('dataAccessStep.API.apiV1.title')).toBeInTheDocument()
    expect(await screen.findByText('dataAccessStep.API.apiV1.description')).toBeInTheDocument()
    expect(await screen.findByText('dataAccessStep.API.apiV2.title')).toBeInTheDocument()
    expect(await screen.findByText('dataAccessStep.API.apiV2.description')).toBeInTheDocument()
  })

  it('renders SignalHub section for API', async () => {
    useClientKindMock.mockReturnValue('API')
    useQueryMock.mockReturnValue({ data: undefined })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('dataAccessStep.API.titleSignalHub')).toBeInTheDocument()
    expect(await screen.findByText('dataAccessStep.API.pushApiSH.title')).toBeInTheDocument()
    expect(await screen.findByText('dataAccessStep.API.pushApiSH.description')).toBeInTheDocument()
  })
})
