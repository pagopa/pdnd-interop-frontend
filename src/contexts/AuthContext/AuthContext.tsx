import React from 'react'
import { createSafeContext } from '../utils'
import { storageDelete } from '@/utils/storage.utils'
import { STORAGE_KEY_SESSION_TOKEN } from '@/config/constants'
import noop from 'lodash/noop'
import { useLoginAttempt } from './useLoginAttempt'

const { useContext, Provider } = createSafeContext<{
  token: string | null
  clearToken: VoidFunction
}>('AuthContext', {
  token: null,
  clearToken: noop,
})

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionToken, setSessionToken] = React.useState<null | string>(null)

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

export { useContext as useAuthContext, AuthContextProvider }
