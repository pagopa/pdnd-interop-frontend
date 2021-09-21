import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Party } from '../../types'
import { WhiteBackground } from '../components/WhiteBackground'
import { withLogin } from '../components/withLogin'
import { HARDCODED_MAIN_TAG_HEIGHT, ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { Row, Col, Button } from 'react-bootstrap'
import { StyledInputRadioGroup } from '../components/StyledInputRadioGroup'
import { storageWrite } from '../lib/storage-utils'
import { StyledIntro } from '../components/StyledIntro'

function ChoosePartyComponent() {
  const { setParty, party, availableParties } = useContext(PartyContext)
  const history = useHistory()

  const buildUpdateActiveParty = (newParty: Party) => (_: React.SyntheticEvent) => {
    setParty(newParty)
    storageWrite('currentParty', newParty, 'object')
  }

  const confirmChoice = () => {
    history.push(ROUTES.SUBSCRIBE.PATH)
  }

  const goToOnboarding = () => {
    history.push(ROUTES.ONBOARDING.PATH)
  }

  return availableParties.length > 0 ? (
    <WhiteBackground containerStyles={{ minHeight: HARDCODED_MAIN_TAG_HEIGHT }}>
      <StyledIntro priority={2} additionalClasses="text-center mx-auto">
        {{
          title: 'Per quale ente vuoi operare?',
          description: (
            <>
              Se l’ente per il quale vuoi operare non è ancora accreditato sulla piattaforma, puoi
              aggiungerlo cliccando su <em>registra nuovo ente</em>
            </>
          ),
        }}
      </StyledIntro>

      <Row className="d-flex align-items-center">
        <Col>
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

          <Button className="mt-3" variant="primary" onClick={confirmChoice} disabled={!party}>
            prosegui
          </Button>
        </Col>
        <Col className="text-center">
          <p>oppure</p>
          <Button variant="primary" onClick={goToOnboarding}>
            registra nuovo ente
          </Button>
        </Col>
      </Row>
    </WhiteBackground>
  ) : (
    <WhiteBackground
      containerStyles={{ minHeight: HARDCODED_MAIN_TAG_HEIGHT }}
      containerClassNames="d-flex flex-direction-column"
    >
      <Row className="d-flex align-items-center mx-auto my-auto">
        <Col className="text-center">
          <StyledIntro priority={2}>
            {{
              title: 'Ciao!',
              description: (
                <>
                  Dev'essere il tuo primo accesso, non ci sono enti a te associati. Se sei il
                  rappresentante legale di un ente, accreditalo e accedi
                </>
              ),
            }}
          </StyledIntro>
          <Button variant="primary" onClick={goToOnboarding}>
            registra nuovo ente
          </Button>
        </Col>
      </Row>
    </WhiteBackground>
  )
}

export const ChooseParty = withLogin(ChoosePartyComponent)
