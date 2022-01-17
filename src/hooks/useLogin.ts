import { storageDelete, storageRead, storageWrite } from '../lib/storage-utils'
import { STORAGE_KEY_TOKEN, USE_MOCK_SPID_USER } from '../lib/constants'
import { useContext } from 'react'
import { UserContext } from '../lib/context'
import { jwtToUser, parseJwt } from '../lib/jwt-utils'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { User } from '../../types'

export const useLogin = () => {
  const { setUser } = useContext(UserContext)

  const silentLoginAttempt = async (): Promise<boolean> => {
    if (USE_MOCK_SPID_USER) {
      storageWrite(STORAGE_KEY_TOKEN, process.env.REACT_APP_MOCK_TOKEN as string, 'string')
    }

    // Try to get the token from the sessionStorage
    const sessionStorageToken = storageRead(STORAGE_KEY_TOKEN, 'string')

    // If there is no token, the session is not authenticated, so
    if (!sessionStorageToken) {
      // Remove any partial data that might have remained, just for safety
      storageDelete(STORAGE_KEY_TOKEN)
      setUser(null)
      // Return failure (which will lead to a redirect to the login page)
      return false
    }

    // If there is a token, check if it is still valid with a call to the backend
    const jwt = parseJwt(sessionStorageToken) as Record<string, string | number | boolean>
    const uid = jwt.uid as string
    const resp = await fetchWithLogs({
      path: { endpoint: 'USER_GET', endpointParams: { id: uid } },
    })
    const isTokenValid = !isFetchError(resp)

    // If it is valid, turn it into State so that it is easier
    // to make it interact with React
    if (isTokenValid) {
      // TEMP REFACTOR: user is no longer necessary. It is enough to have the token as a global state
      setUser(jwtToUser(jwt as Record<string, string>) as unknown as User)
    }

    return isTokenValid
  }

  return { silentLoginAttempt }
}
