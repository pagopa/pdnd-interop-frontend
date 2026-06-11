import { screen } from '@testing-library/react'
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
})
