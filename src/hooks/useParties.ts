import { AxiosResponse } from 'axios'
import { useContext } from 'react'
import { Party } from '../../types'
import { fetchAllWithLogs, fetchWithLogs } from '../lib/api-utils'
import { LoaderContext, PartyContext } from '../lib/context'
import { isFetchError } from '../lib/error-utils'
import { storageRead } from '../lib/storage-utils'

export const useParties = () => {
  const { setLoadingText } = useContext(LoaderContext)
  const { setAvailableParties, setParty } = useContext(PartyContext)

  const setPartiesInContext = async (data: Array<Party>) => {
    // Store them in a variable
    let parties = [...data]
    // Fetch all the partyIds (this can be optimized)
    const partyIdsResponses = await fetchAllWithLogs(
      parties.map(({ institutionId }) => ({
        path: { endpoint: 'PARTY_GET_PARTY_ID', endpointParams: { institutionId } },
      }))
    )

    // Associate each partyId to the correspondent party, along with its attributes
    parties = parties.map((party) => {
      const currentParty = (partyIdsResponses as Array<AxiosResponse>).find(
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

  const fetchAndSetAvailableParties = async () => {
    setLoadingText('Stiamo associando la tua utenza ai tuoi enti')

    // Get all available parties related to the user
    const availablePartiesResponse = await fetchWithLogs({
      path: { endpoint: 'ONBOARDING_GET_AVAILABLE_PARTIES' },
    })

    const hasInstitutions = !isFetchError(availablePartiesResponse)

    // If user already has institutions subscribed
    if (hasInstitutions) {
      // Set parties
      const { data } = availablePartiesResponse as AxiosResponse
      await setPartiesInContext(data.institutions)
    } else {
      // Otherwise, mark that there are no parties available
      setAvailableParties([])
    }

    // Stop the loader
    setLoadingText(null)

    // Return the outcome (true for ok, false for ko)
    return hasInstitutions
  }

  const fetchAvailablePartiesAttempt = async () => {
    const sessionStorageUser = storageRead('user', 'object')
    if (sessionStorageUser && sessionStorageUser.id) {
      const hasFetchedAndSetAvailableParties = await fetchAndSetAvailableParties()
      return hasFetchedAndSetAvailableParties
    }

    return false
  }

  const setPartyFromStorageAttempt = () => {
    const sessionStorageParty = storageRead('currentParty', 'object')
    if (sessionStorageParty) {
      setParty(sessionStorageParty)
      return true
    }

    return false
  }

  return { fetchAvailablePartiesAttempt, setPartyFromStorageAttempt }
}
