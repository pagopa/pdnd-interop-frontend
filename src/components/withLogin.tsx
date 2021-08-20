import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../lib/context'

export function withLogin(Component: React.FunctionComponent, props = {}) {
  return () => {
    const { user } = useContext(UserContext)
    const history = useHistory()

    if (!user) {
      history.push('/')
    }

    return <Component {...props} />
  }
}
