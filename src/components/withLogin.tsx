import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../lib/constants'
import { UserContext } from '../lib/context'

export function withLogin(Component: React.FunctionComponent, props = {}) {
  return () => {
    const { user } = useContext(UserContext)
    const history = useHistory()

    if (!user) {
      history.push(ROUTES.ROOT.PATH)
    }

    return <Component {...props} />
  }
}
