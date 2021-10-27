import React, { useContext, useState } from 'react'
import { IPACatalogParty, PartyOnCreate, StepperStepComponentProps } from '../../types'
import { UserContext } from '../lib/context'
import { OnboardingStepActions } from './OnboardingStepActions'
import { AsyncAutocomplete } from './Shared/AsyncAutocomplete'
import { StyledIntro } from './Shared/StyledIntro'
import { ROUTES } from '../lib/constants'
import { StyledLink } from './Shared/StyledLink'

export function OnboardingStep1({ forward }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)
  const [selected, setSelected] = useState<IPACatalogParty[]>([])

  const onForwardAction = () => {
    const catalogParty: IPACatalogParty = selected[0]
    const { description, digitalAddress, id } = catalogParty
    const platformParty: PartyOnCreate = { description, institutionId: id, digitalAddress }
    forward!(platformParty)
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
        <AsyncAutocomplete
          selected={selected}
          setSelected={setSelected}
          placeholder="Cerca ente nel catalogo IPA"
          path={{ endpoint: 'ONBOARDING_GET_SEARCH_PARTIES' }}
          transformFn={(data: { items: IPACatalogParty[] }) => data.items}
          labelKey="description"
        />
      </div>

      <OnboardingStepActions
        forward={{ action: onForwardAction, label: 'Prosegui', disabled: selected.length === 0 }}
      />
    </React.Fragment>
  )
}
