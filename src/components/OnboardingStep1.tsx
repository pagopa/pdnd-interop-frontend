import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import isEmpty from 'lodash/isEmpty'
import { IPACatalogParty, PartyOnCreate, StepperStepComponentProps } from '../../types'
import { NARROW_MAX_WIDTH, ROUTES } from '../lib/constants'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledAsyncAutocomplete } from './Shared/StyledAsyncAutocomplete'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledLink } from './Shared/StyledLink'

export function OnboardingStep1({ forward, data }: StepperStepComponentProps) {
  const history = useHistory()
  const [selected, setSelected] = useState<IPACatalogParty | null>()

  const onForwardAction = () => {
    const catalogParty: IPACatalogParty = selected!
    const { description, digitalAddress, id } = catalogParty
    const platformParty: PartyOnCreate = { description, institutionId: id, digitalAddress }
    forward!(platformParty)
  }

  const goToChooseParty = () => {
    history.push(ROUTES.CHOOSE_PARTY.PATH)
  }

  const updateSelected = (_: any, newSelected: IPACatalogParty | null) => {
    setSelected(newSelected)
  }

  useEffect(() => {
    if (!isEmpty(data.party)) {
      setSelected(data.party)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Seleziona il tuo Ente',
          description:
            "Seleziona dall'indice IPA l'Ente per il quale vuoi richiedere l'adesione alla Piattaforma Interoperabilità",
        }}
      </StyledIntro>

      <Box sx={{ maxWidth: NARROW_MAX_WIDTH, mx: 'auto' }}>
        <Box sx={{ my: '4rem' }}>
          <StyledAsyncAutocomplete
            selected={selected}
            setSelected={updateSelected}
            placeholder="Cerca ente nel catalogo IPA"
            path={{ endpoint: 'ONBOARDING_GET_SEARCH_PARTIES' }}
            transformFn={(data: { items: IPACatalogParty[] }) => data.items}
            labelKey="description"
          />
        </Box>

        <Box>
          <Typography variant="caption">
            Non trovi il tuo Ente nell’indice IPA?{' '}
            <StyledLink to={ROUTES.IPA_GUIDE.PATH}>Clicca qui</StyledLink> per maggiori informazioni
            e istruzioni per essere inclusi nell’indice delle Pubbliche Amministrazioni
          </Typography>
        </Box>
      </Box>

      <OnboardingStepActions
        back={{ action: goToChooseParty, label: 'Indietro' }}
        forward={{ action: onForwardAction, label: 'Conferma', disabled: !selected }}
      />
    </React.Fragment>
  )
}
