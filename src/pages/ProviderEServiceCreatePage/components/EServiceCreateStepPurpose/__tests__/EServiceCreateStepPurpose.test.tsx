import { vi } from 'vitest'
import { mockUseEServiceCreateContext } from '@/../__mocks__/data/eservice.mocks'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { EServiceCreateStepPurpose } from '../EServiceCreateStepPurpose'
import { screen } from '@testing-library/react'

vi.mock('../EServiceCreateStepPurposeAddPurposesTable', () => ({
  EServiceCreateStepPurposeAddPurposesTable: () => (
    <div>EServiceCreateStepPurposeAddPurposesTable</div>
  ),
}))

vi.mock('../EServiceCreateStepPurposeRiskAnalysis/EServiceCreateStepPurposeRiskAnalysis', () => ({
  EServiceCreateStepPurposeRiskAnalysis: () => <div>EServiceCreateStepPurposeRiskAnalysis</div>,
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('EServiceCreateStepPurpose', () => {
  it('shows the first-version editable-info alert when general info is editable', () => {
    mockUseEServiceCreateContext({ areEServiceGeneralInfoEditable: true })
    renderWithApplicationContext(<EServiceCreateStepPurpose />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('hides the first-version editable-info alert when general info is not editable', () => {
    mockUseEServiceCreateContext({ areEServiceGeneralInfoEditable: false })
    renderWithApplicationContext(<EServiceCreateStepPurpose />, {
      withReactQueryContext: true,
      withRouterContext: true,
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
