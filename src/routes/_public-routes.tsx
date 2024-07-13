import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AppLayout, AppLayoutSkeleton } from '@/components/layout/AppLayout'
import { Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-routes')({
  component: React.memo(PublicRoutesWrapper),
  pendingComponent: PublicRoutesWrapperSkeleton,
  wrapInSuspense: true,
  staticData: {
    routeKey: 'PUBLIC_ROUTES_WRAPPER',
    authLevels: ['admin', 'api', 'security', 'support'],
  },
})

function PublicRoutesWrapper() {
  return (
    <AppLayout hideSideNav>
      <Outlet />
    </AppLayout>
  )
}

function PublicRoutesWrapperSkeleton() {
  return <AppLayoutSkeleton hideSideNav />
}
