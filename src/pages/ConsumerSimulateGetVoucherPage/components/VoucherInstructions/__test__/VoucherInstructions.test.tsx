import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { VoucherInstructions } from '../VoucherInstructions'
import { screen } from '@testing-library/react'
import { vi } from 'vitest'
import { renderWithApplicationContext } from '@/utils/testing.utils'

const mockReactI18next = vi.hoisted(async () => {
  const { createMockReactI18next } = await import('@/utils/__mocks__/react-i18next-helper')
  return {
    ...createMockReactI18next('it'),
    Trans: ({ children }: { children: React.ReactNode }) => children,
  }
})
vi.mock('react-i18next', () => mockReactI18next)

vi.mock('../VoucherInstructionsGeneralForm', () => ({
  VoucherInstructionsGeneralForm: () => (
    <div>
      <p>voucher.generalForm.description</p>
      <label htmlFor="clientId">voucher.generalForm.clientSelectInput.label</label>
      <input id="clientId" />
      <label htmlFor="purposeId">voucher.generalForm.purposeSelectInput.label</label>
      <input id="purposeId" />
    </div>
  ),
}))

describe('VoucherInstructions testing', () => {
  it('should render instruction for get consumer voucher simulation', () => {
    renderWithApplicationContext(
      <MemoryRouter initialEntries={['/tool-sviluppo/api-e-service/simulate-get-voucher']}>
        <VoucherInstructions />
      </MemoryRouter>,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByText('voucher.generalForm.description')).toBeInTheDocument()
    expect(screen.getByLabelText('voucher.generalForm.clientSelectInput.label')).toBeInTheDocument()
    expect(
      screen.getByLabelText('voucher.generalForm.purposeSelectInput.label')
    ).toBeInTheDocument()
  })

  it('should render instruction for get api voucher simulation', () => {
    renderWithApplicationContext(
      <MemoryRouter initialEntries={['/tool-sviluppo/api-interop/simulate-get-voucher']}>
        <VoucherInstructions />
      </MemoryRouter>,
      {
        withReactQueryContext: true,
      }
    )

    expect(screen.getByText('voucher.generalForm.description')).toBeInTheDocument()
    expect(screen.getByLabelText('voucher.generalForm.clientSelectInput.label')).toBeInTheDocument()
  })
})
