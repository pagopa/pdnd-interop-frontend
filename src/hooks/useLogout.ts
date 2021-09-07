import { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../lib/context'
import { storageDelete } from '../lib/storage-utils'

export const useLogout = () => {
  const { setUser } = useContext(UserContext)
  const history = useHistory()

  useEffect(() => {
    // clean up user
    setUser(null)
    // delete everything from the storage
    storageDelete('user')
    storageDelete('bearer')
    storageDelete('currentParty')

    // go back to homepage (which will redirect to login)
    history.push('/')
  }, []) //eslint-disable-line react-hooks/exhaustive-deps
}
