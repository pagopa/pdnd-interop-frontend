import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useLogin } from '../hooks/useLogin'
import { PlatformUserForm } from './Shared/PlatformUserForm'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { Box } from '@mui/system'
import { NARROW_MAX_WIDTH } from '../lib/constants'
import { UserOnCreate } from '../../types'

export function TempSPIDUser() {
  const [data, setData] = useState<Record<string, UserOnCreate>>({})
  const { setTestSPIDUser } = useLogin()

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setTestSPIDUser({ ...data['spid'], status: 'active' })
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          py: '2rem',
        }}
        bgcolor="common.white"
        color="primary.main"
      >
        <Box sx={{ display: 'flex', height: '100%', overflow: 'auto' }}>
          <Box sx={{ mx: 'auto', my: 'auto', width: '100%', maxWidth: NARROW_MAX_WIDTH }}>
            <StyledIntro>
              {{
                title: 'Inserisci dati SPID',
                description: (
                  <React.Fragment>
                    Per questa PoC, per favore inserire manualmente i dati dell'utente SPID per il
                    quale effettuare accesso alla piattaforma.
                    <br />
                    <br />
                    Attenzione: se si intende fare più test nel tempo, si consiglia di conservare il
                    codice fiscale inserito per questo finto login, in modo da poter associare
                    l'utente a tutte le operazioni che ha già effettuato sulla piattaforma
                  </React.Fragment>
                ),
              }}
            </StyledIntro>

            <StyledForm onSubmit={handleSubmit}>
              <PlatformUserForm
                platformRole="admin"
                role="Manager"
                prefix="spid"
                people={data}
                setPeople={setData}
              />

              <StyledButton
                sx={{ mt: '0.5rem' }}
                variant="contained"
                type="submit"
                disabled={isEmpty(data) || isEmpty(data['spid'])}
              >
                Effettua il login
              </StyledButton>
            </StyledForm>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  )
}
