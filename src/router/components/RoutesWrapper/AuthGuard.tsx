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
  useCheckSessionExpired()
  const { jwt } = useJwt()

  if (jwt && !isUserAuthorized) {
    throw new NotAuthorizedError()
  }

  return <>{children}</>
}
