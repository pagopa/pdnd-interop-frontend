import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ProviderOrSubscriber, RouteConfig } from '../../types'
import { ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { isParentRoute, isRoute } from '../lib/router-utils'
import { StyledContainer } from './Shared/StyledContainer'
import { StyledIntro } from './Shared/StyledIntro'
import { StyledRow } from './Shared/StyledRow'

type SectionHeaderProps = {
  view: ProviderOrSubscriber
}

type SectionsType = {
  admin: RouteConfig[]
  security?: RouteConfig[]
  api?: RouteConfig[]
}

type ViewType = {
  title: string
  description: string
  sections: SectionsType
}

type ViewsType = {
  [key in ProviderOrSubscriber]: ViewType
}

export function SectionHeader({ view }: SectionHeaderProps) {
  const location = useLocation()
  const { party } = useContext(PartyContext)

  const VIEWS: ViewsType = {
    provider: {
      title: 'Gestione e-service erogati',
      description:
        'In questa sezione puoi creare e modificare gli e-service che eroghi, gestire gli accordi con i fruitori che li utilizzano e i tuoi operatori API',
      sections: {
        admin: [
          ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST,
          ROUTES.PROVIDE.SUBROUTES!.AGREEMENT_LIST,
          ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST,
        ],
        api: [ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST, ROUTES.PROVIDE.SUBROUTES!.OPERATOR_API_LIST],
      },
    },
    subscriber: {
      title: 'Gestione e-service in fruizione',
      description:
        'In questa sezione puoi gestire i client e gli accordi che hai sottoscritto per fruire degli e-service messi a disposizione. Puoi inoltre consultare il catalogo, e sottoscrivere nuovi accordi per ulteriori e-service',
      sections: {
        admin: [
          ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.AGREEMENT_LIST,
        ],
        security: [
          ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST,
          ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST,
        ],
      },
    },
  }

  const { title, description, sections } = VIEWS[view]

  const isActive = (path: string) => isParentRoute(location, path) || isRoute(location, path)

  const leastPrivilegeRole = view === 'provider' ? 'api' : 'security'
  const protectedSections: RouteConfig[] = sections[party?.platformRole || leastPrivilegeRole]!

  return (
    <StyledContainer>
      <StyledRow>
        <StyledIntro>{{ title, description }}</StyledIntro>
        <div className="d-flex">
          {protectedSections.map(({ PATH, LABEL }, i) => (
            <Link
              key={i}
              to={PATH}
              className={`px-5 py-2 border-bottom border-3 ${
                isActive(PATH) ? 'text-primary border-primary' : 'text-dark border-white'
              } text-decoration-none`}
            >
              {LABEL}
            </Link>
          ))}
        </div>
      </StyledRow>
    </StyledContainer>
  )
}
