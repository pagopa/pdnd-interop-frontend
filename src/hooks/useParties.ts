import { AxiosResponse } from 'axios'
import { useContext } from 'react'
import { Party, PartyAttribute } from '../../types'
import { fetchAllWithLogs, fetchWithLogs } from '../lib/api-utils'
import { STORAGE_KEY_PARTY } from '../lib/constants'
import { LoaderContext, PartyContext } from '../lib/context'
import { storageRead } from '../lib/storage-utils'
import { useJwt } from './useJwt'

type FetchedParty = Party & {
  attributes: Array<PartyAttribute>
}

export const useParties = () => {
  const { setLoadingText } = useContext(LoaderContext)
  const { setAvailableParties, setParty } = useContext(PartyContext)
  const { token } = useJwt()

  const getDecoratedInstitutions = async (
    institutions: Array<FetchedParty>
  ): Promise<Array<Party>> => {
    return await Promise.all(
      institutions.map(async (institution) => {
        const attributes = await getCertifiedAttributes(institution.attributes)
        return { ...institution, attributes }
      })
    )
  }

  const getCertifiedAttributes = async (data: Array<PartyAttribute>) => {
    // Store them in a variable
    // let parties = [...data]

    // Fetch all the partyIds (this can be optimized)
    const attributesResp = await fetchAllWithLogs(
      data.map(({ origin, code }) => ({
        path: { endpoint: 'ATTRIBUTE_GET_SINGLE', endpointParams: { origin, code } },
      }))
    )

    return attributesResp.map((r) => (r as AxiosResponse).data)
  }

  const fetchAndSetAvailableParties = async () => {
    setLoadingText('Stiamo associando la tua utenza ai tuoi enti')

    // Get all available parties related to the user
    const availablePartiesResponse = await fetchWithLogs({
      path: { endpoint: 'ONBOARDING_GET_AVAILABLE_PARTIES' },
    })

    // TEMP REFACTOR: handle actual error, such as invalid token. Make it global

    const { data } = availablePartiesResponse as AxiosResponse
    const institutions = data.institutions as Array<FetchedParty>
    // Get the missing properties of the attributes
    const decoratedInstitutions = await getDecoratedInstitutions(institutions)
    // Set the decorated parties
    setAvailableParties(decoratedInstitutions)

    // Stop the loader
    setLoadingText(null)

    return decoratedInstitutions
  }

  const fetchAvailablePartiesAttempt = async () => {
    if (token) {
      return await fetchAndSetAvailableParties()
    }

    return null
  }

  const setPartyFromStorageAttempt = (fetchedParties: Array<Party> | null) => {
    const sessionStorageParty = storageRead(STORAGE_KEY_PARTY, 'object')

    if (sessionStorageParty && fetchedParties) {
      const currentFetchedParty = fetchedParties.find((p) => p.id === sessionStorageParty.id)

      // Is same user with same privileges
      if (
        currentFetchedParty &&
        currentFetchedParty.role === sessionStorageParty.role &&
        currentFetchedParty.productInfo.role === sessionStorageParty.productInfo.role
      ) {
        setParty(sessionStorageParty)
        return true
      }
    }

    return false
  }

  return { fetchAvailablePartiesAttempt, setPartyFromStorageAttempt }
}
