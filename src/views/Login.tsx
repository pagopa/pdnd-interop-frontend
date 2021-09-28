import React, { useState } from 'react'
import { Row, Button } from 'react-bootstrap'
import spidIcon from '../assets/icons/spid.svg'
import cieIcon from '../assets/icons/cie.svg'
import { LoadingOverlay } from '../components/LoadingOverlay'
import { WhiteBackground } from '../components/WhiteBackground'
import { StyledInputCheckbox } from '../components/StyledInputCheckbox'
import { StyledInputTextArea } from '../components/StyledInputTextArea'
import { useLogin } from '../hooks/useLogin'
import { StyledIntro } from '../components/StyledIntro'

const informativa =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris arcu sapien, iaculis nec accumsan eu, mollis sit amet magna. Aenean eu auctor velit, ac pulvinar orci. Aliquam ornare odio in sollicitudin commodo. Suspendisse eu sodales ante. Sed porttitor at massa in dignissim. Proin nec sapien quis odio venenatis maximus. Praesent sit amet condimentum risus. Maecenas ipsum dui, egestas ac arcu non, dignissim cursus dui. Proin varius placerat dolor ut luctus. Suspendisse potenti. Pellentesque sed arcu mollis, luctus lacus ac, fermentum nibh. Nunc bibendum lorem ut felis porttitor, ac fringilla metus sollicitudin. Phasellus tempus pretium diam eget pellentesque.'

export function Login() {
  const [privacy, setPrivacy] = useState(false)
  const { login, loadingText } = useLogin()

  const updatePrivacy = () => {
    setPrivacy(!privacy)
  }

  return (
    <React.Fragment>
      <WhiteBackground containerStyles={{ maxWidth: 480 }}>
        <StyledIntro priority={2} additionalClasses="text-center">
          {{
            title: 'Accedi con SPID/CIE',
            description:
              'Seleziona la modalità di autenticazione che preferisci e inizia il processo di adesione',
          }}
        </StyledIntro>
        <Row className="mb-5">
          <StyledInputTextArea readOnly={true} value={informativa} readOnlyBgWhite={true} />

          <StyledInputCheckbox
            onChange={updatePrivacy}
            checked={privacy}
            id="my-checkbox"
            label="Accetto l'informativa"
            inline={true}
          />
        </Row>
        <Row className="mx-auto" style={{ maxWidth: 280 }}>
          <Button className="mb-2 text-none" variant="primary" onClick={login} disabled={!privacy}>
            <i>
              <img src={spidIcon} alt="Icona di SPID" />
            </i>{' '}
            <span className="ms-2">Autenticati con SPID</span>
          </Button>
          <Button className="text-none" variant="primary" disabled>
            <i>
              <img src={cieIcon} alt="Icona di CIE" />
            </i>{' '}
            <span className="ms-2">Autenticati con CIE</span>
          </Button>
        </Row>
      </WhiteBackground>

      {loadingText && <LoadingOverlay loadingText={loadingText} />}
    </React.Fragment>
  )
}
