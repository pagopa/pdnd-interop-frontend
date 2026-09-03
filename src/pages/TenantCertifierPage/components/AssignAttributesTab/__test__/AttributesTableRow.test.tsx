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

const baseAttribute: RequesterCertifiedAttribute = {
  tenantId: 'tenant-id-1',
  tenantName: 'Comune di Test',
  attributeId: 'attribute-id-1',
  attributeName: 'Codice ATECO',
  kind: 'CERTIFIED_DISCRETE',
  discreteValue: 1000,
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

    const { getByText } = renderRow(baseAttribute)

    expect(getByText('Comune di Test')).toBeInTheDocument()
    expect(getByText('Codice ATECO')).toBeInTheDocument()
    expect(getByText(formatThousands(1000))).toBeInTheDocument()
  })

  it('should render "-" when discreteValue is missing', () => {
    mockUseJwt({ isAdmin: true })

    const { getByText } = renderRow({
      ...baseAttribute,
      discreteValue: undefined,
    })

    expect(getByText('-')).toBeInTheDocument()
  })

  it('should render revoke and change value actions for admin with CERTIFIED_DISCRETE attribute', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole } = renderRow(baseAttribute)

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))

    expect(getByRole('menuitem', { name: 'revokeAttributeBtn' })).toBeInTheDocument()
    expect(getByRole('menuitem', { name: 'changeAttributeValueBtn' })).toBeInTheDocument()
  })

  it('should open revoke dialog when admin clicks the revoke action', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole } = renderRow(baseAttribute)

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(getByRole('menuitem', { name: 'revokeAttributeBtn' }))

    expect(openDialogMock).toHaveBeenCalledTimes(1)
    expect(openDialogMock).toHaveBeenCalledWith({
      type: 'revokeCertifiedAttribute',
      attribute: baseAttribute,
    })
  })

  it('should open change value drawer when admin clicks the change value action', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole, getByText } = renderRow(baseAttribute)

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))
    await user.click(getByRole('menuitem', { name: 'changeAttributeValueBtn' }))

    expect(getByText('title')).toBeInTheDocument()
    expect(getByRole('spinbutton', { name: 'form.valueField.label' })).toHaveValue(1000)
  })

  it('should render only revoke action for admin with CERTIFIED attribute', async () => {
    mockUseJwt({ isAdmin: true })

    const { getByRole, queryByRole } = renderRow({
      ...baseAttribute,
      kind: 'CERTIFIED',
      discreteValue: undefined,
    })

    const user = userEvent.setup()
    await user.click(getByRole('button', { name: 'iconButtonAriaLabel' }))

    expect(getByRole('menuitem', { name: 'revokeAttributeBtn' })).toBeInTheDocument()
    expect(queryByRole('menuitem', { name: 'changeAttributeValueBtn' })).not.toBeInTheDocument()
  })

  it('should not render revoke action for non-admin user', () => {
    mockUseJwt({ isAdmin: false })

    const { queryByRole } = renderRow(baseAttribute)

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
