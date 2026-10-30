import { act, render, screen, waitFor } from '@testing-library/react'
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

  it('requires a personal-data choice before invoking confirmation', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <DialogTenantKindPurposeTemplate type="tenantKindPurposeTemplate" onConfirm={onConfirm} />
    )
    await user.click(screen.getByRole('button', { name: 'confirm' }))
    expect(
      await screen.findByText('dialogPurposeTemplatesTenantKind.content.personalDataRadioBtn.error')
    ).toBeInTheDocument()
    expect(onConfirm).not.toHaveBeenCalled()
    expect(closeDialogMock).not.toHaveBeenCalled()
  })

  it('passes PRIVATE and false to a synchronous local callback before closing', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    render(
      <DialogTenantKindPurposeTemplate type="tenantKindPurposeTemplate" onConfirm={onConfirm} />
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'content.options.labelNotPA' }))
    await user.click(screen.getByLabelText('content.personalDataRadioBtn.options.false'))
    await user.click(screen.getByRole('button', { name: 'confirm' }))
    await waitFor(() => expect(closeDialogMock).toHaveBeenCalledOnce())
    expect(onConfirm).toHaveBeenCalledWith('PRIVATE', false)
    expect(onConfirm.mock.invocationCallOrder[0]).toBeLessThan(
      closeDialogMock.mock.invocationCallOrder[0]
    )
  })

  it.each(['resolve', 'reject'] as const)(
    'does not close before async %s and retains the choices on failure',
    async (outcome) => {
      let resolve!: () => void
      let reject!: (reason: Error) => void
      const onConfirm = vi
        .fn<OnConfirm>()
        .mockReturnValueOnce(
          new Promise<void>((resolvePromise, rejectPromise) => {
            resolve = resolvePromise
            reject = rejectPromise
          })
        )
        .mockResolvedValue(undefined)
      await submitSelections(onConfirm)
      expect(onConfirm).toHaveBeenCalledWith('PA', true)
      expect(closeDialogMock).not.toHaveBeenCalled()
      await act(async () => {
        if (outcome === 'resolve') resolve()
        else reject(new Error('backend failure'))
      })
      if (outcome === 'reject') {
        expect(closeDialogMock).not.toHaveBeenCalled()
        expect(screen.getByRole('combobox')).toHaveValue('content.options.labelPA')
        expect(screen.getByLabelText('content.personalDataRadioBtn.options.true')).toBeChecked()
        await userEvent.click(screen.getByRole('button', { name: 'confirm' }))
        expect(onConfirm).toHaveBeenCalledTimes(2)
      }
      await waitFor(() => expect(closeDialogMock).toHaveBeenCalledOnce())
    }
  )

  it('cancels without calling confirmation', async () => {
    const onConfirm = vi.fn()
    render(
      <DialogTenantKindPurposeTemplate type="tenantKindPurposeTemplate" onConfirm={onConfirm} />
    )
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(closeDialogMock).toHaveBeenCalledOnce()
    expect(onConfirm).not.toHaveBeenCalled()
  })
})
