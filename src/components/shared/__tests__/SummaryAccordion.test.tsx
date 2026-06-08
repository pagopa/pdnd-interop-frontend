import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryAccordion } from '../SummaryAccordion'

const getChipRoot = (label: string) => screen.getByText(label).closest('.MuiChip-root')

describe('SummaryAccordion', () => {
  it('renders no chip when statusChip is not provided', () => {
    render(
      <SummaryAccordion headline="1" title="Title">
        <div>content</div>
      </SummaryAccordion>
    )

    expect(document.querySelector('.MuiChip-root')).not.toBeInTheDocument()
  })

  it.each([
    ['warning', 'MuiChip-colorWarning'],
    ['success', 'MuiChip-colorSuccess'],
    ['error', 'MuiChip-colorError'],
  ] as const)('renders a %s status chip via the statusChip prop', (color, expectedClass) => {
    render(
      <SummaryAccordion headline="1" title="Title" statusChip={{ label: 'Status', color }}>
        <div>content</div>
      </SummaryAccordion>
    )

    expect(getChipRoot('Status')).toHaveClass(expectedClass)
  })
})
