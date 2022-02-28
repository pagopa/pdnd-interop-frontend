import { AxiosResponse } from 'axios'
import { useContext } from 'react'
import { Party, PartyAttribute } from '../../types'
import { fetchAllWithLogs, fetchWithLogs } from '../lib/api-utils'
import { LoaderContext, PartyContext, TokenContext } from '../lib/context'
import { storageRead } from '../lib/storage-utils'

type FetchedParty = Party & {
  attributes: Array<PartyAttribute>
}

export const useParties = () => {
  const { setLoadingText } = useContext(LoaderContext)
  const { setAvailableParties, setParty } = useContext(PartyContext)
  const { token } = useContext(TokenContext)

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

    // TODO: handle actual error, such as invalid token. Make it global

    const { data } = availablePartiesResponse as AxiosResponse
    const institutions = data.institutions as Array<FetchedParty>
    // Get the missing properties of the attributes
    const decoratedInstitutions = await getDecoratedInstitutions(institutions)
    // Set the decorated parties
    setAvailableParties(decoratedInstitutions)

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
