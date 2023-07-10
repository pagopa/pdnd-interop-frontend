import { render } from '@testing-library/react'
import React from 'react'
import { Drawer } from '../Drawer'
import { vi } from 'vitest'
import { Typography } from '@mui/material'

describe('Drawer test', () => {
  it('Should not render when isOpen is false', () => {
    const { container } = render(
      <Drawer isOpen={false} closeAction={vi.fn()} title="test title">
        <Typography>TEST CHILDREN</Typography>
      </Drawer>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('Should render correctly without subtitle and button', () => {
    const screen = render(
      <Drawer isOpen={true} closeAction={vi.fn()} title="test title">
        <Typography>TEST CHILDREN</Typography>
      </Drawer>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('Should render correctly with subtitle and without button', () => {
    const screen = render(
      <Drawer isOpen={true} closeAction={vi.fn()} title="test title" subtitle="test subtitle">
        <Typography>TEST CHILDREN</Typography>
      </Drawer>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })

  it('Should render correctly with subtitle and button', () => {
    const screen = render(
      <Drawer
        isOpen={true}
        closeAction={vi.fn()}
        title="test title"
        subtitle="test subtitle"
        buttonAction={{ label: 'button label', action: vi.fn() }}
      >
        <Typography>TEST CHILDREN</Typography>
      </Drawer>
    )

    expect(screen.baseElement).toMatchSnapshot()
  })
})
