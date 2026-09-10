import type { RequesterCertifiedAttribute } from '@/api/api.generatedTypes'
import * as stores from '@/stores'
import { formatThousands } from '@/utils/format.utils'
import { mockUseJwt, renderWithApplicationContext } from '@/utils/testing.utils'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AttributesTableRow, AttributesTableRowSkeleton } from '../AttributesTableRow'

const openDialogMock = vi.fn()

vi.spyOn(stores, 'useDialog').mockReturnValue({
  openDialog: openDialogMock,
} as never)

const baseCertifiedDiscreteAttribute: RequesterCertifiedAttribute = {
  tenantId: 'tenant-id-1',
  tenantName: 'Comune di Test',
  attributeId: 'attribute-id-1',
  attributeName: 'Codice ATECO',
  kind: 'CERTIFIED_DISCRETE',
  discreteValue: 1000,
}

const baseCertifiedAttribute: RequesterCertifiedAttribute = {
  tenantId: 'tenant-id-1',
  tenantName: 'Comune di Test',
  attributeId: 'attribute-id-1',
  attributeName: 'Codice ATECO',
  kind: 'CERTIFIED',
}

const renderRow = (attribute: RequesterCertifiedAttribute) =>
  renderWithApplicationContext(
    <table>
      <tbody>
        <AttributesTableRow attribute={attribute} />
      </tbody>
    </table>,
    { withRouterContext: true, withReactQueryContext: true }
  )

describe('AttributesTableRow', () => {
  beforeEach(() => {
    openDialogMock.mockReset()
  })

  it('should render tenant name, attribute name and formatted discrete value', () => {
    mockUseJwt({ isAdmin: true })

    const { getByText } = renderRow(baseCertifiedDiscreteAttribute)

    expect(getByText('Comune di Test')).toBeInTheDocument()
    expect(getByText('Codice ATECO')).toBeInTheDocument()
    expect(getByText(formatThousands(1000))).toBeInTheDocument()
  })

  it('should render "-" when discreteValue is missing', () => {
    mockUseJwt({ isAdmin: true })

    const { getByText } = renderRow(baseCertifiedAttribute)

    expect(getByText('-')).toBeInTheDocument()
  })

  it('should render only revoke action for admin for CERTIFIED attribute row', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole, queryByRole } = renderRow(baseCertifiedAttribute)

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))

    expect(getByRole('menuitem', { name: 'revokeAttributeBtn' })).toBeInTheDocument()
    expect(queryByRole('menuitem', { name: 'updateAttributeValueBtn' })).not.toBeInTheDocument()
  })

  it('should render revoke and update value actions for admin for CERTIFIED_DISCRETE attribute row', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole } = renderRow(baseCertifiedDiscreteAttribute)

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))

    expect(getByRole('menuitem', { name: 'revokeAttributeBtn' })).toBeInTheDocument()
    expect(getByRole('menuitem', { name: 'updateAttributeValueBtn' })).toBeInTheDocument()
  })

  it('should open revoke dialog when admin clicks the revoke action (CERTIFIED_DISCRETE)', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole } = renderRow(baseCertifiedDiscreteAttribute)

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(getByRole('menuitem', { name: 'revokeAttributeBtn' }))

    expect(openDialogMock).toHaveBeenCalledTimes(1)
    expect(openDialogMock).toHaveBeenCalledWith({
      type: 'revokeCertifiedAttribute',
      attribute: baseCertifiedDiscreteAttribute,
    })
  })

  it('should open revoke dialog when admin clicks the revoke action (CERTIFIED)', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole } = renderRow(baseCertifiedAttribute)

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(getByRole('menuitem', { name: 'revokeAttributeBtn' }))

    expect(openDialogMock).toHaveBeenCalledTimes(1)
    expect(openDialogMock).toHaveBeenCalledWith({
      type: 'revokeCertifiedAttribute',
      attribute: baseCertifiedAttribute,
    })
  })

  it('should open update value drawer when admin clicks the update value action (CERTIFIED_DISCRETE)', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole, getByText } = renderRow(baseCertifiedDiscreteAttribute)

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(getByRole('menuitem', { name: 'updateAttributeValueBtn' }))

    expect(getByText('title')).toBeInTheDocument()
    expect(getByRole('spinbutton', { name: 'form.valueField.label' })).toHaveValue(1000)
  })

  it('should render only revoke action for admin with CERTIFIED attribute', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole, queryByRole } = renderRow({
      ...baseCertifiedDiscreteAttribute,
      kind: 'CERTIFIED',
      discreteValue: undefined,
    })

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))

    expect(getByRole('menuitem', { name: 'revokeAttributeBtn' })).toBeInTheDocument()
    expect(queryByRole('menuitem', { name: 'updateAttributeValueBtn' })).not.toBeInTheDocument()
  })

  it('should not render revoke action for non-admin user', () => {
    mockUseJwt({ isAdmin: false })

    const { queryByRole } = renderRow(baseCertifiedDiscreteAttribute)

    expect(queryByRole('button', { name: 'iconButtonAriaLabel' })).not.toBeInTheDocument()
  })
})

describe('AttributesTableRowSkeleton', () => {
  it('should render skeleton cells', () => {
    const { container } = renderWithApplicationContext(
      <table>
        <tbody>
          <AttributesTableRowSkeleton />
        </tbody>
      </table>,
      { withRouterContext: true, withReactQueryContext: true }
    )

    const skeletons = container.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBe(4)
  })
})
