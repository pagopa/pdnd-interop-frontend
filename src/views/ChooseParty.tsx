import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'
import { useHistory } from 'react-router-dom'
import { Chip, List, ListItem, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Party } from '../../types'
import { NARROW_MAX_WIDTH, STORAGE_PARTY_OBJECT, URL_FE_ONBOARDING } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { storageWrite } from '../lib/storage-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { USER_ROLE_LABEL } from '../config/labels'
import { useRoute } from '../hooks/useRoute'

export function ChooseParty() {
  const { routes } = useRoute()
  const { setParty, party, availableParties } = useContext(PartyContext)
  const history = useHistory()

  const wrapUpdateActiveParty = (id: string) => (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault()
    const newParty = (availableParties as Array<Party>).find((p) => p.institutionId === id) as Party
    setParty(newParty)
    storageWrite(STORAGE_PARTY_OBJECT, newParty, 'object')
  }

  const confirmChoice = () => {
    const DESTINATIONS = {
      admin: routes.SUBSCRIBE.PATH,
      api: routes.PROVIDE.PATH,
      security: routes.SUBSCRIBE_CLIENT_LIST.PATH,
    }
    if (party) {
      history.push(DESTINATIONS[party.productInfo.role])
    }
  }

  if (!availableParties) {
    return null
  }

  return availableParties.length > 0 ? (
    <React.Fragment>
      <StyledIntro sx={{ textAlign: 'center', mx: 'auto', mb: 3 }} centered>
        {{
          title: "Seleziona l'ente per cui accedi",
          description: (
            <React.Fragment>
              Potrai in ogni momento cambiare Ente/ruolo anche all’interno dell’interfaccia di
              gestione dei prodotti
            </React.Fragment>
          ),
        }}
      </StyledIntro>

      <Box sx={{ mx: 'auto', maxWidth: NARROW_MAX_WIDTH }}>
        <Box
          sx={{
            /*
            borderBottom: 1,
            borderColor: 'divider',
            */
            mb: 1,
            pb: 3,
            textAlign: 'center',
          }}
        >
          {availableParties.length > 0 && (
            <List sx={{ height: 240, overflow: 'auto' }} component="ul">
              {availableParties.map((p, i) => {
                const disabled = p.state === 'PENDING'
                const selected = p.institutionId === party?.institutionId
                return (
                  <ListItem key={i} sx={{ mb: 1, position: 'relative' }} disablePadding={true}>
                    <StyledButton
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        border: 2,
                        borderColor: selected ? 'primary.main' : 'common.white',
                        mx: 2,
                        px: 2,
                        py: 3,
                        opacity: disabled ? 0.5 : 1,
                        boxShadow: 2,
                        borderRadius: 0,
                      }}
                      disabled={disabled}
                      onClick={wrapUpdateActiveParty(p.institutionId)}
                    >
                      <Typography
                        component="span"
                        color={disabled ? 'text' : 'primary'}
                        variant="body2"
                        sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}
                      >
                        {p.description}
                      </Typography>
                      <Typography component="span" color="text" variant="caption">
                        {USER_ROLE_LABEL[p.role]}
                      </Typography>
                    </StyledButton>
                    {p.state === 'PENDING' && (
                      <Box sx={{ position: 'absolute', right: 20, top: 12 }}>
                        <Chip label="Da completare" color="primary" size="small" />
                      </Box>
                    )}
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

        {/* <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
          <Typography component="span" sx={{ mr: 1 }}>
            Vuoi registrare un nuovo ente?{' '}
            <a href={URL_FE_ONBOARDING} title="Vai all'onboarding">
              Clicca qui
            </a>
          </Typography>
        </Box> */}
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
      <StyledButton
        variant="contained"
        onClick={() => {
          window.location.assign(URL_FE_ONBOARDING)
        }}
      >
        Registra nuovo ente
      </StyledButton>
    </Box>
  )
}
