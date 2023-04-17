import React from 'react'
import { render } from '@testing-library/react'
import { EServiceLinksSection } from '../EServiceLinksSection'

describe('EServiceLinksSection', () => {
  it('should match the snapshot', () => {
    const screen = render(<EServiceLinksSection />)
    expect(screen.baseElement).toMatchSnapshot()
  })
})
