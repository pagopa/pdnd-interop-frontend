import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsGeneralForm } from '../VoucherInstructionsGeneralForm'

const startStepperMock = vi.fn()
vi.mock('../VoucherInstructionsContext', () => ({
  useVoucherInstructionsContext: () => ({
    startStepper: startStepperMock,
  }),
}))

const useClientKindMock = vi.fn()
vi.mock('@/hooks/useClientKind', () => ({
  useClientKind: () => useClientKindMock(),
}))

vi.mock('../VoucherInstructionsGeneralFormCurrentIdsDrawer', () => ({
  VoucherInstructionsGeneralFormCurrentIdsDrawer: () => <div>Drawer</div>,
}))

vi.mock('@/api/client/client.services', () => ({
  getList: vi.fn().mockResolvedValue({
    data: {
      content: [],
    },
  }),
}))

describe('VoucherInstructionsGeneralForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders base form for CONSUMER', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsGeneralForm />
      </MemoryRouter>,
      {
        withReactQueryContext: true,
      }
    )

    expect(await screen.findByText('generalForm.technicalDetails.title')).toBeInTheDocument()
    expect(
      await screen.findByText('generalForm.voucherType.options.bearer.label')
    ).toBeInTheDocument()
    expect(
      await screen.findByText('generalForm.voucherType.options.dpop.label')
    ).toBeInTheDocument()
    expect(await screen.findByText('generalForm.interactionType.options.sync')).toBeInTheDocument()
    expect(await screen.findByText('generalForm.interactionType.options.async')).toBeInTheDocument()
  })

  it('shows async options when ASYNC is selected', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsGeneralForm />
      </MemoryRouter>,
      {
        withReactQueryContext: true,
      }
    )

    fireEvent.click(await screen.findByText('generalForm.interactionType.options.async'))

    expect(await screen.findByText('generalForm.memberType.options.consumer')).toBeInTheDocument()
    expect(await screen.findByText('generalForm.memberType.options.producer')).toBeInTheDocument()
  })

  it('switches to producer section', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsGeneralForm />
      </MemoryRouter>,
      {
        withReactQueryContext: true,
      }
    )

    fireEvent.click(await screen.findByText('generalForm.interactionType.options.async'))
    fireEvent.click(await screen.findByText('generalForm.memberType.options.producer'))

    expect(await screen.findByText('generalForm.producerKeychain.label')).toBeInTheDocument()
  })

  it('submit disabled when required fields missing', async () => {
    useClientKindMock.mockReturnValue('CONSUMER')

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsGeneralForm />
      </MemoryRouter>,
      {
        withReactQueryContext: true,
      }
    )

    const button = await screen.findByText('beginSimulation')
    expect(button).toBeDisabled()
  })

  it('enables submit when inputs are filled', async () => {
    useClientKindMock.mockReturnValue('API')

    renderWithApplicationContext(
      <MemoryRouter
        initialEntries={[
          '?voucherType=BEARER&interactionType=SYNC&clientId=b9d1e7af-1173-40eb-9c09-97adc397ddc9&keyId=NNthr0vUM4W55BD0xnhS9Ht4o1e1bfu-DEjmLHAQ5EQ',
        ]}
      >
        <VoucherInstructionsGeneralForm />
      </MemoryRouter>,
      {
        withReactQueryContext: true,
      }
    )

    const button = await screen.findByText('beginSimulation')
    expect(button).not.toBeDisabled()
  })
})
