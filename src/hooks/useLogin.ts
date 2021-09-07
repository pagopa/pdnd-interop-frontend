import { useContext, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { AxiosError, AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import { Party, RequestOutcome } from '../../types'
import { fetchAllWithLogs, fetchWithLogs, sleep } from '../lib/api-utils'
import { ROUTES } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { getFetchOutcome, isFetchError } from '../lib/error-utils'
import { testBearerToken, testUser } from '../lib/mock-static-data'
import { storageRead, storageWrite } from '../lib/storage-utils'

export const useLogin = () => {
  const history = useHistory()
  const [loadingText, setLoadingText] = useState<string | undefined>()
  const { user, setUser } = useContext(UserContext)
  const { setAvailableParties, setParty } = useContext(PartyContext)

  const setPartiesInContext = async (data: any): Promise<RequestOutcome> => {
    // Store them in a variable
    let parties: Party[] = data.institutions
    // Fetch all the partyIds (this can be optimized)
    const partyIdsResponses = await fetchAllWithLogs(
      parties.map(({ institutionId }) => ({
        path: { endpoint: 'PARTY_GET_PARTY_ID', endpointParams: { institutionId } },
        config: { method: 'GET' },
      }))
    )

    const errorResponses = (partyIdsResponses as any).filter(
      (r: AxiosResponse | AxiosError) => getFetchOutcome(r) === 'error'
    )

    // If there is any error, return the outcome
    if (errorResponses.length > 0) {
      return 'error'
    }

    // Associate each partyId to the correspondent party
    parties = parties.map((party) => {
      const currentParty = (partyIdsResponses as AxiosResponse[]).find(
        (r: AxiosResponse) => r.data.institutionId === party.institutionId
      )

      return { ...party, partyId: currentParty?.data.partyId }
    })
    // Then set them
    setAvailableParties(parties)

    return 'success'
  }

  const fetchAndSetAvailableParties = async (taxCode: string): Promise<RequestOutcome> => {
    setLoadingText('Stiamo associando la tua utenza ai tuoi enti')

    // Get all available parties related to the user
    const availablePartiesResponse = await fetchWithLogs(
      { endpoint: 'ONBOARDING_GET_AVAILABLE_PARTIES', endpointParams: { taxCode } },
      { method: 'GET' }
    )

    // If user already has institutions subscribed
    if (!isFetchError(availablePartiesResponse)) {
      // Set parties
      return await setPartiesInContext((availablePartiesResponse as AxiosResponse).data!)
    }

    return 'error'
  }

  // This happens as a result of a direct user action
  // E.g.: the user has pressed the "login" button
  const login = async () => {
    // This should not happen, here just for safety
    if (user) {
      return
    }

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
    setUser(testUser)
    storageWrite('user', testUser, 'object')
    storageWrite('bearer', testBearerToken, 'string')

    // Fetch and set the parties available for this user
    const outcome = await fetchAndSetAvailableParties(testUser.taxCode)

    if (outcome === 'success') {
      // Go to choice view
      history.push(ROUTES.CHOOSE_PARTY.PATH)
    }
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
      // Go to the login view
      history.push('/')
      // This return is necessary
      return
    }

    // Otherwise, set the user to the one stored in the storage
    setUser(sessionStorageUser)

    // Then fetch and set the parties available for this user
    const outcome = await fetchAndSetAvailableParties(sessionStorageUser.taxCode)

    if (outcome === 'success') {
      // In the end, set the user to the last known party
      setParty(sessionStorageParty)
    }
  }

  return { login, attemptSilentLogin, loadingText }
}
