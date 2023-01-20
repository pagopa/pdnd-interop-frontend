import React from 'react'
import { AuthServicesHooks } from '@/api/auth'
import { useCurrentRoute, useNavigateRouter } from '@/router'
import { useTranslation } from 'react-i18next'
import { useLoadingOverlay } from '../LoadingOverlayContext'
import { storageDelete, storageRead, storageWrite } from '@/utils/storage.utils'
import { MOCK_TOKEN, STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'

export function useLoginAttempt() {
  const { mutateAsync: swapTokens } = AuthServicesHooks.useSwapTokens()
  const [sessionToken, setSessionToken] = React.useState<null | string>(null)

  const clearToken = React.useCallback(() => {
    storageDelete(STORAGE_KEY_SESSION_TOKEN)
    setSessionToken(null)
  }, [])

  const { t } = useTranslation('common')
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { navigate } = useNavigateRouter()
  const { route } = useCurrentRoute()
  const [error, setError] = React.useState<Error | null>(null)

  const setToken = React.useCallback(
    (token: string) => {
      storageWrite(STORAGE_KEY_SESSION_TOKEN, token, 'string')
      setSessionToken(token)
    },
    [setSessionToken]
  )

  const loginAttempt = React.useCallback(async () => {
    // 1. Check if there is a mock token: only used for dev purposes
    if (MOCK_TOKEN) {
      setToken(MOCK_TOKEN)
      return
    }

    // 2. See if we are coming from Self Care and have a new token
    const newSelfCareIdentityToken = window.location.hash.replace('#id=', '')
    if (newSelfCareIdentityToken) {
      // Remove token from hash
      history.replaceState({}, document.title, window.location.href.split('#')[0])
      const response = await swapTokens(newSelfCareIdentityToken)
      if (response.session_token) {
        setToken(response.session_token)
        return
      }
    }

    // 3. Check if there is a valid token in the storage already
    const sessionStorageToken = storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')
    if (sessionStorageToken) {
      setToken(sessionStorageToken)
      return
    }

    // 4. Check if the route is public
    if (route.PUBLIC) return

    // 5. If all else fails, logout
    navigate('LOGOUT')
  }, [navigate, route.PUBLIC, setToken, swapTokens])

  React.useEffect(() => {
    if (sessionToken) return
    async function asyncLoginAttempt() {
      showOverlay(t('loading.sessionToken.label'))
      await loginAttempt()
    }

    asyncLoginAttempt().catch(setError).finally(hideOverlay)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) throw error

  return { sessionToken, clearToken }
}
