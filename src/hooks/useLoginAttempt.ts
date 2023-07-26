import React from 'react'
import { AuthServicesHooks } from '@/api/auth'
import { useAuthGuard, useNavigate } from '@/router'
import { useTranslation } from 'react-i18next'
import { useLoadingOverlay } from '../stores/loading-overlay.store'
import { MOCK_TOKEN, STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import { TokenExchangeError } from '@/utils/errors.utils'
import { useAuth } from '@/stores'

export function useLoginAttempt() {
  const { mutate: swapTokens } = AuthServicesHooks.useSwapTokens()
  const { sessionToken, setSessionToken, setIsLoadingSessionToken } = useAuth()
  const [error, setError] = React.useState<Error | null>(null)

  const { t } = useTranslation('common')
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const navigate = useNavigate()
  const { isPublic } = useAuthGuard()

  const isAttemptingLogin = React.useRef(false)

  const loginAttempt = React.useCallback(async () => {
    // 1. Check if there is a mock token: only used for dev purposes
    if (MOCK_TOKEN) {
      setSessionToken(MOCK_TOKEN)
      return
    }

    // 2. See if we are coming from Self Care and have a new token
    const hasSelfCareIdentityToken = window.location.hash.includes('#id=')
    if (hasSelfCareIdentityToken) {
      const selfCareIdentityToken = window.location.hash.replace('#id=', '')
      // Remove token from hash
      history.replaceState({}, document.title, window.location.href.split('#')[0])
      swapTokens(selfCareIdentityToken, {
        onSuccess({ session_token }) {
          setSessionToken(session_token)
        },
      })
      return
    }

    // 3. See if we are trying to login as support operator
    // If the url has contains saml2 and jwt, we are trying to login as support operator
    const hasSupportOperatorToken =
      window.location.hash.includes('#saml2=') && window.location.hash.includes('jwt=')
    if (hasSupportOperatorToken) {
      const supportOperatorToken = window.location.hash.split('jwt=')[1]
      setSessionToken(supportOperatorToken)
      return
    }

    // 4. Check if there is a valid token in the storage already
    const sessionStorageToken = window.localStorage.getItem(STORAGE_KEY_SESSION_TOKEN)
    if (sessionStorageToken) {
      setSessionToken(sessionStorageToken)
      return
    }

    // 5. Check if the route is public
    if (isPublic) return

    // 6. If all else fails, logout
    navigate('LOGOUT')
  }, [navigate, isPublic, setSessionToken, swapTokens])

  React.useEffect(() => {
    if (sessionToken || isAttemptingLogin.current) return

    isAttemptingLogin.current = true

    async function asyncLoginAttempt() {
      showOverlay(t('loading.sessionToken.label'))
      await loginAttempt()
    }

    asyncLoginAttempt()
      .catch(setError)
      .finally(() => {
        setIsLoadingSessionToken(false)
        hideOverlay()
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) throw new TokenExchangeError()
}
