import React, { useContext } from 'react'
import { Box } from '@mui/system'
import { ROUTES, SHOW_DEV_LABELS } from '../lib/constants'
import { UserContext } from '../lib/context'
import { ProtectedSubroutes } from './ProtectedSubroutes'

export function Main() {
  const { user } = useContext(UserContext)

  return (
    <Box component="main" sx={{ pb: 4 }} className={!SHOW_DEV_LABELS ? ' hideDevLabels' : ''}>
      <ProtectedSubroutes
        parentPath="/"
        subroutes={Object.values(ROUTES)}
        rootRedirect={user !== null ? '/fruizione' : '/login'}
      />
    </Box>
  )
}
