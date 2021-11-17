import { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import { UserContext } from '../lib/context'
import { storageDelete, storageRead, storageWrite } from '../lib/storage-utils'
import { User } from '../../types'
import { testBearerToken } from '../lib/mock-static-data'

export const useLogin = () => {
  const { setUser } = useContext(UserContext)

  const doLogin = (userData: User) => {
    // Set the user
    setUser(userData)
    // Fill the storage
    storageWrite('user', userData, 'object')
    storageWrite('bearer', testBearerToken, 'string')
  }

  // This happens when the user does a hard refresh when logged in
  // Instead of losing the user, we attempt at logging it back in
  // with the credentials stored in the sessionStorage
  // WARNING: this is not secure and will ultimately be rewritten
  // See PIN-403
  const silentLoginAttempt = async (): Promise<boolean> => {
    const sessionStorageUser = storageRead('user', 'object')

    // If there are no credentials, it is impossible to get the user, so
    if (isEmpty(sessionStorageUser)) {
      // Remove any partial data that might have remained, just for safety
      storageDelete('user')
      storageDelete('currentParty')
      storageDelete('bearer')
      // Return failure
      return false
    }

    // Otherwise, set the user to the one stored in the storage
    setUser(sessionStorageUser)

    return true
  }

  return { silentLoginAttempt, doLogin }
}
