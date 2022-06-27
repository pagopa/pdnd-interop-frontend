import { storageRead, storageWrite } from '../lib/storage-utils'
import { MOCK_TOKEN, STORAGE_KEY_SESSION_TOKEN } from '../lib/constants'
import { useContext, useEffect } from 'react'
import { TokenContext } from '../lib/context'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'
import { useHistory } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import { useRoute } from './useRoute'
import { useJwt } from './useJwt'
import { TEMP_USER_WHITELIST_URL } from '../lib/env'
import { JwtUser } from '../../types'

export const useLogin = () => {
  const { jwt } = useJwt()
  const { setToken } = useContext(TokenContext)
  const history = useHistory()
  const { routes } = useRoute()

  const setTokenFromMock = (mockToken: string) => {
    storageWrite(STORAGE_KEY_SESSION_TOKEN, mockToken, 'string')
    setToken(mockToken)
  }

  const couldSetTokenFromSelfCareIdentityToken = async (identity_token: string) => {
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

  const couldSetTokenFromLocalStorage = async (storageToken: string) => {
    // If there is a token, check if it is still valid with a dummy call to the backend
    const resp = await fetchWithLogs({ path: { endpoint: 'AUTH_HEALTH_CHECK' } })

    // If the check request fails with a 403, go back to login page
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
    const newSelfCareIdentityToken = window.location.hash.replace('#id=', '')
    if (newSelfCareIdentityToken) {
      // Remove token from hash
      const { pathname, search } = history.location
      history.replace({ pathname, search, hash: '' })
      const success = await couldSetTokenFromSelfCareIdentityToken(newSelfCareIdentityToken)
      // If ok, no need to go on
      if (success) return
    }

    // 3. Check if there is a valid token in the storage already
    const sessionStorageToken = storageRead(STORAGE_KEY_SESSION_TOKEN, 'string')
    if (sessionStorageToken) {
      const success = await couldSetTokenFromLocalStorage(sessionStorageToken)
      // If ok, no need to go on
      if (success) return
    }

    // 4. If all else fails, logout
    history.push(routes.LOGOUT.PATH)
  }

  type BucketEntry = {
    organizationId: string
    usersId: Array<string>
  }

  const tempCheckWhitelist = async () => {
    try {
      const resp = await axios.get(TEMP_USER_WHITELIST_URL)

      console.log({ resp })

      const currentOrganizationId = (jwt as JwtUser).organization.id
      const currentUserId = (jwt as JwtUser).uid
      console.log({ currentOrganizationId, currentUserId })
      const isUserWhitelisted = Boolean(
        resp.data.find((item: BucketEntry) => {
          console.log(item)
          return (
            item.organizationId === currentOrganizationId && item.usersId.includes(currentUserId)
          )
        })
      )
      console.log({ isUserWhitelisted })

      if (!isUserWhitelisted) {
        history.push(routes.LOGOUT.PATH)
      }
    } catch (err) {
      // something went wrong, log out for safety
      history.push(routes.LOGOUT.PATH)
    }
  }

  useEffect(() => {
    if (jwt && !MOCK_TOKEN) {
      tempCheckWhitelist()
    }
  }, [jwt]) // eslint-disable-line react-hooks/exhaustive-deps

  return { loginAttempt }
}
