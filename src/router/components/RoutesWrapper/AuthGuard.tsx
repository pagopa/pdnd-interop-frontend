import { AuthServicesHooks } from '@/api/auth'
import { useCheckSessionExpired } from '@/hooks/useCheckSessionExpired'
import { useJwt } from '@/hooks/useJwt'
import useCurrentRoute from '@/router/hooks/useCurrentRoute'
import { NotAuthorizedError } from '@/utils/errors.utils'
import React from 'react'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isUserAuthorized } = useCurrentRoute()
  const { data: blacklist } = AuthServicesHooks.useGetBlacklist()

  useCheckSessionExpired()
  const { jwt } = useJwt()

  const isInBlacklist = jwt?.organizationId && blacklist?.includes(jwt.organizationId)

  if (jwt && (!isUserAuthorized || isInBlacklist)) {
    throw new NotAuthorizedError()
  }

  return <>{children}</>
}
