import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TargetTenantKind } from '@/api/api.generatedTypes'
import { DialogTenantKindPurposeTemplate } from '../DialogTenantKindPurposeTemplate'

const { closeDialogMock } = vi.hoisted(() => ({
  closeDialogMock: vi.fn(),
}))

vi.mock('@/stores', () => ({
  useDialog: () => ({ closeDialog: closeDialogMock }),
}))

describe('DialogTenantKindPurposeTemplate async confirmation', () => {
  type OnConfirm = (
    tenantKind: TargetTenantKind,
    handlesPersonalData: boolean
  ) => void | Promise<void>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const submitSelections = async (onConfirm: OnConfirm) => {
    const user = userEvent.setup()
    render(
      <DialogTenantKindPurposeTemplate type="tenantKindPurposeTemplate" onConfirm={onConfirm} />
    )

    await user.click(screen.getByLabelText('content.personalDataRadioBtn.options.true'))
    await user.click(screen.getByRole('button', { name: 'confirm' }))
  }

  it('keeps the dialog open when the confirmation callback rejects', async () => {
    const onConfirm = vi.fn<OnConfirm>().mockRejectedValue(new Error('request failed'))

    await submitSelections(onConfirm)

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith('PA', true))
    expect(closeDialogMock).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('closes the dialog after the confirmation callback succeeds', async () => {
    const onConfirm = vi.fn<OnConfirm>().mockResolvedValue(undefined)

    await submitSelections(onConfirm)

    await waitFor(() => expect(closeDialogMock).toHaveBeenCalledOnce())
    expect(onConfirm).toHaveBeenCalledWith('PA', true)
  })
})
