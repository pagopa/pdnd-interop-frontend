import React, { useState } from 'react'
import { Row, Button } from 'react-bootstrap'
import spidIcon from '../assets/icons/spid.svg'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { WhiteBackground } from '../components/WhiteBackground'
import { StyledInputCheckbox } from '../components/StyledInputCheckbox'
import { StyledInputTextArea } from '../components/StyledInputTextArea'
import { useLogin } from '../hooks/useLogin'

const informativa =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sed ipsum risus. Donec justo nunc, volutpat nec elementum sed, consectetur in mauris. Donec vulputate, purus a volutpat interdum, tellus libero condimentum velit, eget placerat risus ipsum laoreet sapien. Maecenas justo libero, congue eget venenatis sed, vehicula eu enim. Mauris nec dictum nunc. Vivamus blandit maximus ipsum, venenatis pulvinar lorem sagittis in. Duis luctus orci eget euismod mattis. Maecenas orci justo, '

export function Login() {
  const [privacy, setPrivacy] = useState(false)
  const { login, loadingText } = useLogin()

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

      {loadingText && <LoadingOverlay loadingText={loadingText} />}
    </React.Fragment>
  )
}
