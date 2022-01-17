import { useContext, useEffect } from 'react'
import { STORAGE_KEY_USER, URL_FE_LOGIN } from '../lib/constants'
import { PartyContext, TokenContext } from '../lib/context'
import { storageDelete } from '../lib/storage-utils'

export function Logout() {
  const { setParty, setAvailableParties } = useContext(PartyContext)
  const { setToken } = useContext(TokenContext)

  useEffect(() => {
    // clean up token
    setToken(null)
    // clean up parties
    setParty(null)
    setAvailableParties(null)
    // delete everything from the storage
    storageDelete(STORAGE_KEY_USER)

    // go back to homepage (which will redirect to login)
    window.location.assign(URL_FE_LOGIN)
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  return null
}
