import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Party } from '../../types'
import { withLogin } from '../components/withLogin'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'

function ChoosePartyComponent() {
  const { setParty, availableParties } = useContext(PartyContext)
  const history = useHistory()

  const buildSetParty = (p: Party) => (e: React.SyntheticEvent) => {
    setParty(p)
    history.push(ROUTES.PROVIDE.PATH)
  }

  return (
    <div>
      <p>scegli con quale ente vuoi operare</p>
      <div>
        {availableParties.map((p, i) => {
          return (
            <div key={i}>
              <button onClick={buildSetParty(p)}>{p.name}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ChooseParty = withLogin(ChoosePartyComponent)
