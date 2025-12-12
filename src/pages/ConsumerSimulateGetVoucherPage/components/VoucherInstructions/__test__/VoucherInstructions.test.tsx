import { MemoryRouter } from 'react-router-dom'
import { VoucherInstructions } from '../VoucherInstructions'
import { screen } from '@testing-library/react'
import { renderWithApplicationContext } from '@/utils/testing.utils'

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

    expect(screen.getByText('step1.description')).toBeInTheDocument()
    expect(screen.getByLabelText('step1.clientSelectInput.label')).toBeInTheDocument()
    expect(screen.getByLabelText('step1.purposeSelectInput.label')).toBeInTheDocument()
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

    expect(screen.getByText('step1.description')).toBeInTheDocument()
    expect(screen.getByLabelText('step1.clientSelectInput.label')).toBeInTheDocument()
  })
})
