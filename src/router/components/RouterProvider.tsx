import React from 'react'
import { RouterProvider as _RouterProvider } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AuthQueries } from '@/api/auth'
import { FirstLoadingSpinner } from '@/components/shared/FirstLoadingSpinner'
import { getRouter } from '../routes'

export const RouterProvider: React.FC = () => {
  const { isPending } = useQuery({
    ...AuthQueries.getSessionToken(),
    throwOnError: false,
    retryOnMount: false,
  })

  // Authentication removes the Selfcare fragment before the router captures
  // its initial location. Keep errors for the route's existing error boundary.
  if (isPending) return <FirstLoadingSpinner />

  return <_RouterProvider router={getRouter()} />
}
