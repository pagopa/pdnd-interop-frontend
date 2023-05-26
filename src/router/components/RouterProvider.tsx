import React from 'react'
import { RouterProvider as _RouterProvider } from 'react-router-dom'
import { router } from '../routes'

export const RouterProvider: React.FC = () => {
  return <_RouterProvider router={router} />
}
