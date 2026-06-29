import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusChip } from '../StatusChip'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'

describe('StatusChip', () => {
  // The risk analysis chip only routes the state to its label key; i18n returns
  // the key as text in tests, so asserting the label verifies our own mapping
  // (not MUI's rendering).
  it.each<Exclude<RiskAnalysisSigningState, 'DRAFT'>>([
    'ASSIGNED',
    'SUBMITTED',
    'SIGNED',
    'REJECTED',
  ])('renders the risk analysis label for state %s', (state) => {
    renderWithApplicationContext(<StatusChip for="riskAnalysis" state={state} />, {})

    expect(screen.getByText(`status.riskAnalysis.${state}`)).toBeInTheDocument()
  })
  it.each<Exclude<RiskAnalysisSigningState, 'DRAFT' | 'SIGNED' | 'REJECTED'>>([
    'ASSIGNED',
    'SUBMITTED',
  ])('renders the risk analysis list label for state %s', (state) => {
    renderWithApplicationContext(<StatusChip for="riskAnalysisList" state={state} />, {})

    expect(screen.getByText(`status.riskAnalysisList.${state}`)).toBeInTheDocument()
  })

  // The "simple" variants all share the same data-driven path: the label key is
  // `status.<for>.<state>` and the color is looked up by the `for` discriminant.
  // States are chosen so each resolves to a distinct color, exercising the
  // `colorsByState[p.state]` lookup (not just the label namespace).
  it('renders label and color for every simple variant from its `for` namespace', () => {
    renderWithApplicationContext(
      <>
        <StatusChip for="delegation" state="ACTIVE" />
        <StatusChip for="eserviceTemplate" state="DRAFT" />
        <StatusChip for="purposeTemplate" state="SUSPENDED" />
      </>,
      {}
    )

    const chipOf = (label: string) => screen.getByText(label).closest('.MuiChip-root')

    expect(chipOf('status.delegation.ACTIVE')).toHaveClass('MuiChip-colorSuccess')
    expect(chipOf('status.eserviceTemplate.DRAFT')).toHaveClass('MuiChip-colorInfo')
    expect(chipOf('status.purposeTemplate.SUSPENDED')).toHaveClass('MuiChip-colorError')
  })

  it('renders the descriptor label for a plain state', () => {
    const { baseElement } = render(
      <StatusChip for="descriptor" state="PUBLISHED" isActiveDescriptor={false} />
    )
    expect(baseElement).toHaveTextContent('status.descriptor.PUBLISHED')
  })

  it('masks an active descriptor pending archiving as PUBLISHED', () => {
    const { baseElement } = render(
      <StatusChip for="descriptor" state="ARCHIVING" isActiveDescriptor />
    )
    expect(baseElement).toHaveTextContent('status.descriptor.PUBLISHED')
  })

  it('masks an active descriptor pending archiving-suspended as SUSPENDED', () => {
    const { baseElement } = render(
      <StatusChip for="descriptor" state="ARCHIVING_SUSPENDED" isActiveDescriptor />
    )
    expect(baseElement).toHaveTextContent('status.descriptor.SUSPENDED')
  })

  it('renders the DRAFT_TO_CORRECT label when isDraftToCorrect is set', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="DRAFT" isDraftToCorrect />)
    expect(baseElement).toHaveTextContent('status.eservice.DRAFT_TO_CORRECT')
  })

  it('renders the current version status for a purpose', () => {
    const purpose = createMockPurpose({ currentVersion: { state: 'ACTIVE' } })
    renderWithApplicationContext(<StatusChip for="purpose" purpose={purpose} />, {})

    expect(screen.getByText('status.purpose.ACTIVE')).toBeInTheDocument()
  })

  it('renders the state label for a non-suspended agreement', () => {
    const agreement = createMockAgreement({ state: 'ACTIVE' })
    renderWithApplicationContext(<StatusChip for="agreement" agreement={agreement} />, {})

    expect(screen.getByText('status.agreement.ACTIVE')).toBeInTheDocument()
  })

  it('masks ARCHIVING as the active (PUBLISHED) status', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="ARCHIVING" />)
    expect(baseElement).toHaveTextContent('status.eservice.PUBLISHED')
  })

  it('masks ARCHIVING_SUSPENDED as the suspended status', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="ARCHIVING_SUSPENDED" />)
    expect(baseElement).toHaveTextContent('status.eservice.SUSPENDED')
  })

  it('leaves non-archiving states unchanged', () => {
    const { baseElement } = render(<StatusChip for="eservice" state="DEPRECATED" />)
    expect(baseElement).toHaveTextContent('status.eservice.DEPRECATED')
  })
})
