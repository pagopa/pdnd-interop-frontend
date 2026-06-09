import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SummaryAccordion } from '../SummaryAccordion'

describe('SummaryAccordion', () => {
  it('renders no status chip when statusChip is not provided', () => {
    render(
      <SummaryAccordion headline="1" title="Title">
        <div>content</div>
      </SummaryAccordion>
    )

    expect(screen.queryByText('Status')).not.toBeInTheDocument()
  })

  it('renders the status chip label when statusChip is provided', () => {
    render(
      <SummaryAccordion
        headline="1"
        title="Title"
        statusChip={{ label: 'Status', color: 'warning' }}
      >
        <div>content</div>
      </SummaryAccordion>
    )

    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders only the header (no body, no expand affordance) when there is no content', () => {
    render(
      <SummaryAccordion
        headline="1"
        title="Title"
        statusChip={{ label: 'Status', color: 'warning' }}
      >
        {null}
      </SummaryAccordion>
    )

    // Header (title + chip) is still visible...
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    // ...but the body content and the expand icon are not rendered.
    expect(screen.queryByText('content')).not.toBeInTheDocument()
    expect(screen.queryByTestId('ExpandMoreIcon')).not.toBeInTheDocument()
  })
})
