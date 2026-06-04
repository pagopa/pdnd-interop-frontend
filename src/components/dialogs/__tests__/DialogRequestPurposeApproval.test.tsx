import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DialogRequestPurposeApproval } from '../DialogRequestPurposeApproval'

const closeDialogMock = vi.fn()
vi.mock('@/stores', () => ({
  useDialog: () => ({
    closeDialog: closeDialogMock,
  }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: (_ns: string, opts?: { keyPrefix?: string }) => ({
    t: (key: string) => (opts?.keyPrefix ? `${opts.keyPrefix}.${key}` : key),
  }),
  // For <Trans>, render a deterministic string that includes the interpolated reviewerId.
  Trans: ({ i18nKey, values }: { i18nKey: string; values?: Record<string, unknown> }) => (
    <span>
      {i18nKey}|reviewerId={String(values?.reviewerId ?? '')}
    </span>
  ),
}))

const defaultProps = {
  type: 'requestPurposeApproval' as const,
  reviewerId: 'reviewer-abc',
  onConfirm: vi.fn(),
}

describe('DialogRequestPurposeApproval', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the title, the description with the reviewerId interpolated, and both CTAs', () => {
    render(<DialogRequestPurposeApproval {...defaultProps} />)

    expect(
      screen.getByText('edit.stepRiskAnalysis.requestApprovalDialog.title')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'edit.stepRiskAnalysis.requestApprovalDialog.description|reviewerId=reviewer-abc'
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'actions.cancel' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'edit.stepRiskAnalysis.requestApprovalDialog.proceedLabel',
      })
    ).toBeInTheDocument()
  })

  it('closes the dialog without invoking onConfirm when "Annulla" is clicked', () => {
    const onConfirm = vi.fn()
    render(<DialogRequestPurposeApproval {...defaultProps} onConfirm={onConfirm} />)

    fireEvent.click(screen.getByRole('button', { name: 'actions.cancel' }))

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('invokes onConfirm and closes the dialog when "Conferma" is clicked', () => {
    const onConfirm = vi.fn()
    render(<DialogRequestPurposeApproval {...defaultProps} onConfirm={onConfirm} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'edit.stepRiskAnalysis.requestApprovalDialog.proceedLabel',
      })
    )

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(closeDialogMock).toHaveBeenCalledTimes(1)
  })
})
