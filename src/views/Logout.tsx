import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PartyContext, UserContext } from '../lib/context'
import { storageDelete } from '../lib/storage-utils'

export function Logout() {
  const { setParty, setAvailableParties } = useContext(PartyContext)
  const { setUser } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    // clean up user
    setUser(null)
    // clean up parties
    setParty(null)
    setAvailableParties([])
    // delete everything from the storage
    storageDelete('user')
    storageDelete('bearer')
    storageDelete('currentParty')

    // go back to homepage (which will redirect to login)
    navigate('/')
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  return null
}
