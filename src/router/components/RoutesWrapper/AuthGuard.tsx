import { AuthHooks } from '@/api/auth'
import { useAuthGuard } from '@/router'
import type { JwtUser, UserProductRole } from '@/types/party.types'
import { NotAuthorizedError } from '@/utils/errors.utils'
import React from 'react'

interface AuthGuardProps {
  children: React.ReactNode
  currentRoles: UserProductRole[]
  jwt?: JwtUser
}

/**
 * This component is used to check if the user is authorized to access the route.
 * If the user is not authorized, it will throw an error.
 *
 * The authorization is based on the user roles set in the JWT and the roles set in the route.
 * If the user has at least one role in common with the route, he is authorized.
 *
 * The blacklist is used to prevent access to the application for a specific organization.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, jwt, currentRoles }) => {
  const { isUserAuthorized } = useAuthGuard()
  const { data: blacklist } = AuthHooks.useGetBlacklist()

  const isInBlacklist = jwt?.organizationId && blacklist?.includes(jwt.organizationId)

  if (jwt && (!isUserAuthorized(currentRoles) || isInBlacklist)) {
    throw new NotAuthorizedError()
  }

  return <>{children}</>
}
