import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useHistory } from 'react-router-dom'
import { Chip, List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Party } from '../../types'
import { NARROW_MAX_WIDTH, ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { storageWrite } from '../lib/storage-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { StyledLink } from '../components/Shared/StyledLink'

export function ChooseParty() {
  const { setParty, party, availableParties } = useContext(PartyContext)
  const history = useHistory()

  const wrapUpdateActiveParty = (id: string) => (e?: any) => {
    if (e) e.preventDefault()
    const newParty = availableParties.find((p) => p.institutionId === id) as Party
    setParty(newParty)
    storageWrite('currentParty', newParty, 'object')
  }

  const confirmChoice = () => {
    const DESTINATIONS = {
      admin: ROUTES.SUBSCRIBE.PATH,
      api: ROUTES.PROVIDE.PATH,
      security: ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT.SUBROUTES!.LIST.PATH,
    }
    history.push(DESTINATIONS[party?.platformRole!])
  }

  const goToOnboarding = () => {
    history.push(ROUTES.ONBOARDING.PATH)
  }

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
          {availableParties && (
            <List sx={{ height: 240, overflow: 'auto' }} component="ul">
              {availableParties.map((p, i) => {
                const disabled = p.status === 'pending' || p.status === ('Pending' as any)
                const selected = p.institutionId === party?.institutionId
                return (
                  <ListItem key={i} sx={{ mb: 1, position: 'relative' }} disablePadding={true}>
                    <StyledButton
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        bgcolor: selected ? 'grey.300' : 'common.white',
                        px: 2,
                        py: 3,
                        opacity: disabled ? 0.5 : 1,
                      }}
                      disabled={disabled}
                      onClick={wrapUpdateActiveParty(p.institutionId)}
                    >
                      <Typography
                        component="span"
                        color={disabled ? 'secondary' : 'primary'}
                        variant="body2"
                        sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}
                      >
                        {p.description}
                      </Typography>
                      <Typography component="span" color="secondary" variant="caption">
                        {USER_ROLE_LABEL[p.role]}
                      </Typography>
                    </StyledButton>
                    {p.status === 'pending' ||
                      (p.status === ('Pending' as any) && (
                        <Box sx={{ position: 'absolute', right: 12, top: 12 }}>
                          <Chip label="Da completare" color="primary" size="small" />
                        </Box>
                      ))}
                  </ListItem>
                )
              })}
            </List>
          )}

          <StyledButton
            sx={{ mt: 2 }}
            variant="contained"
            onClick={confirmChoice}
            disabled={isEmpty(party)}
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
