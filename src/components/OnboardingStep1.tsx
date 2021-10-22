import React, { useContext, useState } from 'react'
import { IPACatalogParty, PartyOnCreate, StepperStepComponentProps } from '../../types'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserContext } from '../lib/context'
import { OnboardingStepActions } from './OnboardingStepActions'
import { AsyncAutocomplete } from './AsyncAutocomplete'
import { StyledIntro } from './Shared/StyledIntro'
import { ROUTES } from '../lib/constants'
import { Link } from 'react-router-dom'
import { StyledRow } from './Shared/StyledRow'
import { StyledContainer } from './Shared/StyledContainer'

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
    <WhiteBackground>
      <StyledContainer className="container-align-left form-max-width">
        <StyledIntro>
          {{
            title: `Ciao, ${user?.name} ${user?.surname}`,
            description: (
              <>
                Per registrarti alla piattaforma di interoperabilità, seleziona il tuo l’ente di
                riferimento dall’elenco IPA.
                <br />
                Se non trovi il tuo ente nell’elenco,{' '}
                <Link className="link-default" to={ROUTES.IPA_GUIDE.PATH}>
                  scopri qui
                </Link>{' '}
                come aggiungerti.
              </>
            ),
          }}
        </StyledIntro>
        <StyledRow className="my-4">
          <AsyncAutocomplete
            selected={selected}
            setSelected={setSelected}
            placeholder="Cerca ente nel catalogo IPA"
            path={{ endpoint: 'ONBOARDING_GET_SEARCH_PARTIES' }}
            transformFn={(data: { items: IPACatalogParty[] }) => data.items}
            labelKey="description"
          />
        </StyledRow>

        <OnboardingStepActions
          forward={{ action: onForwardAction, label: 'prosegui', disabled: selected.length === 0 }}
        />
      </StyledContainer>
    </WhiteBackground>
  )
}
