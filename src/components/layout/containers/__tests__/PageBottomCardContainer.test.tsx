import React from 'react'
import { render } from '@testing-library/react'
import {
  PageBottomActionsCardContainer,
  PageBottomActionsCardContainerSkeleton,
} from '../PageBottomCardContainer'

describe('PageBottomCardContainer', () => {
  it('should match the snapshot', () => {
    const screen = render(
      <PageBottomActionsCardContainer title="title">{}</PageBottomActionsCardContainer>
    )
    expect(screen.baseElement).toMatchSnapshot()
  })

  it('should match the snapshot with description', () => {
    const screen = render(
      <PageBottomActionsCardContainer title="title" description="description">
        {}
      </PageBottomActionsCardContainer>
    )
    expect(screen.baseElement).toMatchSnapshot()
  })
})

describe('PageBottomCardContainerSkeleton', () => {
  it('should match the snapshot', () => {
    const screen = render(<PageBottomActionsCardContainerSkeleton />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})
