import React, { useContext, useState } from 'react'
import { IPAParty, StepperStepComponentProps } from '../../types'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserContext } from '../lib/context'
import { Row, Container } from 'react-bootstrap'
import { OnboardingStepActions } from './OnboardingStepActions'
import { AsyncAutocomplete } from './AsyncAutocomplete'

export function OnboardingStep1({ forward }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)
  const [selected, setSelected] = useState<IPAParty[]>([])

  const onForwardAction = () => {
    const { digitalAddress, id } = selected[0]
    forward!({ institutionId: id }, digitalAddress)
  }

  return (
    <WhiteBackground>
      <Container className="container-align-left form-max-width">
        <Row>
          <h3>
            Ciao, {user?.name} {user?.surname}
          </h3>
          <p>
            Per registrarti alla piattaforma di interoperabilità, seleziona il tuo l’ente di
            riferimento dall’elenco IPA.
            <br />
            Se non trovi il tuo ente nell’elenco,{' '}
            <a
              className="link-default"
              href="https://example.com"
              title="Go to example.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              scopri qui
            </a>{' '}
            come aggiungerti.
          </p>
        </Row>
        <Row className="my-4">
          <AsyncAutocomplete
            selected={selected}
            setSelected={setSelected}
            placeholder="Cerca ente nel catalogo IPA"
            endpoint={{ endpoint: 'ONBOARDING_GET_SEARCH_PARTIES' }}
            transformFn={(data: any) => data.items}
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
