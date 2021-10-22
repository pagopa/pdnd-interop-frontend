import React from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { includesAny } from '../lib/string-utils'
import { MainHeader } from './MainHeader'
import { PlatformHeader } from './PlatformHeader'
import { StyledContainer } from './Shared/StyledContainer'
import { StyledRow } from './Shared/StyledRow'

export function Header() {
  const location = useLocation()
  const isInPlatform = includesAny(location.pathname, [
    ROUTES.PROVIDE.PATH,
    ROUTES.SUBSCRIBE.PATH,
    ROUTES.PROFILE.PATH,
    ROUTES.NOTIFICATION.PATH,
  ])

  return (
    <header>
      <MainHeader />
      <div className="bg-white">
        <StyledContainer>
          <StyledRow>
            <h1 className="bg-white py-4">Portale interoperabilità</h1>
          </StyledRow>
        </StyledContainer>
      </div>
      {isInPlatform && <PlatformHeader />}
    </header>
  )
}
