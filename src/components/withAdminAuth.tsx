import { useContext } from 'react'
import { isAdmin } from '../lib/auth-utils'
import { PartyContext } from '../lib/context'
import { StyledIntro } from './StyledIntro'
import { WhiteBackground } from './WhiteBackground'

type AdminAuthProps = {}

export function withAdminAuth<T extends AdminAuthProps>(WrappedComponent: React.ComponentType<T>) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'

  const ComponentWithAdminAuth = (props: Omit<T, keyof AdminAuthProps>) => {
    const { party } = useContext(PartyContext)

    if (!isAdmin(party)) {
      return (
        <WhiteBackground>
          <StyledIntro priority={2}>
            {{
              title: 'Autorizzazione insufficiente',
              description: 'Non hai sufficienti permessi per accedere a questo contenuto',
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
