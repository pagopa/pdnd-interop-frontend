import React from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'

import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import type { ActionItem } from '@/types/common.types'
import userEvent from '@testing-library/user-event'

const functionSpy1 = vi.fn()
const functionSpy2 = vi.fn()

const mockActions: Array<ActionItem> = [
  {
    action: functionSpy1,
    label: 'action1',
  },
  {
    action: functionSpy2,
    label: 'action2',
  },
]

describe("Checks that ActionMenu snapshots don't change", () => {
  it('renders correctly', () => {
    const actionMenu = render(<ActionMenu actions={mockActions} />)

    expect(actionMenu.baseElement).toMatchSnapshot()
  })

  it('renders correctly without actions', async () => {
    const actionMenu = render(<ActionMenu actions={[]} />)

    expect(actionMenu.baseElement).toMatchSnapshot()
  })

  it('renders correctly while opened', async () => {
    const user = userEvent.setup()
    const actionMenu = render(<ActionMenu actions={mockActions} />)
    const button = actionMenu.queryByRole('button', { name: 'iconButtonAriaLabel' })

    await user.click(button!)

    expect(actionMenu.baseElement).toMatchSnapshot()
  })
})

describe('Unit tests for ActionMenu', () => {
  it('opens and closes', async () => {
    const user = userEvent.setup()
    const screen = render(<ActionMenu actions={mockActions} />)
    const button = screen.queryByRole('button', { name: 'iconButtonAriaLabel' })

    await user.click(button!)

    expect(screen.queryByRole('menu')).toBeInTheDocument()
    expect(screen.queryByRole('menu')).toBeInTheDocument()

    await user.click(button!)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should close on tab key down press', async () => {
    const user = userEvent.setup()
    const screen = render(<ActionMenu actions={mockActions} />)
    const button = screen.queryByRole('button', { name: 'iconButtonAriaLabel' })

    await user.click(button!)
    expect(screen.queryByRole('menu')).toBeInTheDocument()
    await user.tab()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    await user.click(button!)
    expect(screen.queryByRole('menu')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('fires the actions on action menu item click', async () => {
    const user = userEvent.setup()
    const actionMenu = render(<ActionMenu actions={mockActions} />)
    const button = actionMenu.queryByRole('button', { name: 'iconButtonAriaLabel' })

    await user.click(button!)

    expect(actionMenu.baseElement).toHaveTextContent('action1')
    const actions = actionMenu.queryAllByRole('menuitem')

    await user.click(actions![0])
    expect(functionSpy1).toHaveBeenCalled()

    await user.click(button!)

    const actionsAfter = actionMenu.queryAllByRole('menuitem')

    expect(actionMenu.baseElement).toHaveTextContent('action2')

    await user.click(actionsAfter![1])
    expect(functionSpy2).toHaveBeenCalled()
  })
})

describe('ActionMenuSkeleton', () => {
  it('should match the snapshot', () => {
    const { baseElement } = render(<ActionMenuSkeleton />)
    expect(baseElement).toBeInTheDocument()
  })
})
