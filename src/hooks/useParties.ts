import { AxiosResponse } from 'axios'
import { useContext } from 'react'
import { Party } from '../../types'
import { fetchAllWithLogs, fetchWithLogs } from '../lib/api-utils'
import { LoaderContext, PartyContext, TokenContext } from '../lib/context'
import { storageRead } from '../lib/storage-utils'

export const useParties = () => {
  const { setLoadingText } = useContext(LoaderContext)
  const { setAvailableParties, setParty } = useContext(PartyContext)
  const { token } = useContext(TokenContext)

  const setPartiesInContext = async (data: Array<Party>) => {
    // Store them in a variable
    let parties = [...data]

    // Fetch all the partyIds (this can be optimized)
    const partyIdsResponses = await fetchAllWithLogs(
      parties.map(({ institutionId }) => ({
        path: { endpoint: 'PARTY_GET_PARTY_ID', endpointParams: { id: institutionId } },
      }))
    )

    // Associate each partyId to the correspondent party, along with its attributes
    parties = parties.map((party) => {
      const currentParty = (partyIdsResponses as Array<AxiosResponse>).find(
        (r: AxiosResponse) => r.data.institutionId === party.institutionId
      )

      return {
        ...party,
        partyId: currentParty?.data.id,
        attributes: currentParty?.data.attributes,
      }
    })

    // Then set them
    setAvailableParties(parties)
  }

  const fetchAndSetAvailableParties = async () => {
    setLoadingText('Stiamo associando la tua utenza ai tuoi enti')

    // // Get all available parties related to the user
    const availablePartiesResponse = await fetchWithLogs({
      path: { endpoint: 'ONBOARDING_GET_AVAILABLE_PARTIES' },
    })

    // TODO: handle actual error, such as invalid token. Make it global

    const { data } = availablePartiesResponse as AxiosResponse
    await setPartiesInContext(data.institutions)

    // Stop the loader
    setLoadingText(null)

    return true
  }

  const fetchAvailablePartiesAttempt = async () => {
    if (token) {
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
