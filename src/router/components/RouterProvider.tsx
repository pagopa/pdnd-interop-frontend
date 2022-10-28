import React from 'react'
import { RouterProvider as _RouterProvider } from 'react-router-dom'
import { router } from '@/router/routes'

const RouterProvider: React.FC = () => {
  return <_RouterProvider router={router} />
}

export default RouterProvider
