import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTES, testParties, testUser } from '../lib/constants'
import { PartyContext, UserContext } from '../lib/context'

export function Login() {
  const { user, setUser } = useContext(UserContext)
  const { setAvailableParties } = useContext(PartyContext)

  const history = useHistory()

  const login = () => {
    if (!user) {
      // set the user
      setUser(testUser)
      // get all available parties related to the user, and set them
      setAvailableParties(testParties)
      // go to choice view
      history.push(ROUTES.CHOOSE_PARTY.PATH)
    }
  }

  return (
    <div>
      <button onClick={login}>Click to login</button>
    </div>
  )
}
