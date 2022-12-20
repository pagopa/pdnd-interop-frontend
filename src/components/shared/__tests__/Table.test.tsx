import React from 'react'
import { render } from '@testing-library/react'
import { Table, TableRow } from '@/components/shared/Table'
import { Button, Chip } from '@mui/material'
import { vi } from 'vitest'

const tableInputs = {
  standard: {
    headLabels: ['c1', 'c2', 'c3', 'c4'],
    children: (
      <>
        <TableRow
          cellData={[
            { label: 'r1c1' },
            { label: 'r1c2' },
            { label: 'r1c3' },
            { custom: <Chip label="r1c4" /> },
          ]}
        >
          <Button>r1c4</Button>
        </TableRow>
        <TableRow
          cellData={[
            { label: 'r2c1' },
            { label: 'r2c2' },
            { label: 'r2c3' },
            { custom: <Chip label="r2c4" /> },
          ]}
        >
          <Button>r2c4</Button>
        </TableRow>
        <TableRow
          cellData={[
            { label: 'r3c1' },
            { label: 'r3c2' },
            { label: 'r3c3' },
            { custom: <Chip label="r3c4" /> },
          ]}
        >
          <Button>r3c4</Button>
        </TableRow>
      </>
    ),
  },
  emptyState: {
    headLabels: ['c1', 'c2', 'c3', 'c4'],
    children: <React.Fragment />,
    emptyState: true,
    noDataLabel: 'noDataLabel',
  },
}

describe("Checks that Table snapshots didn't change", () => {
  it('renders a Table with 2 head labels and 2 rows', () => {
    const table = render(<Table {...tableInputs.standard}>{tableInputs.standard.children}</Table>)

    expect(table).toMatchSnapshot()
  })

  it('renders Table empty state', () => {
    const table = render(<Table {...tableInputs.emptyState}>{tableInputs.standard.children}</Table>)

    expect(table).toMatchSnapshot()
  })
})
