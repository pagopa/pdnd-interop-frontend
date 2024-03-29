import { useDialog } from '@/stores'
import React from 'react'
import { useCurrentRoute } from '@/router'
import { hasSessionExpired } from '@/utils/common.utils'

/**
 * Checks for session expiration every second.
 * Must be used inside router context because it uses the 'useCurrentRoute' hook to check if the current route is public.
 * If the current route is public, the session expiration check is not performed.
 * If the session has expired, opens the 'sessionExpired' dialog that redirects to the logout page.
 */
export function useCheckSessionExpired(exp?: number) {
  const { isPublic } = useCurrentRoute()
  const { openDialog } = useDialog()

  const checkSessionExpiredInterval = React.useRef<number>()

  React.useEffect(() => {
    const checkSessionExpired = () => {
      if (isPublic) return

      if (hasSessionExpired(exp)) {
        clearInterval(checkSessionExpiredInterval.current)
        openDialog({ type: 'sessionExpired' })
      }
    }

    checkSessionExpiredInterval.current = window.setInterval(checkSessionExpired, 1000)

    return () => {
      clearInterval(checkSessionExpiredInterval.current)
    }
  }, [openDialog, isPublic, exp])
}
