import React, { useContext, useState } from 'react'
import { IPACatalogParty, StepperStepComponentProps } from '../../types'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserContext } from '../lib/context'
import { Row, Container } from 'react-bootstrap'
import { OnboardingStepActions } from './OnboardingStepActions'
import { AsyncAutocomplete } from './AsyncAutocomplete'
import { StyledIntro } from './StyledIntro'
import { ROUTES } from '../lib/constants'
import { Link } from 'react-router-dom'

export function OnboardingStep1({ forward }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)
  const [selected, setSelected] = useState<IPACatalogParty[]>([])

  const onForwardAction = () => {
    const { digitalAddress, id } = selected[0]
    forward!({ institutionId: id }, digitalAddress)
  }

  return (
    <WhiteBackground>
      <Container className="container-align-left form-max-width">
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
        <Row className="my-4">
          <AsyncAutocomplete
            selected={selected}
            setSelected={setSelected}
            placeholder="Cerca ente nel catalogo IPA"
            endpoint={{ endpoint: 'ONBOARDING_GET_SEARCH_PARTIES' }}
            transformFn={(data: { items: IPACatalogParty[] }) => data.items}
            labelKey="description"
          />
        </Row>

        <OnboardingStepActions
          forward={{ action: onForwardAction, label: 'prosegui', disabled: selected.length === 0 }}
        />
      </Container>
    </WhiteBackground>
  )
}
