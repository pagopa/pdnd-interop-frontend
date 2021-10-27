import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Party } from '../../types'
import { ROUTES, USER_ROLE_LABEL } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { StyledInputRadioGroup } from '../components/Shared/StyledInputRadioGroup'
import { storageWrite } from '../lib/storage-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'

export function ChooseParty() {
  const { setParty, party, availableParties } = useContext(PartyContext)
  const history = useHistory()

  const updateActiveParty = (e: React.SyntheticEvent) => {
    const newParty = availableParties.find(
      (p) => p.institutionId === (e.target as any).value
    ) as Party
    setParty(newParty)
    storageWrite('currentParty', newParty, 'object')
  }

  const confirmChoice = () => {
    history.push(ROUTES.SUBSCRIBE.PATH)
  }

  const goToOnboarding = () => {
    history.push(ROUTES.ONBOARDING.PATH)
  }

  useEffect(() => {
    if (availableParties.length > 0) {
      setParty(availableParties[0])
    }
  }, [availableParties]) // eslint-disable-line react-hooks/exhaustive-deps

  return availableParties.length > 0 ? (
    <React.Fragment>
      <StyledIntro sx={{ textAlign: 'center', mx: 'auto' }}>
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
          {party && (
            <StyledInputRadioGroup
              name="istituzioni"
              groupLabel="Selezione ente"
              options={availableParties.map((p) => ({
                label: `${p.description} (${USER_ROLE_LABEL[p.role]})${
                  p.status === 'pending' ? ' - registrazione da completare' : ''
                }`,
                disabled: p.status === 'pending',
                value: p.institutionId,
              }))}
              onChange={updateActiveParty}
              currentValue={party!.institutionId}
            />
          )}

          <StyledButton
            className="mt-3"
            variant="contained"
            onClick={confirmChoice}
            disabled={!party}
          >
            Prosegui
          </StyledButton>
        </div>
        <div className="text-center">
          <p>oppure</p>
          <StyledButton variant="contained" onClick={goToOnboarding}>
            Registra nuovo ente
          </StyledButton>
        </div>
      </div>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <div className="d-flex align-items-center mx-auto my-auto">
        <div className="text-center">
          <StyledIntro variant="h1">
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
            Registra nuovo ente
          </StyledButton>
        </div>
      </div>
    </React.Fragment>
  )
}
