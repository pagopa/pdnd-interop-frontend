import { render } from '@testing-library/react'
import React from 'react'
import { Drawer } from '../Drawer'
import { vi } from 'vitest'
import { Typography } from '@mui/material'

describe('Drawer test', () => {
  it('Should not render when isOpen is false', () => {
    const { container } = render(
      <Drawer isOpen={false} onClose={vi.fn()} title="test title">
        <Typography>TEST CHILDREN</Typography>
      </Drawer>
    )

    expect(container).toBeEmptyDOMElement()
  })
})
