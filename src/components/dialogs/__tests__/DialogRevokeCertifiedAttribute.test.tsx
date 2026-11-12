import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DialogRevokeCertifiedAttribute } from '../DialogRevokeCertifiedAttribute'

const closeDialogMock = vi.fn()
const revokeCertifiedAttributeMock = vi.fn()
const revokeCertifiedDiscreteAttributeMock = vi.fn()
const useRevokeCertifiedAttributeMock = vi.fn()
const useRevokeCertifiedDiscreteAttributeMock = vi.fn()

vi.mock('@/stores', () => ({
  useDialog: () => ({
    closeDialog: closeDialogMock,
  }),
}))

vi.mock('@/api/attribute', () => ({
  AttributeMutations: {
    useRevokeCertifiedAttribute: () => useRevokeCertifiedAttributeMock(),
    useRevokeCertifiedDiscreteAttribute: () => useRevokeCertifiedDiscreteAttributeMock(),
  },
}))

describe('DialogRevokeCertifiedAttribute', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useRevokeCertifiedAttributeMock.mockReturnValue({
      mutate: revokeCertifiedAttributeMock,
      isPending: false,
    })

    useRevokeCertifiedDiscreteAttributeMock.mockReturnValue({
      mutate: revokeCertifiedDiscreteAttributeMock,
      isPending: false,
    })
  })

  it('should render dialog informations', () => {
    render(
      <DialogRevokeCertifiedAttribute
        type="revokeCertifiedAttribute"
        attribute={{
          tenantId: 'tenant-id',
          tenantName: 'Tenant Name',
          attributeId: 'attribute-id',
          attributeName: 'Attribute Name',
          kind: 'CERTIFIED',
        }}
      />
    )

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('content.checkbox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'revoke' })).toBeInTheDocument()
  })

  it('should close dialog when cancel is clicked', async () => {
    const user = userEvent.setup()

    render(
      <DialogRevokeCertifiedAttribute
        type="revokeCertifiedAttribute"
        attribute={{
          tenantId: 'tenant-id',
          tenantName: 'Tenant Name',
          attributeId: 'attribute-id',
          attributeName: 'Attribute Name',
          kind: 'CERTIFIED',
        }}
      />
    )

    await user.click(screen.getByRole('button', { name: 'cancel' }))

    expect(closeDialogMock).toHaveBeenCalledTimes(1)
    expect(revokeCertifiedAttributeMock).not.toHaveBeenCalled()
    expect(revokeCertifiedDiscreteAttributeMock).not.toHaveBeenCalled()
  })

  it('should keep revoke button disabled until confirmation checkbox is checked', async () => {
    const user = userEvent.setup()

    render(
      <DialogRevokeCertifiedAttribute
        type="revokeCertifiedAttribute"
        attribute={{
          tenantId: 'tenant-id',
          tenantName: 'Tenant Name',
          attributeId: 'attribute-id',
          attributeName: 'Attribute Name',
          kind: 'CERTIFIED',
        }}
      />
    )

    const revokeButton = screen.getByRole('button', { name: 'revoke' })
    expect(revokeButton).toBeDisabled()

    await user.click(screen.getByRole('checkbox', { name: 'content.checkbox' }))
    expect(revokeButton).toBeEnabled()
  })

  it('should call revokeCertifiedAttribute for CERTIFIED kind and close dialog', async () => {
    const user = userEvent.setup()

    render(
      <DialogRevokeCertifiedAttribute
        type="revokeCertifiedAttribute"
        attribute={{
          tenantId: 'tenant-id',
          tenantName: 'Tenant Name',
          attributeId: 'attribute-id',
          attributeName: 'Attribute Name',
          kind: 'CERTIFIED',
        }}
      />
    )

    await user.click(screen.getByRole('checkbox', { name: 'content.checkbox' }))
    await user.click(screen.getByRole('button', { name: 'revoke' }))

    expect(revokeCertifiedAttributeMock).toHaveBeenCalledWith({
      tenantId: 'tenant-id',
      attributeId: 'attribute-id',
    })
    expect(revokeCertifiedDiscreteAttributeMock).not.toHaveBeenCalled()
    expect(closeDialogMock).toHaveBeenCalledTimes(1)
  })

  it('should call revokeCertifiedDiscreteAttribute for CERTIFIED_DISCRETE kind and close dialog', async () => {
    const user = userEvent.setup()

    render(
      <DialogRevokeCertifiedAttribute
        type="revokeCertifiedAttribute"
        attribute={{
          tenantId: 'tenant-id-discrete',
          tenantName: 'Tenant Name Discrete',
          attributeId: 'attribute-id-discrete',
          attributeName: 'Attribute Name Discrete',
          kind: 'CERTIFIED_DISCRETE',
        }}
      />
    )

    await user.click(screen.getByRole('checkbox', { name: 'content.checkbox' }))
    await user.click(screen.getByRole('button', { name: 'revoke' }))

    expect(revokeCertifiedDiscreteAttributeMock).toHaveBeenCalledWith({
      tenantId: 'tenant-id-discrete',
      attributeId: 'attribute-id-discrete',
    })
    expect(revokeCertifiedAttributeMock).not.toHaveBeenCalled()
    expect(closeDialogMock).toHaveBeenCalledTimes(1)
  })
})
