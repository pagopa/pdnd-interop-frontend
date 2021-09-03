import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { Row, Button } from 'react-bootstrap'
import spidIcon from '../assets/icons/spid.svg'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { fetchAllWithLogs, fetchWithLogs } from '../lib/api-utils'
import { WhiteBackground } from '../components/WhiteBackground'
import { StyledInputCheckbox } from '../components/StyledInputCheckbox'
import { StyledInputTextArea } from '../components/StyledInputTextArea'
import { testUser } from '../lib/mock-static-data'
import { Party } from '../../types'
import { AxiosResponse } from 'axios'
import { isFetchError } from '../lib/error-utils'

const informativa =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed ipsum risus. Donec justo nunc, volutpat nec elementum sed, consectetur in mauris. Donec vulputate, purus a volutpat interdum, tellus libero condimentum velit, eget placerat risus ipsum laoreet sapien. Maecenas justo libero, congue eget venenatis sed, vehicula eu enim. Mauris nec dictum nunc. Vivamus blandit maximus ipsum, venenatis pulvinar lorem sagittis in. Duis luctus orci eget euismod mattis. Maecenas orci justo, '

export function Login() {
  const { user, setUser } = useContext(UserContext)
  const { setAvailableParties } = useContext(PartyContext)
  const [privacy, setPrivacy] = useState(false)
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const setParties = async (data: any) => {
    // Store them in a variable
    let parties: Party[] = data.institutions
    // Fetch all the partyIds (this can be optimized)
    const partyIdsResponse = await fetchAllWithLogs(
      parties.map(({ institutionId }) => ({
        path: { endpoint: 'PARTY_GET_PARTY_ID', endpointParams: { institutionId } },
        config: { method: 'GET' },
      }))
    )
    // Associate each partyId to the correspondent party
    parties = parties.map((party) => {
      const currentParty = partyIdsResponse.find(
        (r: AxiosResponse) => r.data.institutionId === party.institutionId
      )

      return { ...party, partyId: currentParty?.data.partyId }
    })
    // Then set them
    setAvailableParties(parties)
  }

  const login = async () => {
    if (!user) {
      // Display the loader
      setLoading(true)

      // Get the user from SPID or CIE
      // This part is missing in the backend for now,
      // So get a mock user
      const { taxCode } = testUser

      // Associate the user taxCode to a platform user
      // Also this is missing for now
      // const whoAmIResponse = await fetchWithLogs(
      //   { endpoint: 'USER_GET_SINGLE', endpointParams: { taxCode } },
      //   { method: 'GET' }
      // )
      // setUser(whoAmIResponse.data)
      setUser(testUser)

      // Get all available parties related to the user
      const availablePartiesResponse = await fetchWithLogs(
        { endpoint: 'ONBOARDING_GET_AVAILABLE_PARTIES', endpointParams: { taxCode } },
        { method: 'GET' }
      )

      // If user already has institutions subscribed
      if (!isFetchError(availablePartiesResponse)) {
        // Set parties
        await setParties(availablePartiesResponse.data!)
      }

      // Stop loading (irrelevant, because there is a route change, here for consistency)
      setLoading(false)

      // Go to choice view
      history.push(ROUTES.CHOOSE_PARTY.PATH)
    }
  }

  const updatePrivacy = () => {
    setPrivacy(!privacy)
  }

  return (
    <React.Fragment>
      <WhiteBackground containerStyles={{ maxWidth: 480 }} verticallyCentered={true}>
        <Row>
          <h2 className="text-center">Effettua il login</h2>
        </Row>
        <Row className="my-5">
          <StyledInputTextArea readOnly={true} value={informativa} />

          <StyledInputCheckbox
            onChange={updatePrivacy}
            checked={privacy}
            id="my-checkbox"
            label="Accetto l'informativa"
            inline={true}
          />
        </Row>
        <Row className="mx-4">
          <Button className="mb-2" variant="primary" onClick={login} disabled={!privacy}>
            <i>
              <img src={spidIcon} alt="Icona di SPID" />
            </i>{' '}
            <span className="ms-2">Entra con SPID</span>
          </Button>
          <Button variant="primary" disabled>
            Entra con CIE
          </Button>
        </Row>
      </WhiteBackground>

      {loading && <LoadingOverlay loadingText="Stiamo associando la tua utenza ai tuoi enti" />}
    </React.Fragment>
  )
}
