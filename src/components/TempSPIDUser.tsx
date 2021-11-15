import React, { useEffect } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useForm } from 'react-hook-form'
import { useHistory, useLocation } from 'react-router'
import { useLogin } from '../hooks/useLogin'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledButton } from './Shared/StyledButton'
import { StyledForm } from './Shared/StyledForm'
import { Box } from '@mui/system'
import { NARROW_MAX_WIDTH } from '../lib/constants'
import { User, UserOnCreate } from '../../types'
import { ROUTES } from '../config/routes'
import { PlatformUserControlledForm } from './Shared/PlatformUserControlledForm'

export function TempSPIDUser() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()
  const { setTestSPIDUser } = useLogin()
  const history = useHistory()
  const location = useLocation()

  const onSubmit = (data: Record<string, Partial<UserOnCreate>>) => {
    setTestSPIDUser({
      ...data['spid'],
      role: 'Manager',
      platformRole: 'admin',
      status: 'active',
    } as User)
  }

  // If the user hasn't accepted the privacy policy, go back to login
  useEffect(() => {
    if (isEmpty(location.state) || !(location.state as any).privacy) {
      history.replace(ROUTES.LOGIN.PATH)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          py: 4,
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

            <StyledForm onSubmit={handleSubmit(onSubmit)}>
              <PlatformUserControlledForm prefix="spid" control={control} errors={errors} />

              <StyledButton sx={{ mt: 1 }} variant="contained" type="submit">
                Effettua il login
              </StyledButton>
            </StyledForm>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  )
}
