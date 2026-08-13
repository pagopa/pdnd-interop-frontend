import type { RequesterCertifiedAttribute } from '@/api/api.generatedTypes'
import { renderWithApplicationContext } from '@/utils/testing.utils'
import { screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AttributesTable, AttributesTableSkeleton } from '../AttributesTable'

vi.mock('../AttributesTableRow', () => ({
  AttributesTableRow: ({ attribute }: { attribute: RequesterCertifiedAttribute }) => (
    <tr data-testid="attributes-table-row">
      <td>{attribute.attributeId}</td>
    </tr>
  ),
  AttributesTableRowSkeleton: () => (
    <tr data-testid="attributes-table-row-skeleton">
      <td>skeleton</td>
    </tr>
  ),
}))

const mockAttributes: Array<RequesterCertifiedAttribute> = [
  {
    tenantId: 'tenant-id-1',
    tenantName: 'Comune di Test 1',
    attributeId: 'attribute-id-1',
    attributeName: 'Codice ATECO 1',
    kind: 'CERTIFIED_DISCRETE',
    discreteValue: 123,
  },
  {
    tenantId: 'tenant-id-2',
    tenantName: 'Comune di Test 2',
    attributeId: 'attribute-id-2',
    attributeName: 'Codice ATECO 2',
    kind: 'CERTIFIED_DISCRETE',
    discreteValue: 456,
  },
]

describe('AttributesTable', () => {
  it('should render 4 columns in table head', () => {
    renderWithApplicationContext(<AttributesTable attributes={mockAttributes} />, {})

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(4)
    expect(screen.getByRole('columnheader', { name: 'assigneeTenant' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'certifiedAttribute' })).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', {
        name: 'certifiedDiscreteAttributeValue',
      })
    ).toBeInTheDocument()
  })

  it('should render a row for each attribute', () => {
    renderWithApplicationContext(<AttributesTable attributes={mockAttributes} />, {})

    expect(screen.getAllByTestId('attributes-table-row')).toHaveLength(2)
  })

  it('should render an alert when attributes are empty', () => {
    renderWithApplicationContext(<AttributesTable attributes={[]} />, {})

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

describe('AttributesTableSkeleton', () => {
  it('should render 4 columns in table head and 5 skeleton rows', () => {
    renderWithApplicationContext(<AttributesTableSkeleton />, {})

    const headers = screen.getAllByRole('columnheader')
    expect(headers).toHaveLength(4)
    expect(screen.getAllByTestId('attributes-table-row-skeleton')).toHaveLength(5)
  })
})
