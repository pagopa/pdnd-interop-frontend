import React from 'react'
import { Footer } from '../Footer'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('Footer', () => {
  it('should match snapshot', () => {
    const tree = renderWithApplicationContext(<Footer />, { withRouterContext: true })
    expect(tree.baseElement).toMatchSnapshot()
  })
})
