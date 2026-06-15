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
    t: (key: string, values?: Record<string, unknown>) => {
      const path = opts?.keyPrefix ? `${opts.keyPrefix}.${key}` : key
      if (!values) return path
      const serialized = Object.entries(values)
        .map(([k, v]) => `${k}=${String(v)}`)
        .join(',')
      return `${path}(${serialized})`
    },
  }),
  // Project pattern: <Trans components={{ strong: ... }}>{t('key', values)}</Trans>.
  // The real Trans parses the resolved children for tag markers and replaces
  // them with components.strong. We don't simulate parsing — we render the
  // resolved string verbatim AND a marker element so the test can confirm
  // the strong wrapper was passed.
  Trans: ({
    children,
    components,
  }: {
    children?: React.ReactNode
    components?: { strong?: React.ReactElement }
  }) => (
    <span>
      {children}
      {components?.strong &&
        React.cloneElement(components.strong, { 'data-testid': 'reviewer-id-strong' })}
    </span>
  ),
}))

const defaultProps = {
  type: 'requestPurposeApproval' as const,
  reviewer: { userId: 'reviewer-1', name: 'Mario', familyName: 'Rossi' },
  onConfirm: vi.fn(),
}

describe('DialogRequestPurposeApproval', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the title, the description with the reviewerName interpolated, a strong wrapper, and both CTAs', () => {
    render(<DialogRequestPurposeApproval {...defaultProps} />)

    expect(
      screen.getByText('edit.stepRiskAnalysis.requestApprovalDialog.title')
    ).toBeInTheDocument()
    // The description string from t() is resolved with reviewerName interpolated.
    expect(
      screen.getByText(
        'edit.stepRiskAnalysis.requestApprovalDialog.description(reviewerName=Mario Rossi)'
      )
    ).toBeInTheDocument()
    // <Trans> receives a `components.strong` to wrap the bold portion.
    expect(screen.getByTestId('reviewer-id-strong')).toBeInTheDocument()
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
