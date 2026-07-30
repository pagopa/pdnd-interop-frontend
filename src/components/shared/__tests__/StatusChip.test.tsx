import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StatusChip } from '../StatusChip'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import type { RiskAnalysisSigningState } from '@/api/api.generatedTypes'

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
