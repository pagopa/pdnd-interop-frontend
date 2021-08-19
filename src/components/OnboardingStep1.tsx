import React, { useContext, useState } from 'react'
import { IPAParty, StepperStepComponentProps } from '../../types'
import { WhiteBackground } from '../components/WhiteBackground'
import { UserContext } from '../lib/context'
import { Row, Container } from 'react-bootstrap'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { fetchWithLogs } from '../lib/api-utils'
import { OnboardingStepActions } from './OnboardingStepActions'

type AutocompleteProps = {
  selected: IPAParty[]
  setSelected: React.Dispatch<React.SetStateAction<IPAParty[]>>
}

function Autocomplete({ selected, setSelected }: AutocompleteProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<IPAParty[]>([])

  const handleSearch = async (query: string) => {
    setIsLoading(true)

    const parties = await fetchWithLogs('ONBOARDING_GET_SEARCH_PARTIES', {
      method: 'GET',
      params: { limit: 100, page: 1, search: query },
    })

    setOptions(parties?.data.items)
    setIsLoading(false)
  }

  const filterBy = () => true

  return (
    <AsyncTypeahead
      filterBy={filterBy}
      id="async-example"
      isLoading={isLoading}
      labelKey="description"
      minLength={3}
      onSearch={handleSearch}
      onChange={setSelected}
      selected={selected}
      options={options}
      placeholder="Cerca ente nel catalogo IPA"
      renderMenuItemChildren={(option, props) => (
        <React.Fragment>
          <span>{option.description}</span>
        </React.Fragment>
      )}
    />
  )
}

export function OnboardingStep1({ forward, maxWidth }: StepperStepComponentProps) {
  const { user } = useContext(UserContext)
  const [selected, setSelected] = useState<IPAParty[]>([])

  const onForwardAction = () => {
    const { digitalAddress, id } = selected[0]
    forward!({ institutionId: id }, digitalAddress)
  }

  return (
    <WhiteBackground>
      <Container className="container-align-left" style={{ maxWidth }}>
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
          <Autocomplete selected={selected} setSelected={setSelected} />
        </Row>

        <OnboardingStepActions
          forward={{ action: onForwardAction, label: 'prosegui', disabled: selected.length === 0 }}
        />
      </Container>
    </WhiteBackground>
  )
}
