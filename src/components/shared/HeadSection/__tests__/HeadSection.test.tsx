import React from 'react'
import { render } from '@testing-library/react'
import { HeadSection } from '../HeadSection'
import type { ActionItemButton } from '@/types/common.types'

describe('HeadSection', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<HeadSection title="title" />)
    expect(baseElement).toBeInTheDocument()
    expect(baseElement).toHaveTextContent('title')
  })

  it('should render correctly with description', () => {
    const { baseElement } = render(<HeadSection title="title" description="description" />)
    expect(baseElement).toBeInTheDocument()
    expect(baseElement).toHaveTextContent('title')
    expect(baseElement).toHaveTextContent('description')
  })

  it('should render correctly with a single action', () => {
    const actions: ActionItemButton[] = [{ label: 'action', action: () => {} }]
    const headSection = render(
      <HeadSection title="title" description="description" actions={actions} />
    )

    const actionButton = headSection.queryByRole('button', { name: 'action' })
    expect(actionButton).toBeInTheDocument()
    expect(actionButton).toHaveTextContent('action')
  })

  it('should render correctly with two actions', () => {
    const actions: ActionItemButton[] = [
      { label: 'action1', action: () => {} },
      { label: 'action2', action: () => {} },
    ]
    const headSection = render(
      <HeadSection title="title" description="description" actions={actions} />
    )

    const actionsButton = headSection.queryAllByRole('button')
    expect(actionsButton).toHaveLength(2)
    expect(actionsButton[0]).toHaveTextContent('action1')
    expect(actionsButton[1]).toHaveTextContent('action2')
  })

  it('should render correctly with more than two actions', () => {
    const actions: ActionItemButton[] = [
      { label: 'action1', action: () => {} },
      { label: 'action2', action: () => {} },
      { label: 'action3', action: () => {} },
    ]
    const headSection = render(
      <HeadSection title="title" description="description" actions={actions} />
    )

    const action1Button = headSection.queryByRole('button', { name: 'action1' })
    expect(action1Button).toBeInTheDocument()
    const action2Button = headSection.queryByRole('button', { name: 'action2' })
    expect(action2Button).toBeInTheDocument()

    const actionMenu = headSection.queryByRole('button', { name: 'iconButtonAriaLabel' })
    expect(actionMenu).toBeInTheDocument()
  })

  it('should render correctly with headVariant primary', () => {
    const headSection = render(
      <HeadSection title="title" description="description" headVariant="primary" />
    )

    const title = headSection.queryByRole('heading', { name: 'title', level: 4 })
    expect(title).toBeInTheDocument()

    const description = headSection.queryByText('description')
    expect(description).toBeInTheDocument()
  })

  it('should render correctly with headVariant secondary', () => {
    const headSection = render(
      <HeadSection title="title" description="description" headVariant="secondary" />
    )

    const title = headSection.queryByRole('heading', { name: 'title', level: 6 })
    expect(title).toBeInTheDocument()

    const description = headSection.queryByText('description')
    expect(description).toBeInTheDocument()
  })
})
