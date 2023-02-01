import React from 'react'
import { RouterProvider } from '@/router'
import { renderWithApplicationContext } from '@/utils/testing.utils'

describe('determine whether RouterProvider renders without errors', () => {
  it('renders correctly', async () => {
    renderWithApplicationContext(<RouterProvider />, { withRouterContext: false })
  })
})
