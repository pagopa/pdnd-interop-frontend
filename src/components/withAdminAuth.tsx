import { useContext } from 'react'
import { isAdmin } from '../lib/auth-utils'
import { UserContext } from '../lib/context'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type AdminAuthProps = {}

export function withAdminAuth<T extends AdminAuthProps>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithAdminAuth = (props: Omit<T, keyof AdminAuthProps>) => {
    const { user } = useContext(UserContext)

    if (!isAdmin(user)) {
      return (
        <WhiteBackground>
          <StyledIntro>
            {{
              title: 'Autorizzazione insufficiente',
              description:
                'Spiacenti, non hai permessi sufficienti per accedere a questo contenuto',
            }}
          </StyledIntro>
        </WhiteBackground>
      )
    }

    return <WrappedComponent {...(props as T)} />
  }

  ComponentWithAdminAuth.displayName = `withAdminAuth(${displayName})`

  return ComponentWithAdminAuth
}
