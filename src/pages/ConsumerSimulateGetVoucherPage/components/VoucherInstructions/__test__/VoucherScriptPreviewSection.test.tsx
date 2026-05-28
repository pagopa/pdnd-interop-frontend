import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

import { VoucherScriptPreviewSection } from '../VoucherScriptPreviewSection'

// Mock di CodeSnippetPreview
vi.mock('../CodeSnippetPreview', () => ({
  CodeSnippetPreview: () => <div data-testid="code-snippet-preview" />,
}))

describe('VoucherScriptPreviewSection', () => {
  const defaultProps = {
    fileUrl: '/test/file.py',
    previewUrl: '/test/preview.txt',
    fileName: 'file',
    substitutions: {
      VAR1: 'value1',
    },
  }

  it('renders section title', () => {
    render(
      <MemoryRouter>
        <VoucherScriptPreviewSection {...defaultProps} />
      </MemoryRouter>
    )

    expect(screen.getByText('assertionScript.title')).toBeInTheDocument()
  })

  it('renders all steps', () => {
    render(
      <MemoryRouter>
        <VoucherScriptPreviewSection {...defaultProps} />
      </MemoryRouter>
    )

    expect(screen.getByText('assertionScript.steps.1')).toBeInTheDocument()
    expect(screen.getByText('assertionScript.steps.2')).toBeInTheDocument()
    expect(screen.getByText('assertionScript.steps.3')).toBeInTheDocument()
    expect(screen.getByText('assertionScript.steps.4')).toBeInTheDocument()
    expect(screen.getByText('assertionScript.steps.5')).toBeInTheDocument()
  })

  it('renders CodeSnippetPreview', () => {
    render(
      <MemoryRouter>
        <VoucherScriptPreviewSection {...defaultProps} />
      </MemoryRouter>
    )

    expect(screen.getByTestId('code-snippet-preview')).toBeInTheDocument()
  })

  it('renders result step', () => {
    render(
      <MemoryRouter>
        <VoucherScriptPreviewSection {...defaultProps} />
      </MemoryRouter>
    )

    expect(screen.getByText('assertionScript.steps.result')).toBeInTheDocument()
  })
})
