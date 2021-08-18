import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTES, testUser } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'
import { Container, Row, Button, Form, FormControl } from 'react-bootstrap'
import spidIcon from '../assets/icon-spid.svg'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { fetchWithLogs } from '../lib/api-utils'

const informativa =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed ipsum risus. Donec justo nunc, volutpat nec elementum sed, consectetur in mauris. Donec vulputate, purus a volutpat interdum, tellus libero condimentum velit, eget placerat risus ipsum laoreet sapien. Maecenas justo libero, congue eget venenatis sed, vehicula eu enim. Mauris nec dictum nunc. Vivamus blandit maximus ipsum, venenatis pulvinar lorem sagittis in. Duis luctus orci eget euismod mattis. Maecenas orci justo, '

export function Login() {
  const { user, setUser } = useContext(UserContext)
  const { setAvailableParties } = useContext(PartyContext)
  const [privacy, setPrivacy] = useState(false)
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!user) {
      setLoading(true)
      // get the user
      // This part is missing in the backend
      // set the user
      setUser(testUser)
      // get all available parties related to the user
      const availableParties = await fetchWithLogs('ONBOARDING_GET_AVAILABLE_PARTIES', {
        method: 'GET',
        params: { taxCode: testUser.cf },
      })
      // then set them
      setAvailableParties(availableParties!.data.institutions)
      // go to choice view
      history.push(ROUTES.CHOOSE_PARTY.PATH)
    }
  }

  const updatePrivacy = () => {
    setPrivacy(!privacy)
  }

  return (
    <LoadingOverlay isLoading={loading} loadingText="Stiamo associando la tua utenza ai tuoi enti">
      <div className="my-4 px-4 py-4 bg-white">
        <Container style={{ maxWidth: 480 }}>
          <Row>
            <h2 className="text-center">Effettua il login</h2>
          </Row>
          <Row className="mb-4">
            <FormControl
              style={{ height: 120 }}
              value={informativa}
              as="textarea"
              aria-label="With textarea"
              readOnly
              plaintext
            />

            <Form.Check
              className="mt-2"
              onChange={updatePrivacy}
              checked={privacy}
              type="checkbox"
              id="my-checkbox"
              label="Accetto l'informativa"
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
        </Container>
      </div>
    </LoadingOverlay>
  )
}
