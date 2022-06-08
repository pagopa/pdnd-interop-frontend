import React from 'react'
import { useHistory } from 'react-router'
import { RouteAuthLevel } from '../../types'
import { useRoute } from '../hooks/useRoute'
import { Unauthorized } from './Unauthorized'
import { useJwt } from '../hooks/useJwt'
import { intersectionWith } from 'lodash'

type AuthGuardProps = {
  Component: React.FunctionComponent
  authLevels: RouteAuthLevel
}

export function AuthGuard({ Component, authLevels }: AuthGuardProps) {
  const history = useHistory()
  const { currentRoles } = useJwt()
  const { isRouteProtected } = useRoute()

  const isCurrentRouteProtected = isRouteProtected(history.location)
  const hasOverlappingRole = intersectionWith(currentRoles, authLevels)
  const userCanAccess = !isCurrentRouteProtected || authLevels === 'any' || hasOverlappingRole

  // If the route can be accessed, display the component
  if (userCanAccess) {
    return <Component />
  }

  // If we identified the user and he/she should not access this resource,
  // show an unauthorized feedback
  return <Unauthorized />
}
