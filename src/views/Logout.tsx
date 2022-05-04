import { useContext, useEffect } from 'react'
import { STORAGE_KEY_SESSION_TOKEN, STORAGE_KEY_PARTY } from '../lib/constants'
import { PartyContext, TokenContext } from '../lib/context'
import { storageDelete } from '../lib/storage-utils'
import { goToLoginPage } from '../lib/router-utils'

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
    storageDelete(STORAGE_KEY_SESSION_TOKEN)
    storageDelete(STORAGE_KEY_PARTY)
    // go to login
    goToLoginPage()
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  return null
}
