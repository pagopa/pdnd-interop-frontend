import React from 'react'
import { createBrowserRouter, RouteObject } from 'react-router-dom'
import {
  PartyRegistryPage,
  ConsumerEServiceCatalogPage,
  ProviderEServiceListPage,
  ProviderAgreementsListPage,
  ConsumerAgreementsListPage,
  ConsumerPurposesListPage,
  ConsumerClientListPage,
  ConsumerClientM2MListPage,
  ConsumerEServiceDetailsPage,
  TOSPage,
  ProviderEServiceDetailsPage,
  ConsumerAgreementDetailsPage,
  ProviderAgreementDetailsPage,
  ProviderPurposeDetailsPage,
  OperatorDetailsPage,
  LogoutPage,
  KeyDetailsPage,
  ConsumerClientCreatePage,
  SecurityKeyGuidePage,
  ConsumerPurposeCreatePage,
  NotificationsPage,
  ConsumerAgreementCreatePage,
  NotFoundPage,
} from '@/pages'
import { LANGUAGES } from '@/config/constants'
import { getKeys } from '@/utils/array.utils'
import RoutesWrapper from './components/RoutesWrapper'
import { Routes } from './types'
import Redirect from './components/Redirect'

// Less frequently used or heavier pages will be lazy loaded
const ConsumerClientManagePage = React.lazy(
  () => import('@/pages/ConsumerClientManagePage/ConsumerClientManage.page')
)

const ConsumerPurposeEditPage = React.lazy(
  () => import('@/pages/ConsumerPurposeEditPage/ConsumerPurposeEdit.page')
)

const ProviderEServiceCreatePage = React.lazy(
  () => import('@/pages/ProviderEServiceCreatePage/ProviderEServiceCreate.page')
)

// https://stackoverflow.com/a/70067918 waiting for "satisfies" operator in Typescript 4.9
const makeType = <T extends Routes>(o: T) => o

const EmptyComponent = () => <></>

export const routes = makeType({
  LOGOUT: {
    PATH: { it: 'logout', en: 'logout' },
    LABEL: { it: 'Logout', en: 'Logout' },
    COMPONENT: LogoutPage,
    PUBLIC: true,
    AUTH_LEVELS: 'any',
  },
  TOS: {
    PATH: { it: 'termini-di-servizio', en: 'terms-of-service' },
    LABEL: { it: 'Termini di servizio', en: 'Terms of service' },
    COMPONENT: TOSPage,
    PUBLIC: true,
    AUTH_LEVELS: 'any',
  },
  SECURITY_KEY_GUIDE: {
    PATH: { it: 'generazione-chiavi', en: 'generate-keys' },
    LABEL: { it: 'Come caricare le chiavi di sicurezza', en: 'How to upload public keys' },
    COMPONENT: SecurityKeyGuidePage,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  NOTIFICATION: {
    PATH: { it: 'notifiche', en: 'notifications' },
    LABEL: { it: 'Notifiche', en: 'Notifications' },
    COMPONENT: NotificationsPage,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  PROVIDE_ESERVICE_CREATE: {
    PATH: { it: 'erogazione/e-service/crea', en: 'provider/e-service/create' },
    LABEL: { it: 'Crea e-service', en: 'Create e-service' },
    EXACT: true,
    COMPONENT: ProviderEServiceCreatePage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_EDIT: {
    PATH: {
      it: 'erogazione/e-service/:eserviceId/:descriptorId/modifica',
      en: 'provider/e-service/:eserviceId/:descriptorId/edit',
    },
    LABEL: { it: 'Modifica e-service', en: 'Edit e-service' },
    EXACT: false,
    COMPONENT: ProviderEServiceCreatePage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_MANAGE: {
    PATH: {
      it: 'erogazione/e-service/:eserviceId/:descriptorId',
      en: 'provider/e-service/:eserviceId/:descriptorId',
    },
    LABEL: { it: 'Visualizza e-service', en: 'View e-service' },
    EXACT: false,
    COMPONENT: ProviderEServiceDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_LIST: {
    PATH: { it: 'erogazione/e-service', en: 'provider/e-service' },
    LABEL: { it: 'I tuoi e-service', en: 'Your e-services' },
    EXACT: true,
    COMPONENT: ProviderEServiceListPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_AGREEMENT_READ: {
    PATH: {
      it: 'erogazione/richieste/:agreementId',
      en: 'provider/agreements/:agreementId',
    },
    LABEL: { it: 'Gestisci richiesta', en: 'Manage request' },
    EXACT: false,
    COMPONENT: ProviderAgreementDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_AGREEMENT_LIST: {
    PATH: { it: 'erogazione/richieste', en: 'provider/agreements' },
    LABEL: { it: 'Richieste di fruizione', en: 'Requests for use' },
    EXACT: true,
    COMPONENT: ProviderAgreementsListPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE: {
    PATH: { it: 'erogazione', en: 'provider' },
    LABEL: { it: 'Erogazione', en: 'Provider' },
    REDIRECT: 'PROVIDE_ESERVICE_LIST',
    EXACT: true,
    COMPONENT: EmptyComponent,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  SUBSCRIBE_CATALOG_VIEW: {
    PATH: {
      it: 'fruizione/catalogo-e-service/:eserviceId/:descriptorId',
      en: 'subscriber/e-service-catalog/:eserviceId/:descriptorId',
    },
    LABEL: { it: 'Visualizza e-service', en: 'View e-service' },
    EXACT: false,
    COMPONENT: ConsumerEServiceDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  SUBSCRIBE_CATALOG_LIST: {
    PATH: { it: 'fruizione/catalogo-e-service', en: 'subscriber/e-service-catalog' },
    LABEL: { it: 'Catalogo e-service', en: 'E-service catalog' },
    EXACT: false,
    COMPONENT: ConsumerEServiceCatalogPage,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  SUBSCRIBE_PURPOSE_CREATE: {
    PATH: { it: 'fruizione/finalita/crea', en: 'subscriber/purpose/create' },
    LABEL: { it: 'Crea finalità', en: 'Create purpose' },
    EXACT: false,
    COMPONENT: ConsumerPurposeCreatePage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_EDIT: {
    PATH: {
      it: 'fruizione/finalita/:purposeId/modifica',
      en: 'subrscriber/purpose/:purposeId/edit',
    },
    LABEL: { it: 'Modifica finalità', en: 'Edit purpose' },
    EXACT: false,
    COMPONENT: ConsumerPurposeEditPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_VIEW: {
    PATH: { it: 'fruizione/finalita/:purposeId', en: 'subscriber/purpose/:purposeId' },
    LABEL: { it: 'Gestisci singola finalità', en: 'Manage purpose' },
    EXACT: false,
    COMPONENT: ProviderPurposeDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_LIST: {
    PATH: { it: 'fruizione/finalita', en: 'subscriber/purpose' },
    LABEL: { it: 'Le tue finalità', en: 'Your purpose' },
    EXACT: false,
    COMPONENT: ConsumerPurposesListPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_OPERATOR_EDIT: {
    PATH: {
      it: 'fruizione/client/:clientId/operatori/:operatorId',
      en: 'subscriber/client/:clientId/operators/:operatorId',
    },
    LABEL: {
      it: 'Gestisci operatore del client e-service',
      en: 'Manage e-service client operator',
    },
    EXACT: false,
    COMPONENT: OperatorDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_KEY_EDIT: {
    PATH: {
      it: 'fruizione/client/:clientId/chiavi/:kid',
      en: 'subscriber/client/:clientId/keys/:kid',
    },
    LABEL: {
      it: 'Gestisci chiave pubblica del client e-service',
      en: 'Manage e-service client public key',
    },
    EXACT: false,
    COMPONENT: KeyDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_CREATE: {
    PATH: { it: 'fruizione/client/crea', en: 'subscriber/client/create' },
    LABEL: { it: 'Crea client e-service', en: 'Create e-service client' },
    EXACT: false,
    COMPONENT: ConsumerClientCreatePage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_EDIT: {
    PATH: { it: 'fruizione/client/:clientId', en: 'subscriber/client/:clientId' },
    LABEL: { it: 'Gestisci client e-service', en: 'Manage e-service client' },
    EXACT: true,
    COMPONENT: ConsumerClientManagePage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_LIST: {
    PATH: { it: 'fruizione/client', en: 'subscriber/client' },
    LABEL: { it: 'I tuoi client e-service', en: 'Your e-service clients' },
    EXACT: false,
    COMPONENT: ConsumerClientListPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_AGREEMENT_READ: {
    PATH: {
      it: 'fruizione/richieste/:agreementId',
      en: 'subscriber/agreements/:agreementId',
    },
    LABEL: { it: 'Gestisci richiesta', en: 'Manage request' },
    EXACT: true,
    COMPONENT: ConsumerAgreementDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_AGREEMENT_LIST: {
    PATH: { it: 'fruizione/richieste', en: 'subscriber/agreements' },
    LABEL: { it: 'Le tue richieste', en: 'Your requests' },
    EXACT: true,
    COMPONENT: ConsumerAgreementsListPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_AGREEMENT_EDIT: {
    PATH: {
      it: 'fruizione/richieste/:agreementId/modifica',
      en: 'subscriber/agreements/:agreementId/edit',
    },
    LABEL: { it: 'Modifica richiesta', en: 'Edit request' },
    EXACT: false,
    COMPONENT: ConsumerAgreementCreatePage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT: {
    PATH: {
      it: 'fruizione/interop-m2m/:clientId/operatori/:operatorId',
      en: 'subscriber/interop-m2m/:clientId/operators/:operatorId',
    },
    LABEL: {
      it: 'Gestisci operatore del client api interop',
      en: 'Manage interop api client operator',
    },
    EXACT: false,
    COMPONENT: OperatorDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT: {
    PATH: {
      it: 'fruizione/interop-m2m/:clientId/chiavi/:kid',
      en: 'subscriber/interop-m2m/:clientId/keys/:kid',
    },
    LABEL: {
      it: 'Gestisci chiave pubblica del client api interop',
      en: 'Manage interop api client public key',
    },
    EXACT: false,
    COMPONENT: KeyDetailsPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE: {
    PATH: { it: 'fruizione/interop-m2m/crea', en: 'subscriber/interop-m2m/create' },
    LABEL: { it: 'Crea client api interop', en: 'Create interop api client' },
    COMPONENT: ConsumerClientCreatePage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT: {
    PATH: { it: 'fruizione/interop-m2m/:clientId', en: 'subscriber/interop-m2m/:clientId' },
    LABEL: { it: 'Gestisci client api interop', en: 'Manage interop api client' },
    EXACT: true,
    COMPONENT: ConsumerClientManagePage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_INTEROP_M2M: {
    PATH: { it: 'fruizione/interop-m2m', en: 'subscriber/interop-m2m' },
    LABEL: { it: 'I tuoi client api interop', en: 'Your api interop clients' },
    COMPONENT: ConsumerClientM2MListPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE: {
    PATH: { it: 'fruizione', en: 'subscriber' },
    LABEL: { it: 'Fruizione', en: 'Subscriber' },
    REDIRECT: 'SUBSCRIBE_CATALOG_LIST',
    EXACT: true,
    COMPONENT: EmptyComponent,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PARTY_REGISTRY: {
    PATH: { it: 'ente', en: 'party' },
    LABEL: { it: 'Anagrafica ente', en: 'Party registry' },
    EXACT: true,
    COMPONENT: PartyRegistryPage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  NOT_FOUND: {
    PATH: { it: '404', en: '404' },
    LABEL: { it: 'Pagina non trovata', en: 'Page not found' },
    EXACT: true,
    COMPONENT: NotFoundPage,
    PUBLIC: true,
    AUTH_LEVELS: 'any',
  },
} as const)

const reactRouterDOMRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Redirect to="SUBSCRIBE_CATALOG_LIST" />,
    children: [
      ...getKeys(LANGUAGES).map((lang) => ({
        path: lang,
        element: <Redirect to="SUBSCRIBE_CATALOG_LIST" />,
      })),
    ],
  },
  {
    path: '/*',
    element: <Redirect to="NOT_FOUND" />,
  },
]

getKeys(LANGUAGES).forEach((lang) => {
  const langRoutes = getKeys(routes).reduce((acc, next) => {
    const accCopy = [...acc]
    const route = routes[next]
    let Component = <route.COMPONENT />

    if ('REDIRECT' in route) {
      Component = <Redirect to={route.REDIRECT} />
    }

    accCopy.push({
      path: route.PATH[lang],
      element: Component,
    })

    return accCopy
  }, [] as Array<RouteObject>)

  reactRouterDOMRoutes.push({
    path: lang,
    element: <RoutesWrapper />,
    children: langRoutes,
  })
})

export const router = createBrowserRouter(reactRouterDOMRoutes, { basename: '/ui' })
