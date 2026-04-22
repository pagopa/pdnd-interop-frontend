vi.mock('../CodeSnippetPreview', () => ({
  CodeSnippetPreview: () => null,
  default: () => null,
}))

import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsAccessTokenStep } from '../VoucherInstructionsAccessTokenStep'

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
  const actual =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useSearchParams: () => [
      new URLSearchParams({
        clientId: 'client-123',
      }),
    ],
  }
})

describe('VoucherInstructionsAccessTokenStep', () => {
  it('renders base sections', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsAccessTokenStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('accessTokenStep.authEndpoint.label')).toBeInTheDocument()

    expect(await screen.findByText('accessTokenStep.requestBody.title')).toBeInTheDocument()
  })

  it('renders request body fields', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsAccessTokenStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('accessTokenStep.requestBody.clientIdField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('accessTokenStep.requestBody.clientAssertionField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('accessTokenStep.requestBody.clientAssertionTypeField.label')
    ).toBeInTheDocument()

    expect(
      await screen.findByText('accessTokenStep.requestBody.grantTypeField.label')
    ).toBeInTheDocument()
  })

  it('renders clientId value from query params', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsAccessTokenStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('client-123')).toBeInTheDocument()
  })

  it('renders voucher script section', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsAccessTokenStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('accessTokenStep.voucherScript.title')).toBeInTheDocument()

    expect(
      await screen.findByText('accessTokenStep.voucherScript.exampleLabel')
    ).toBeInTheDocument()
  })

  it('renders debug alert link', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsAccessTokenStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(
      await screen.findByText('accessTokenStep.debugVoucherAlert.description')
    ).toBeInTheDocument()
  })
})
