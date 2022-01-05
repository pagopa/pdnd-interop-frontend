import isEmpty from 'lodash/isEmpty'
import { storageDelete, storageRead, storageWrite } from '../lib/storage-utils'
import { STORAGE_KEY_TOKEN, USE_MOCK_SPID_USER } from '../lib/constants'
import { useContext } from 'react'
import { UserContext } from '../lib/context'
import { jwtToUser, parseJwt } from '../lib/jwt-utils'

const testToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImYyNmUwM2RiLWY4YjMtNDk5ZS04ZjMyLTA3MmM5M2VjZjc2MSJ9.eyJlbWFpbCI6ImNhcmxhLnJvc3NpQHRlc3QucGFnb3BhLml0IiwiZmFtaWx5X25hbWUiOiJSb3NzaSIsImZpc2NhbF9udW1iZXIiOiJJU1BYTkIzMlI4Mlk3NjZEIiwibW9iaWxlX3Bob25lIjoiMzMzMzMzMzMzIiwibmFtZSI6IkNhcmxhIiwiZnJvbV9hYSI6ZmFsc2UsInVpZCI6ImZiMjgwNGQwLTllN2QtNGIwNC05MjVhLWNhNmY4MDJhNzI4MiIsImxldmVsIjoiTDIiLCJpYXQiOjE2NDEyMjUwNzMsImV4cCI6MTY0MTIyODY3MywiaXNzIjoiU1BJRCIsImp0aSI6IjAxRlJHQTZDSkpXSjRFWTg4RjJQOEFRWE1aIn0.I2WXyq1Fdm7qEeSBbGcVtzypmQwpEostG94C4qjuZTqWR_jLDKKFHYKySk2Vi8F9wuCoEQGUX6-vELqah3pDL8R_Uf4aHTWUg5xKMlV8Ee90fKFGpb2ENzC6ZTt2UAmbQzarVabDTl8aQL_ExSabD5qLm65QvKsIuLMxnN-eGNOs9Ra9OfayobqHecKjGlyovNKFdUqcMlaHsQwM4X1g26SoeG87hd8Njelo_qBePEzJjdq2BdMzOGBJzJ_nPAjiZU5xkdcjDEmYrUGJKgvyxqrwpAwWA-WGaDXdulWueEb069-KMydgo3X4L9ENZVPTVDRl5We_wdb4flOfA8jLCQ'

export const useLogin = () => {
  const { setUser } = useContext(UserContext)

  const silentLoginAttempt = (): boolean => {
    if (USE_MOCK_SPID_USER) {
      storageWrite(STORAGE_KEY_TOKEN, testToken, 'string')

      const jwt = parseJwt(testToken)
      setUser(jwtToUser(jwt as Record<string, string>))
      return true
    }

    const sessionStorageToken = storageRead(STORAGE_KEY_TOKEN, 'string')

    // If there are no token, it is impossible to get the user, so
    if (isEmpty(sessionStorageToken)) {
      // Remove any partial data that might have remained, just for safety
      storageDelete(STORAGE_KEY_TOKEN)
      setUser(null)
      // Return failure
      return false
    }

    // TODO: check that the token is still valid with a call to the backend
    const isTokenValid = true
    // Then, return the result
    return isTokenValid
  }

  return { silentLoginAttempt }
}
