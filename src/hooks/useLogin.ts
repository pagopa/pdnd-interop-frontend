import { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import { UserContext } from '../lib/context'
import { storageDelete, storageRead, storageWrite } from '../lib/storage-utils'
import { User, UserOnCreate } from '../../types'
import { useFeedback } from './useFeedback'
import { AxiosResponse } from 'axios'

export const useLogin = () => {
  const { setUser } = useContext(UserContext)
  const { runAction } = useFeedback()

  const getStoredUser = async (externalId: string) => {
    return await runAction(
      {
        path: { endpoint: 'ONBOARDING_GET_USER' },
        config: { data: { externalId } },
      },
      { suppressToast: false }
    )
  }

  const registerNewUser = async (userData: UserOnCreate) => {
    return await runAction(
      {
        path: { endpoint: 'ONBOARDING_CREATE_USER' },
        config: { data: userData },
      },
      { suppressToast: false }
    )
  }

  const doLogin = async (userDataOnCreate: UserOnCreate) => {
    const { outcome, response } = await getStoredUser(userDataOnCreate.externalId)

    // If user already exists, save data and proceed
    if (outcome === 'success') {
      const userData = (response as AxiosResponse).data as User
      setUser(userData)
      storageWrite('user', userData, 'object')
      return true
    }

    // If user was not registered, do it now
    else if (outcome === 'error') {
      const { outcome: createOutcome, response: createResponse } = await registerNewUser(
        userDataOnCreate
      )

      // If user was registered correctly, save data and proceed
      if (createOutcome === 'success') {
        const userData = (createResponse as AxiosResponse).data as User
        setUser(userData)
        storageWrite('user', userData, 'object')
        return true
      }
    }

    return false
  }

  // This happens when the user does a hard refresh when logged in
  // Instead of losing the user, we attempt at logging it back in
  // with the credentials stored in the sessionStorage
  // WARNING: this is not secure and will ultimately be rewritten
  // See PIN-403
  const silentLoginAttempt = (): boolean => {
    const sessionStorageUser = storageRead('user', 'object')

    // If there are no credentials, it is impossible to get the user, so
    if (isEmpty(sessionStorageUser)) {
      // Remove any partial data that might have remained, just for safety
      storageDelete('user')
      storageDelete('currentParty')
      // Return failure
      return false
    }

    // Otherwise, set the user to the one stored in the storage
    setUser(sessionStorageUser)

    return true
  }

  return { silentLoginAttempt, doLogin }
}
