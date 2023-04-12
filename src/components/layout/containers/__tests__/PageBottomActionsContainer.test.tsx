import React from 'react'
import { render } from '@testing-library/react'
import { PageBottomActionsContainer } from '../PageBottomActionsContainer'

describe('PageBottomActionsContainer', () => {
  it('should match the snapshot', () => {
    const screen = render(<PageBottomActionsContainer>{}</PageBottomActionsContainer>)
    expect(screen.baseElement).toMatchSnapshot()
  })
})
