import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { useLocation } from 'react-router-dom'
import { SHOW_DEV_LABELS } from '../lib/constants'
import { UserContext } from '../lib/context'
import { StyledBreadcrumbs } from './Shared/StyledBreadcrumbs'
import { isInPlatform } from '../lib/router-utils'
import { ROUTES } from '../config/routes'
import { ProtectedSubroutes } from './ProtectedSubroutes'

export function Main() {
  const { user } = useContext(UserContext)
  const location = useLocation()

  return (
    <Box
      component="main"
      sx={{ pt: 1.5, pb: 4 }}
      className={!SHOW_DEV_LABELS ? ' hideDevLabels' : ''}
    >
      {isInPlatform(location) && <StyledBreadcrumbs />}

      <ProtectedSubroutes
        subroutes={ROUTES}
        redirectSrcRoute={{ PATH: '/', EXACT: true }}
        redirectDestRoute={{ PATH: user !== null ? ROUTES.SUBSCRIBE.PATH : ROUTES.LOGIN.PATH }}
      />
    </Box>
  )
}
