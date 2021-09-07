import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../lib/context'

type LoginProps = {}

export function withLogin<T extends LoginProps>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithLogin = (props: Omit<T, keyof LoginProps>) => {
    const { user } = useContext(UserContext)
    const history = useHistory()

    if (!user) {
      history.push('/')
    }

    return <WrappedComponent {...(props as T)} />
  }

  ComponentWithLogin.displayName = `withLogin(${displayName})`

  return ComponentWithLogin
}
