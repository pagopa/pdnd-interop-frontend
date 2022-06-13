import { useContext, useEffect } from 'react'
import { STORAGE_KEY_SESSION_TOKEN } from '../lib/constants'
import { TokenContext } from '../lib/context'
import { goToLoginPage } from '../lib/router-utils'
import { storageDelete } from '../lib/storage-utils'

export function Logout() {
  const { setToken } = useContext(TokenContext)

  useEffect(() => {
    // clean up token
    setToken(null)
    // delete everything from the storage
    storageDelete(STORAGE_KEY_SESSION_TOKEN)
    goToLoginPage()
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  return null
}
