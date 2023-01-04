import React from 'react'
import { renderWithApplicationContext } from '@/__mocks__/mock.utils'
import { RouterProvider } from '@/router'

describe('determine whether RouterProvider renders without errors', () => {
  it('renders correctly', async () => {
    renderWithApplicationContext(<RouterProvider />, { withRouterContext: false })
  })
})
