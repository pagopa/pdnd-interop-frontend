import React from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router'
import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import { IPACatalogParty, StepperStepComponentProps } from '../../types'
import { NARROW_MAX_WIDTH } from '../lib/constants'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledLink } from './Shared/StyledLink'
import { requiredValidationPattern } from '../lib/validation'
import { StyledInputControlledAsyncAutocomplete } from './Shared/StyledInputControlledAsyncAutocomplete'
import { StyledForm } from './Shared/StyledForm'
import { ROUTES } from '../config/routes'

export function OnboardingStep1({ forward, data }: StepperStepComponentProps) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ defaultValues: data.party })

  const history = useHistory()

  const onForwardAction = ({ partySelection }: Record<string, IPACatalogParty>) => {
    forward(partySelection)
  }

  const goToChooseParty = () => {
    history.push(ROUTES.CHOOSE_PARTY.PATH)
  }

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: 'Seleziona il tuo Ente',
          description:
            "Seleziona dall'indice IPA l'Ente per il quale vuoi richiedere l'adesione alla Piattaforma Interoperabilità",
        }}
      </StyledIntro>

      <StyledForm onSubmit={handleSubmit(onForwardAction)}>
        <Box sx={{ maxWidth: NARROW_MAX_WIDTH, mx: 'auto' }}>
          <Box sx={{ my: 6 }}>
            <StyledInputControlledAsyncAutocomplete
              focusOnMount={true}
              label="Seleziona ente"
              defaultValue={data.party || null}
              placeholder="Cerca ente nel catalogo IPA"
              path={{ endpoint: 'ONBOARDING_GET_SEARCH_PARTIES' }}
              transformFn={(data: { items: IPACatalogParty[] }) => data.items}
              labelKey="description"
              name="partySelection"
              control={control}
              rules={{ required: requiredValidationPattern }}
              errors={errors}
            />
          </Box>

          <Box>
            <Typography variant="caption">
              Non trovi il tuo Ente nell’indice IPA?{' '}
              <StyledLink to={ROUTES.IPA_GUIDE.PATH} target="_blank" rel="noopener">
                Clicca qui
              </StyledLink>{' '}
              per maggiori informazioni e istruzioni per essere inclusi nell’indice delle Pubbliche
              Amministrazioni
            </Typography>
          </Box>
        </Box>

        <OnboardingStepActions
          back={{ action: goToChooseParty, label: 'Indietro' }}
          forward={{ label: 'Conferma' }}
        />
      </StyledForm>
    </React.Fragment>
  )
}
