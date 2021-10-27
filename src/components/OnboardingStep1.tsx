import React, { useContext, useState } from 'react'
import { IPACatalogParty, PartyOnCreate, StepperStepComponentProps } from '../../types'
import { UserContext } from '../lib/context'
import { OnboardingStepActions } from './OnboardingStepActions'
import { StyledAsyncAutocomplete } from './Shared/StyledAsyncAutocomplete'
import { StyledIntro } from './Shared/StyledIntro'
import { ROUTES } from '../lib/constants'
import { StyledLink } from './Shared/StyledLink'

export function OnboardingStep1({ forward }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)
  const [selected, setSelected] = useState<IPACatalogParty | null>()

  const onForwardAction = () => {
    const catalogParty: IPACatalogParty = selected!
    const { description, digitalAddress, id } = catalogParty
    const platformParty: PartyOnCreate = { description, institutionId: id, digitalAddress }
    forward!(platformParty)
  }

  const updateSelected = (_: any, newSelected: IPACatalogParty | null) => {
    setSelected(newSelected)
  }

  return (
    <React.Fragment>
      <StyledIntro>
        {{
          title: `Ciao, ${user?.name} ${user?.surname}`,
          description: (
            <>
              Per registrarti alla piattaforma di interoperabilità, seleziona il tuo l’ente di
              riferimento dall’elenco IPA.
              <br />
              Se non trovi il tuo ente nell’elenco,{' '}
              <StyledLink to={ROUTES.IPA_GUIDE.PATH}>scopri qui</StyledLink> come aggiungerti.
            </>
          ),
        }}
      </StyledIntro>
      <div className="my-4">
        <StyledAsyncAutocomplete
          selected={selected}
          setSelected={updateSelected}
          placeholder="Cerca ente nel catalogo IPA"
          path={{ endpoint: 'ONBOARDING_GET_SEARCH_PARTIES' }}
          transformFn={(data: { items: IPACatalogParty[] }) => data.items}
          labelKey="description"
        />
      </div>

      <OnboardingStepActions
        forward={{
          action: onForwardAction,
          label: 'Prosegui',
          disabled: !selected,
        }}
      />
    </React.Fragment>
  )
}
