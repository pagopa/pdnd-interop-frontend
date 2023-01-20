import React from 'react'
import { createSafeContext } from '../utils'
import noop from 'lodash/noop'
import { useLoginAttempt } from './useLoginAttempt'
import AuthErrorBoundary from './AuthErrorBoundary'

const { useContext, Provider } = createSafeContext<{
  token: string | null
  clearToken: VoidFunction
}>('AuthContext', {
  token: null,
  clearToken: noop,
})

const _AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sessionToken, clearToken } = useLoginAttempt()

  const providerValue = React.useMemo(
    () => ({ token: sessionToken, clearToken }),
    [sessionToken, clearToken]
  )

  return <Provider value={providerValue}>{children}</Provider>
}

const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthErrorBoundary>
      <_AuthContextProvider>{children}</_AuthContextProvider>
    </AuthErrorBoundary>
  )
}

export { useContext as useAuthContext, AuthContextProvider }
