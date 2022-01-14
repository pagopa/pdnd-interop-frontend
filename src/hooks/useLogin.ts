import { storageDelete, storageRead, storageWrite } from '../lib/storage-utils'
import { STORAGE_KEY_TOKEN, USE_MOCK_SPID_USER } from '../lib/constants'
import { useContext } from 'react'
import { UserContext } from '../lib/context'
import { jwtToUser, parseJwt } from '../lib/jwt-utils'
import { fetchWithLogs } from '../lib/api-utils'
import { isFetchError } from '../lib/error-utils'

const testToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImYyNmUwM2RiLWY4YjMtNDk5ZS04ZjMyLTA3MmM5M2VjZjc2MSJ9.eyJlbWFpbCI6ImNhcmxhLnJvc3NpQHRlc3QucGFnb3BhLml0IiwiZmFtaWx5X25hbWUiOiJSb3NzaSIsImZpc2NhbF9udW1iZXIiOiJJU1BYTkIzMlI4Mlk3NjZEIiwibW9iaWxlX3Bob25lIjoiMzMzMzMzMzMzIiwibmFtZSI6IkNhcmxhIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6ImZiMjgwNGQwLTllN2QtNGIwNC05MjVhLWNhNmY4MDJhNzI4MiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDIwODUxMTAsImV4cCI6MTY0MjA4ODcxMCwiaXNzIjoiU1BJRCIsImp0aSI6IjAxRlM5WUNNWlhKUkczNENGMkQ4QUc4VktFIn0.a2xrKtsl44B9YvAAr5UnQcP0bz3pZCz0mv1eYltOPmMdN3wyjAtk1V6wbuMvvr0Fgg5BOGDAEci7hF0AhxQ-dZ9-BRcLwt0xqWqpv1aUo-C2NEU_q9xZgRUeq4nG1Ok-lHI8_FuBPR8IogbmZvDlMWjesofSuU4DnxyHGILiPE6fWrQW-Y8QZ5-ZRykeCPPm1Ezj4SyWvQ5rWYK1oms6PJIFQDHZMozTed-6J7Oh5ekor9uUIAj658DPK3oCHCgQ-alSn2YNekHVgn2rUHP_WoBs8xCTmIlGx3I63-kVsiQk7Y-WDMDAnmQty_bkNWeOPqUN9DwNTXhD814dMwax4g'

export const useLogin = () => {
  const { setUser } = useContext(UserContext)

  const silentLoginAttempt = async (): Promise<boolean> => {
    if (USE_MOCK_SPID_USER) {
      storageWrite(STORAGE_KEY_TOKEN, testToken, 'string')
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
      setUser(jwtToUser(jwt as Record<string, string>))
    }

    return isTokenValid
  }

  return { silentLoginAttempt }
}
