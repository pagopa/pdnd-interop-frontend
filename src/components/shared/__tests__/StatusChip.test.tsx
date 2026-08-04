import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusChip } from '../StatusChip'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { createMockAgreement } from '@/../__mocks__/data/agreement.mocks'

describe('StatusChip', () => {
  // The risk analysis chip routes the state to its label key (i18n returns the key
  // as text in tests) and to its color through the shared data-driven arm, so both
  // the label namespace and the resolved `MuiChip-color*` class are asserted.
  it.each<[Exclude<RiskAnalysisSigningState, 'DRAFT'>, string]>([
    ['ASSIGNED', 'MuiChip-colorWarning'],
    ['SUBMITTED', 'MuiChip-colorInfo'],
    ['SIGNED', 'MuiChip-colorSuccess'],
    ['REJECTED', 'MuiChip-colorError'],
  ])('renders the risk analysis label and color for state %s', (state, colorClass) => {
    renderWithApplicationContext(<StatusChip for="riskAnalysis" state={state} />, {})

    const chip = screen.getByText(`status.riskAnalysis.${state}`).closest('.MuiChip-root')
    expect(chip).toBeInTheDocument()
    expect(chip).toHaveClass(colorClass)
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

  it('renders a tooltip when tooltipLabel is provided', () => {
    render(<StatusChip for="eservice" state="PUBLISHED" tooltipLabel="Archiving on 01/08/2026" />)
    expect(screen.getByLabelText('Archiving on 01/08/2026')).toBeInTheDocument()
  })

  it('does not render a tooltip when tooltipLabel is not provided', () => {
    const { container } = render(<StatusChip for="eservice" state="PUBLISHED" />)
    expect(container.querySelector('[aria-label]')).toBeNull()
  })

  it('does not leak isDraftToCorrect into the DOM', () => {
    const { container } = render(
      <StatusChip for="eservice" state="DRAFT" isDraftToCorrect={true} />
    )
    expect(container.querySelector('[isdrafttocorrect]')).toBeNull()
  })

  it('renders the isDraftToCorrect warning label when isDraftToCorrect is true', () => {
    const { baseElement } = render(
      <StatusChip for="eservice" state="DRAFT" isDraftToCorrect={true} />
    )
    expect(baseElement).toHaveTextContent('status.eservice.DRAFT_TO_CORRECT')
  })

  it('renders the descriptor label for PUBLISHED state', () => {
    const { baseElement } = render(
      <StatusChip for="descriptor" state="PUBLISHED" isActiveDescriptor={false} />
    )
    expect(baseElement).toHaveTextContent('status.descriptor.PUBLISHED')
  })

  it('masks descriptor ARCHIVING as PUBLISHED when isActiveDescriptor is true', () => {
    const { baseElement } = render(
      <StatusChip for="descriptor" state="ARCHIVING" isActiveDescriptor={true} />
    )
    expect(baseElement).toHaveTextContent('status.descriptor.PUBLISHED')
  })

  it('masks descriptor ARCHIVING_SUSPENDED as SUSPENDED when isActiveDescriptor is true', () => {
    const { baseElement } = render(
      <StatusChip for="descriptor" state="ARCHIVING_SUSPENDED" isActiveDescriptor={true} />
    )
    expect(baseElement).toHaveTextContent('status.descriptor.SUSPENDED')
  })

  it('renders the delegation label for ACTIVE state', () => {
    const { baseElement } = render(<StatusChip for="delegation" state="ACTIVE" />)
    expect(baseElement).toHaveTextContent('status.delegation.ACTIVE')
  })

  it('renders the eserviceTemplate label for PUBLISHED state', () => {
    const { baseElement } = render(<StatusChip for="eserviceTemplate" state="PUBLISHED" />)
    expect(baseElement).toHaveTextContent('status.eserviceTemplate.PUBLISHED')
  })

  it('renders the purposeTemplate label for DRAFT state', () => {
    const { baseElement } = render(<StatusChip for="purposeTemplate" state="DRAFT" />)
    expect(baseElement).toHaveTextContent('status.purposeTemplate.DRAFT')
  })
})
