import React from 'react'
import { createSafeContext } from './utils'
import { AuthServicesHooks } from '@/api/auth'
import { storageRead, storageWrite, storageDelete } from '@/utils/storage.utils'
import { MOCK_TOKEN, STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import noop from 'lodash/noop'
import { useNavigateRouter, useCurrentRoute } from '@/router'
import { useLoadingOverlay } from './LoadingOverlayContext'
import { useTranslation } from 'react-i18next'

const { useContext, Provider } = createSafeContext<{
  token: string | null
  clearToken: VoidFunction
}>('AuthContext', {
  token: null,
  clearToken: noop,
})

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionToken, setSessionToken] = React.useState<null | string>(
    storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')
  )

  useLoginAttempt(sessionToken, setSessionToken)

  const clearToken = React.useCallback(() => {
    storageDelete(STORAGE_KEY_SESSION_TOKEN)
    setSessionToken(null)
  }, [])

  const providerValue = React.useMemo(
    () => ({ token: sessionToken, clearToken }),
    [sessionToken, clearToken]
  )

  return <Provider value={providerValue}>{children}</Provider>
}

function useLoginAttempt(
  sessionToken: string | null,
  setSessionToken: React.Dispatch<React.SetStateAction<string | null>>
) {
  const { mutateAsync: swapTokens } = AuthServicesHooks.useSwapTokens()

  const { t } = useTranslation('common')
  const { showOverlay, hideOverlay } = useLoadingOverlay()
  const { navigate } = useNavigateRouter()
  const { route } = useCurrentRoute()

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
      hideOverlay()
    }

    asyncLoginAttempt()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

export { useContext as useAuthContext, AuthContextProvider }
