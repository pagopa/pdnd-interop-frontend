import React from 'react'
import NotFoundPage from '../NotFound.page'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('NotFound', () => {
  it('should match the snapshot', () => {
    const { baseElement } = renderWithApplicationContext(<NotFoundPage />, {
      withRouterContext: true,
    })

    expect(baseElement).toMatchSnapshot()
  })
})
