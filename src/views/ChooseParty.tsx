import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Party } from '../../types'
import { NARROW_MAX_WIDTH, ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { StyledInputRadioGroup } from '../components/Shared/StyledInputRadioGroup'
import { storageWrite } from '../lib/storage-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { Box } from '@mui/system'
import { StyledLink } from '../components/Shared/StyledLink'
import { Typography } from '@mui/material'

export function ChooseParty() {
  const { setParty, party, availableParties } = useContext(PartyContext)
  const history = useHistory()

  const updateActiveParty = (e: React.SyntheticEvent) => {
    const newParty = availableParties.find(
      (p) => p.institutionId === (e.target as any).value
    ) as Party
    setParty(newParty)
    storageWrite('currentParty', newParty, 'object')
  }

  const confirmChoice = () => {
    const DESTINATIONS = {
      admin: ROUTES.SUBSCRIBE.PATH,
      api: ROUTES.PROVIDE.PATH,
      security: ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST.PATH,
    }
    history.push(DESTINATIONS[party?.platformRole!])
  }

  const goToOnboarding = () => {
    history.push(ROUTES.ONBOARDING.PATH)
  }

  useEffect(() => {
    if (availableParties.length > 0) {
      setParty(availableParties[0])
    }
  }, [availableParties]) // eslint-disable-line react-hooks/exhaustive-deps

  return availableParties.length > 0 ? (
    <React.Fragment>
      <StyledIntro sx={{ textAlign: 'center', mx: 'auto' }}>
        {{
          title: 'Per quale ente vuoi operare?',
          description: (
            <>
              Se l’ente per il quale vuoi operare non è ancora accreditato sulla piattaforma, puoi
              aggiungerlo cliccando sul link in basso
            </>
          ),
        }}
      </StyledIntro>

      <Box sx={{ mx: 'auto', maxWidth: NARROW_MAX_WIDTH }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 1,
            pb: 3,
            textAlign: 'center',
          }}
        >
          {party && (
            <StyledInputRadioGroup
              name="istituzioni"
              groupLabel="Selezione ente"
              options={availableParties.map((p) => ({
                label: `${p.description} (${USER_ROLE_LABEL[p.role]})${
                  p.status === 'pending' ? ' - registrazione da completare' : ''
                }`,
                disabled: p.status === 'pending',
                value: p.institutionId,
              }))}
              onChange={updateActiveParty}
              currentValue={party!.institutionId}
            />
          )}

          <StyledButton
            sx={{ mt: 2 }}
            variant="contained"
            onClick={confirmChoice}
            disabled={!party}
          >
            Entra
          </StyledButton>
        </Box>

        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
          <Typography component="span" sx={{ mr: 1 }}>
            Vuoi registrare un nuovo ente?
          </Typography>
          <StyledLink component="button" onClick={goToOnboarding}>
            <Typography>Clicca qui</Typography>
          </StyledLink>
        </Box>
      </Box>
    </React.Fragment>
  ) : (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        m: 'auto',
        textAlign: 'center',
      }}
    >
      <StyledIntro variant="h1">
        {{
          title: 'Ciao!',
          description:
            "Dev'essere il tuo primo accesso, non ci sono enti a te associati. Se sei il rappresentante legale di un ente, accreditalo e accedi",
        }}
      </StyledIntro>
      <StyledButton variant="contained" onClick={goToOnboarding}>
        Registra nuovo ente
      </StyledButton>
    </Box>
  )
}
