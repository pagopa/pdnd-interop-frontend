import React, { useState } from 'react'
import spidIcon from '../assets/icons/spid.svg'
import cieIcon from '../assets/icons/cie.svg'
import { StyledInputCheckbox } from '../components/Shared/StyledInputCheckbox'
import { StyledInputTextArea } from '../components/Shared/StyledInputTextArea'
import { useLogin } from '../hooks/useLogin'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { NARROW_MAX_WIDTH, ROUTES, USE_MOCK_SPID_USER } from '../lib/constants'
import { mockSPIDUser } from '../lib/mock-static-data'
import { useHistory } from 'react-router'
import { StyledButton } from '../components/Shared/StyledButton'
import { Box } from '@mui/system'
import { informativaPrivacy } from '../lib/legal'

export function Login() {
  const history = useHistory()
  const [privacy, setPrivacy] = useState(false)
  const { setTestSPIDUser } = useLogin()

  const goToSPID = async () => {
    if (USE_MOCK_SPID_USER) {
      await setTestSPIDUser(mockSPIDUser)
    } else {
      history.push(ROUTES.TEMP_SPID_USER.PATH)
    }
  }

  const updatePrivacy = () => {
    setPrivacy(!privacy)
  }

  return (
    <Box sx={{ maxWidth: NARROW_MAX_WIDTH, mx: 'auto' }}>
      <StyledIntro sx={{ textAlign: 'center' }}>
        {{
          title: 'Accedi con SPID/CIE',
          description:
            'Seleziona la modalità di autenticazione che preferisci e inizia il processo di adesione',
        }}
      </StyledIntro>
      <Box sx={{ mb: '2rem' }}>
        <StyledInputTextArea readOnly={true} value={informativaPrivacy} />

        <StyledInputCheckbox
          onChange={updatePrivacy}
          checked={privacy}
          id="my-checkbox"
          label="Accetto l'informativa"
          inline={true}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 240, mx: 'auto' }}>
        <StyledButton
          sx={{ mb: '0.5rem' }}
          variant="contained"
          onClick={goToSPID}
          disabled={!privacy}
        >
          <i style={{ marginRight: '0.5rem' }}>
            <img src={spidIcon} alt="Icona di SPID" />
          </i>{' '}
          Autenticati con SPID
        </StyledButton>
        <StyledButton variant="contained" disabled>
          <i style={{ marginRight: '0.5rem' }}>
            <img src={cieIcon} alt="Icona di CIE" />
          </i>{' '}
          Autenticati con CIE
        </StyledButton>
      </Box>
    </Box>
  )
}
