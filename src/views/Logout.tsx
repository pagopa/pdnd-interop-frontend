import { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { UserContext } from '../lib/context'

export function Logout() {
  const { setUser } = useContext(UserContext)
  const history = useHistory()

  useEffect(() => {
    // clean up user
    setUser(null)
    // go back to homepage (which will redirect to login)
    history.push('/')
  }, []) //eslint-disable-line react-hooks/exhaustive-deps

  return null
}
