import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Party } from '../../types'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'
import { ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { Row, Col, Button } from 'react-bootstrap'
import { StyledInputRadioGroup } from '../components/StyledInputRadioGroup'
import { storageWrite } from '../lib/storage-utils'

function ChoosePartyComponent() {
  const { setParty, party, availableParties } = useContext(PartyContext)
  const history = useHistory()

  const buildUpdateActiveParty = (newParty: Party) => (_: React.SyntheticEvent) => {
    setParty(newParty)
    storageWrite('currentParty', newParty, 'object')
  }

  const confirmChoice = () => {
    history.push(ROUTES.PROVIDE.PATH)
  }

  const goToOnboarding = () => {
    history.push(ROUTES.ONBOARDING.PATH)
  }

  return (
    <WhiteBackground verticallyCentered={true}>
      {availableParties.length > 0 ? (
        <React.Fragment>
          <Row className="text-center mb-5">
            <h2>Seleziona l’ente con il quale procedere</h2>
            <p className="mx-auto" style={{ maxWidth: 462 }}>
              Se l’ente con il quale vuoi fare accesso non è ancora registrato alla piattaforma, non
              comparirà nell’elenco. Puoi aggiungerlo cliccando su <em>registra nuovo ente</em>
            </p>
          </Row>
          <Row className="d-flex align-items-center">
            <Col>
              <h3>Selezione ente</h3>
              <p style={{ maxWidth: 320 }}>
                Nota: potrai modificarlo successivamente anche senza effettuare logout
              </p>
              <div>
                <StyledInputRadioGroup
                  id="istituzioni"
                  groupLabel="Selezione ente"
                  options={availableParties.map((p) => ({
                    label: `${p.description} (${USER_ROLE_LABEL[p.role]})${
                      p.status === 'Pending' ? ' - registrazione da completare' : ''
                    }`,
                    disabled: p.status === 'Pending',
                    onChange: buildUpdateActiveParty(p),
                    value: p.institutionId,
                  }))}
                  currentValue={party?.institutionId}
                />

                <Button
                  className="mt-3"
                  variant="primary"
                  onClick={confirmChoice}
                  disabled={!party}
                >
                  prosegui
                </Button>
              </div>
            </Col>
            <Col className="text-center">
              <p>oppure</p>
              <Button variant="primary" onClick={goToOnboarding}>
                registra nuovo ente
              </Button>
            </Col>
          </Row>
        </React.Fragment>
      ) : (
        <Row className="d-flex align-items-center">
          <Col className="text-center">
            <p className="mx-auto mb-4" style={{ maxWidth: 480 }}>
              Non ci sono enti associati a questa utenza. Se sei il rappresentante legale di un
              ente, registralo per accedere alla piattaforma
            </p>
            <Button variant="primary" onClick={goToOnboarding}>
              registra nuovo ente
            </Button>
          </Col>
        </Row>
      )}
    </WhiteBackground>
  )
}

export const ChooseParty = withLogin(ChoosePartyComponent)
