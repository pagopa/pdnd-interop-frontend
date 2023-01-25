import React from 'react'
import { AuthServicesHooks } from '@/api/auth'
import { useCurrentRoute, useNavigateRouter } from '@/router'
import { useTranslation } from 'react-i18next'
import { useLoadingOverlay } from '../stores/loading-overlay.store'
import { storageRead } from '@/utils/storage.utils'
import { MOCK_TOKEN, STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { useAuth } from '@/stores'

export function useLoginAttempt() {
  const { mutateAsync: swapTokens } = AuthServicesHooks.useSwapTokens()
  const { sessionToken, setSessionToken } = useAuth()

  const { t } = useTranslation('common')
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { navigate } = useNavigateRouter()
  const { route } = useCurrentRoute()

  const isAttemptingLogin = React.useRef(false)

  const loginAttempt = React.useCallback(async () => {
    // 1. Check if there is a mock token: only used for dev purposes
    if (MOCK_TOKEN) {
      setSessionToken(MOCK_TOKEN)
      return
    }

    // 2. See if we are coming from Self Care and have a new token
    const newSelfCareIdentityToken = window.location.hash.replace('#id=', '')
    if (newSelfCareIdentityToken) {
      // Remove token from hash
      history.replaceState({}, document.title, window.location.href.split('#')[0])
      const response = await swapTokens(newSelfCareIdentityToken)
      if (response.session_token) {
        setSessionToken(response.session_token)
        return
      }
    }

    // 3. Check if there is a valid token in the storage already
    const sessionStorageToken = storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')
    if (sessionStorageToken) {
      setSessionToken(sessionStorageToken)
      return
    }

    // 4. Check if the route is public
    if (route.PUBLIC) return

    // 5. If all else fails, logout
    navigate('LOGOUT')
  }, [navigate, route.PUBLIC, setSessionToken, swapTokens])

  React.useEffect(() => {
    if (sessionToken || isAttemptingLogin.current) return

    isAttemptingLogin.current = true

    async function asyncLoginAttempt() {
      showOverlay(t('loading.sessionToken.label'))
      await loginAttempt()
      hideOverlay()
    }

    asyncLoginAttempt()
  }, [sessionToken, showOverlay, t, hideOverlay, loginAttempt])
}
