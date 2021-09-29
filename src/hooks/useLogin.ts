import { useContext, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import { Party, User } from '../../types'
import { fetchAllWithLogs, fetchWithLogs, sleep } from '../lib/api-utils'
import { ROUTES, USE_SPID_USER_LORENZO_CARMILLI } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { isFetchError } from '../lib/error-utils'
import { mockSPIDUserLorenzoCarmilli, testBearerToken } from '../lib/mock-static-data'
import { storageDelete, storageRead, storageWrite } from '../lib/storage-utils'

export const useLogin = () => {
  const history = useHistory()
  const [loadingText, setLoadingText] = useState<string | undefined>()
  const { user, setUser } = useContext(UserContext)
  const { setAvailableParties, setParty } = useContext(PartyContext)

  const setPartiesInContext = async (data: any) => {
    // Store them in a variable
    let parties: Party[] = data.institutions
    // Fetch all the partyIds (this can be optimized)
    const partyIdsResponses = await fetchAllWithLogs(
      parties.map(({ institutionId }) => ({
        path: { endpoint: 'PARTY_GET_PARTY_ID', endpointParams: { institutionId } },
        config: { method: 'GET' },
      }))
    )

    // Associate each partyId to the correspondent party, along with its attributes
    parties = parties.map((party) => {
      const currentParty = (partyIdsResponses as AxiosResponse[]).find(
        (r: AxiosResponse) => r.data.institutionId === party.institutionId
      )

      return {
        ...party,
        partyId: currentParty?.data.partyId,
        attributes: currentParty?.data.attributes,
      }
    })

    // Then set them
    setAvailableParties(parties)
  }

  const fetchAndSetAvailableParties = async (taxCode: string) => {
    setLoadingText('Stiamo associando la tua utenza ai tuoi enti')

    // Get all available parties related to the user
    const availablePartiesResponse = await fetchWithLogs(
      { endpoint: 'ONBOARDING_GET_AVAILABLE_PARTIES', endpointParams: { taxCode } },
      { method: 'GET' }
    )

    // If user already has institutions subscribed
    if (!isFetchError(availablePartiesResponse)) {
      // Set parties
      await setPartiesInContext((availablePartiesResponse as AxiosResponse).data!)
    }
  }

  // This happens as a result of a direct user action
  // E.g.: the user has pressed the "login" button
  const login = async () => {
    // This should not happen, here just for safety
    if (user) {
      return
    }

    if (USE_SPID_USER_LORENZO_CARMILLI) {
      await setTestSPIDUser(mockSPIDUserLorenzoCarmilli)
    } else {
      history.push(ROUTES.TEMP_SPID_USER.PATH)
    }
  }

  const setTestSPIDUser = async (testUserData: User) => {
    // Display the loader
    setLoadingText('Stiamo provando ad autenticarti')

    // Mock request/response roundtrip for now, as we don't
    // have any actual login. See PIN-315.
    await sleep(750)

    // Associate the user taxCode to a platform user
    // Also this is missing for now.
    // Ideally, this is done on the backend
    // const whoAmIResponse = await fetchWithLogs(
    //   { endpoint: 'USER_GET_SINGLE', endpointParams: { taxCode } },
    //   { method: 'GET' }
    // )
    // setUser(whoAmIResponse.data)

    // Set the user and fill the storage
    setUser(testUserData)
    storageWrite('user', testUserData, 'object')
    storageWrite('bearer', testBearerToken, 'string')

    // Fetch and set the parties available for this user
    await fetchAndSetAvailableParties(testUserData.taxCode)

    // Go to choice view
    history.push(ROUTES.CHOOSE_PARTY.PATH)
  }

  // This happens when the user does a hard refresh when logged in
  // Instead of losing the user, we attempt at logging it back in
  // with the credentials stored in the sessionStorage
  // WARNING: this is not secure and will ultimately be rewritten
  // See PIN-403
  const attemptSilentLogin = async () => {
    const sessionStorageUser = storageRead('user', 'object')
    const sessionStorageParty = storageRead('currentParty', 'object')
    const sessionStorageBearerToken = storageRead('bearer', 'string')

    // If there are no credentials, it is impossible to get the user, so
    if (isEmpty(sessionStorageUser) || isEmpty(sessionStorageParty) || !sessionStorageBearerToken) {
      // Remove any partial data that might have remained, just for safety
      storageDelete('user')
      storageDelete('currentParty')
      storageDelete('bearer')
      // Go to the login view
      history.push('/')
      // This return is necessary
      return
    }

    // Otherwise, set the user to the one stored in the storage
    setUser(sessionStorageUser)

    // Then fetch and set the parties available for this user
    await fetchAndSetAvailableParties(sessionStorageUser.taxCode)

    // In the end, set the user to the last known party
    setParty(sessionStorageParty)
  }

  return { login, attemptSilentLogin, loadingText, setTestSPIDUser }
}
