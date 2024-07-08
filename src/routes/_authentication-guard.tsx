import React from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { jwtQueryOptions } from '@/api/auth'
import { AuthenticationError } from '@/utils/errors.utils'

export const Route = createFileRoute('/_authentication-guard')({
  component: AuthenticationGuard,
})

function AuthenticationGuard() {
  const {
    data: { jwt },
  } = useSuspenseQuery(jwtQueryOptions())

  if (!jwt) {
    throw new AuthenticationError()
  }

  return <Outlet />
}
