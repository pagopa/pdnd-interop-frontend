import { storageRead, storageWrite } from '../lib/storage-utils'
import { MOCK_TOKEN, STORAGE_KEY_SESSION_TOKEN } from '../lib/constants'
import { useContext } from 'react'
import { TokenContext } from '../lib/context'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { useHistory } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { useRoute } from './useRoute'

export const useLogin = () => {
  const { setToken } = useContext(TokenContext)
  const history = useHistory()
  const { routes } = useRoute()

  const setTokenFromMock = (mockToken: string) => {
    storageWrite(STORAGE_KEY_SESSION_TOKEN, mockToken, 'string')
    setToken(mockToken)
  }

  const canSetTokenFromSelfCareIdentityToken = async (identity_token: string) => {
    // Use Self Care identity token to obtain an Interop session token
    const resp = await fetchWithLogs({
      path: { endpoint: 'AUTH_OBTAIN_SESSION_TOKEN' },
      config: { data: { identity_token } },
    })

    // If there is an error in fetching the token, go back to login page
    if (isFetchError(resp)) {
      return false
    }

    // Set Interop session token
    const sessionToken = (resp as AxiosResponse).data.session_token
    storageWrite(STORAGE_KEY_SESSION_TOKEN, sessionToken, 'string')
    setToken(sessionToken)
    return true
  }

  const canSetTokenFromLocalStorage = async (storageToken: string) => {
    // If there is a token, check if it is still valid with a dummy call to the backend
    const resp = await fetchWithLogs({ path: { endpoint: 'AUTH_HEALTH_CHECK' } })

    // If it is valid, turn it into State so that it is easier
    // to make it interact with React
    if (isFetchError(resp)) {
      return false
    }

    setToken(storageToken)
    return true
  }

  const loginAttempt = async () => {
    // 1. Check if there is a mock token: only used for dev purposes
    if (MOCK_TOKEN) {
      setTokenFromMock(MOCK_TOKEN)
      return
    }

    // 2. See if we are coming from Self Care and have a new token
    const newSelfCareIdentityToken = location.hash.replace('#id=', '')
    if (newSelfCareIdentityToken) {
      const success = await canSetTokenFromSelfCareIdentityToken(newSelfCareIdentityToken)
      if (success) return
    }

    // 3. Check if there is a valid token in the storage already
    const sessionStorageToken = storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')
    if (sessionStorageToken) {
      const success = await canSetTokenFromLocalStorage(sessionStorageToken)
      if (success) return
    }

    // 4. If all else fails, logout
    history.push(routes.LOGOUT.PATH)
  }

  return { loginAttempt }
}
