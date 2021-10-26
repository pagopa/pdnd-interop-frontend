import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Party } from '../../types'
import { ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { StyledInputRadioGroup } from '../components/Shared/StyledInputRadioGroup'
import { storageWrite } from '../lib/storage-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { Layout } from '../components/Shared/Layout'

export function ChooseParty() {
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
    <Layout>
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

      <div className="d-flex align-items-center">
        <div>
          <StyledInputRadioGroup
            id="istituzioni"
            groupLabel="Selezione ente"
            options={availableParties.map((p) => ({
              label: `${p.description} (${USER_ROLE_LABEL[p.role]})${
                p.status === 'pending' ? ' - registrazione da completare' : ''
              }`,
              disabled: p.status === 'pending',
              onChange: buildUpdateActiveParty(p),
              value: p.institutionId,
            }))}
            currentValue={party?.institutionId}
          />

          <StyledButton
            className="mt-3"
            variant="contained"
            onClick={confirmChoice}
            disabled={!party}
          >
            prosegui
          </StyledButton>
        </div>
        <div className="text-center">
          <p>oppure</p>
          <StyledButton variant="contained" onClick={goToOnboarding}>
            registra nuovo ente
          </StyledButton>
        </div>
      </div>
    </Layout>
  ) : (
    <Layout>
      <div className="d-flex align-items-center mx-auto my-auto">
        <div className="text-center">
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
          <StyledButton variant="contained" onClick={goToOnboarding}>
            registra nuovo ente
          </StyledButton>
        </div>
      </div>
    </Layout>
  )
}
