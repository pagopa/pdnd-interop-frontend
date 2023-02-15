import { useDialog } from '@/stores'
import React from 'react'
import { useJwt } from './useJwt'

/**
 * Checks for session expiration.
 * If the session has expired, opens the 'sessionExpired' dialog that redirects to the logout page.
 */
export function useCheckSessionExpired() {
  const { hasSessionExpired } = useJwt()
  const { openDialog } = useDialog()

  React.useEffect(() => {
    hasSessionExpired() && openDialog({ type: 'sessionExpired' })
  }, [openDialog, hasSessionExpired])
}
