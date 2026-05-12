import { vi, beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { VoucherInstructionsAccessTokenStep } from '../VoucherInstructionsAccessTokenStep'
import { VOUCHER_TYPE } from '../../VoucherInstructionsGeneralForm'

const { mockUseSearchParams } = vi.hoisted(() => ({
  mockUseSearchParams: vi.fn(),
}))

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
  useClientKind: () => 'CONSUMER',
}))

vi.mock('react-router-dom', async () => {
  const actual =
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')

  return {
    ...actual,
    useSearchParams: mockUseSearchParams,
  }
})

describe('VoucherInstructionsAccessTokenStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseSearchParams.mockReturnValue([
      new URLSearchParams({
        clientId: 'client-123',
      }),
      vi.fn(),
    ])
  })

  it('renders base sections', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        voucherType: VOUCHER_TYPE.BEARER,
      }),
      vi.fn(),
    ])

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsAccessTokenStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('accessTokenStep.authEndpoint.title')).toBeInTheDocument()

    expect(await screen.findByText('accessTokenStep.requestBody.title.bearer')).toBeInTheDocument()

    expect(screen.queryByText('accessTokenStep.requestBody.title.dpop')).not.toBeInTheDocument()

    expect(screen.queryByText('accessTokenStep.requestDPoPHeader.title')).not.toBeInTheDocument()
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

    expect(screen.queryByText('accessTokenStep.requestDPoPHeader.title')).not.toBeInTheDocument()

    expect(
      screen.queryByText('accessTokenStep.requestDPoPHeader.dPoP.label')
    ).not.toBeInTheDocument()
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
  })

  it('renders debug link', async () => {
    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsAccessTokenStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('accessTokenStep.debugVoucherLink')).toBeInTheDocument()
  })

  it('renders DPoP header section when voucherType is DPOP', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        clientId: 'client-123',
        voucherType: VOUCHER_TYPE.DPOP,
      }),
      vi.fn(),
    ])

    renderWithApplicationContext(
      <MemoryRouter>
        <VoucherInstructionsAccessTokenStep />
      </MemoryRouter>,
      { withReactQueryContext: true }
    )

    expect(await screen.findByText('accessTokenStep.requestDPoPHeader.title')).toBeInTheDocument()

    expect(
      await screen.findByText('accessTokenStep.requestDPoPHeader.dPoP.label')
    ).toBeInTheDocument()

    expect(screen.queryByText('accessTokenStep.requestBody.title.bearer')).not.toBeInTheDocument()
  })
})
