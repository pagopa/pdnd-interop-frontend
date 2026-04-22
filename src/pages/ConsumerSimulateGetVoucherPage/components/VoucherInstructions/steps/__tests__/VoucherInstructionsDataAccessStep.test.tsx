import React from 'react'
import { fireEvent, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsDataAccessStep } from '../VoucherInstructionsDataAccessStep'

const goToPreviousStepMock = vi.fn()
const goToNextStepMock = vi.fn()

const useLocationMock = vi.fn()

vi.mock('../VoucherInstructionsContext', () => ({
  useVoucherInstructionsContext: () => ({
    goToPreviousStep: goToPreviousStepMock,
    goToNextStep: goToNextStepMock,
  }),
}))

vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => 'CONSUMER',
}))

vi.mock('@/api/purpose', () => ({
  PurposeQueries: {
    getSingle: (id: string) => ({
      queryKey: ['PurposeGetSingle', id],
    }),
  },
}))

const useSuspenseQueryMock = vi.fn()

vi.mock('@tanstack/react-query', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useSuspenseQuery: () => useSuspenseQueryMock(),
  }
})

describe('VoucherInstructionsDataAccessStep', () => {
  it('renders base content without purpose', async () => {
    const state = {
      clientKind: 'CONSUMER',
      purpose: undefined,
    }

    useLocationMock.mockReturnValue({ state })

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('dataAccessStep.API.title')).toBeInTheDocument()
    expect(await screen.findByText('dataAccessStep.API.actionTitle')).toBeInTheDocument()
  })

  it('renders consumer action label when purpose exists', async () => {
    const state = {
      clientKind: 'CONSUMER',
      purpose: {
        eservice: {
          id: '1',
          name: 'ServiceName',
          producer: { name: 'ProducerName' },
          descriptor: { id: 'd1' },
        },
      },
    }

    useLocationMock.mockReturnValue({ state })

    renderWithApplicationContext(
      <MemoryRouter initialEntries={['?purposeId=123']}>
        <VoucherInstructionsDataAccessStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    const link = await screen.findByRole('button')
    expect(link).toBeInTheDocument()
  })

  it('renders consumer link when purpose exists', async () => {
    const state = {
      clientKind: 'CONSUMER',
      purpose: {
        eservice: {
          id: '1',
          name: 'ServiceName',
          producer: { name: 'ProducerName' },
          descriptor: { id: 'd1' },
        },
      },
    }

    useLocationMock.mockReturnValue({ state })

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
    vi.mock('@/hooks/useClientKind', () => ({
      useClientKind: () => 'API',
    }))

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
    vi.mock('@/hooks/useClientKind', () => ({
      useClientKind: () => 'API',
    }))

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
