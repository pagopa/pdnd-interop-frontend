import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ProviderOrSubscriber } from '../../types'
import { ROUTES } from '../lib/constants'
import { isParentRoute, isRoute } from '../lib/router-utils'
import { WhiteBackground } from './WhiteBackground'

type SectionHeaderProps = {
  view: ProviderOrSubscriber
}

export function SectionHeader({ view }: SectionHeaderProps) {
  const location = useLocation()

  const VIEWS = {
    provider: {
      title: 'Gestione e-service erogati',
      description:
        'In questa sezione puoi creare e modificare gli e-service che eroghi, gestire gli accordi con i fruitori che li utilizzano e i tuoi operatori API',
      sections: [
        ROUTES.PROVIDE.SUBROUTES!.ESERVICE_LIST,
        ROUTES.PROVIDE.SUBROUTES!.CONTRACT_LIST,
        ROUTES.PROVIDE.SUBROUTES!.USERS_LIST,
      ],
    },
    subscriber: {
      title: 'Gestione e-service in fruizione',
      description:
        'In questa sezione puoi gestire i client e gli accordi che hai sottoscritto per fruire degli e-service messi a disposizione. Puoi inoltre consultare il catalogo, e sottoscrivere nuovi accordi per ulteriori e-service',
      sections: [
        ROUTES.SUBSCRIBE.SUBROUTES!.CLIENT_LIST,
        ROUTES.SUBSCRIBE.SUBROUTES!.CONTRACT_LIST,
        ROUTES.SUBSCRIBE.SUBROUTES!.CATALOG_LIST,
      ],
    },
  }

  const { title, description, sections } = VIEWS[view]

  const isActive = (path: string) => isParentRoute(location, path) || isRoute(location, path)

  return (
    <WhiteBackground>
      <h2>{title}</h2>
      <p style={{ maxWidth: 480 }}>{description}</p>
      <div className="d-flex">
        {sections.map(({ PATH, LABEL }, i) => (
          <Link
            key={i}
            to={PATH}
            className={`px-3 py-2 border-bottom border-3 ${
              isActive(PATH) ? 'text-primary border-primary' : 'text-secondary border-white'
            } text-decoration-none`}
          >
            {LABEL}
          </Link>
        ))}
      </div>
    </WhiteBackground>
  )
}
