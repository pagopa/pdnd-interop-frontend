import React from 'react'
import { type InferRouteKey, generateRoutes } from '@pagopa/interop-fe-commons'
import { createBrowserRouter } from 'react-router-dom'
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
  ConsumerClientManagePage,
  ConsumerPurposeEditPage,
  ProviderEServiceCreatePage,
  ProviderPurposesListPage,
  ConsumerPurposeDetailsPage,
  ConsumerDebugVoucherPage,
} from '@/pages'
import RoutesWrapper from './components/RoutesWrapper'

export const { routes, reactRouterDOMRoutes, hooks, components, utils } = generateRoutes(
  {
    LOGOUT: {
      path: '/logout',
      element: <LogoutPage />,
      public: true,
      authLevels: ['admin', 'api', 'security'],
    },
    TOS: {
      path: '/termini-di-servizio',
      element: <TOSPage />,
      public: true,
      authLevels: ['admin', 'api', 'security'],
    },
    SECURITY_KEY_GUIDE: {
      path: '/generazione-chiavi',
      element: <SecurityKeyGuidePage />,
      public: false,
      authLevels: ['admin', 'api', 'security'],
    },
    NOTIFICATION: {
      path: '/notifiche',
      element: <NotificationsPage />,
      public: false,
      authLevels: ['admin', 'api', 'security'],
    },
    PROVIDE_ESERVICE_CREATE: {
      path: '/erogazione/e-service/crea',
      element: <ProviderEServiceCreatePage />,
      public: false,
      authLevels: ['admin', 'api'],
    },
    PROVIDE_ESERVICE_EDIT: {
      path: '/erogazione/e-service/:eserviceId/:descriptorId/modifica',
      element: <ProviderEServiceCreatePage />,
      public: false,
      authLevels: ['admin', 'api'],
    },
    PROVIDE_ESERVICE_MANAGE: {
      path: '/erogazione/e-service/:eserviceId/:descriptorId',
      element: <ProviderEServiceDetailsPage />,
      public: false,
      authLevels: ['admin', 'api'],
    },
    PROVIDE_ESERVICE_LIST: {
      path: '/erogazione/e-service',
      element: <ProviderEServiceListPage />,
      public: false,
      authLevels: ['admin', 'api'],
    },
    PROVIDE_AGREEMENT_READ: {
      path: '/erogazione/richieste/:agreementId',
      element: <ProviderAgreementDetailsPage />,
      public: false,
      authLevels: ['admin', 'api'],
    },
    PROVIDE_AGREEMENT_LIST: {
      path: '/erogazione/richieste',
      element: <ProviderAgreementsListPage />,
      public: false,
      authLevels: ['admin', 'api'],
    },
    PROVIDE_PURPOSE_LIST: {
      path: '/erogazione/finalita',
      element: <ProviderPurposesListPage />,
      public: false,
      authLevels: ['admin', 'api'],
    },
    PROVIDE_PURPOSE_DETAILS: {
      path: '/erogazione/finalita/:purposeId',
      element: <ProviderPurposeDetailsPage />,
      public: false,
      authLevels: ['admin', 'api'],
    },
    PROVIDE: {
      path: '/erogazione',
      redirect: 'PROVIDE_ESERVICE_LIST',
      public: false,
      authLevels: ['admin', 'api'],
    },
    SUBSCRIBE_CATALOG_VIEW: {
      path: '/fruizione/catalogo-e-service/:eserviceId/:descriptorId',
      element: <ConsumerEServiceDetailsPage />,
      public: false,
      authLevels: ['admin', 'security', 'api'],
    },
    SUBSCRIBE_CATALOG_LIST: {
      path: '/fruizione/catalogo-e-service',
      element: <ConsumerEServiceCatalogPage />,
      public: false,
      authLevels: ['admin', 'security', 'api'],
    },
    SUBSCRIBE_PURPOSE_CREATE: {
      path: '/fruizione/finalita/crea',
      element: <ConsumerPurposeCreatePage />,
      public: false,
      authLevels: ['admin'],
    },
    SUBSCRIBE_PURPOSE_EDIT: {
      path: '/fruizione/finalita/:purposeId/modifica',
      element: <ConsumerPurposeEditPage />,
      public: false,
      authLevels: ['admin'],
    },
    SUBSCRIBE_PURPOSE_DETAILS: {
      path: '/fruizione/finalita/:purposeId',
      element: <ConsumerPurposeDetailsPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_PURPOSE_LIST: {
      path: '/fruizione/finalita',
      element: <ConsumerPurposesListPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_CLIENT_OPERATOR_EDIT: {
      path: '/fruizione/client/:clientId/operatori/:operatorId',
      element: <OperatorDetailsPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_CLIENT_KEY_EDIT: {
      path: '/fruizione/client/:clientId/chiavi/:kid',
      element: <KeyDetailsPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_CLIENT_CREATE: {
      path: '/fruizione/client/crea',
      element: <ConsumerClientCreatePage />,
      public: false,
      authLevels: ['admin'],
    },
    SUBSCRIBE_CLIENT_EDIT: {
      path: '/fruizione/client/:clientId',
      element: <ConsumerClientManagePage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_CLIENT_LIST: {
      path: '/fruizione/client',
      element: <ConsumerClientListPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_AGREEMENT_READ: {
      path: '/fruizione/richieste/:agreementId',
      element: <ConsumerAgreementDetailsPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_AGREEMENT_LIST: {
      path: '/fruizione/richieste',
      element: <ConsumerAgreementsListPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_AGREEMENT_EDIT: {
      path: '/fruizione/richieste/:agreementId/modifica',
      element: <ConsumerAgreementCreatePage />,
      public: false,
      authLevels: ['admin'],
    },
    SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT: {
      path: '/fruizione/interop-m2m/:clientId/operatori/:operatorId',
      element: <OperatorDetailsPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT: {
      path: '/fruizione/interop-m2m/:clientId/chiavi/:kid',
      element: <KeyDetailsPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE: {
      path: '/fruizione/interop-m2m/crea',
      element: <ConsumerClientCreatePage />,
      public: false,
      authLevels: ['admin'],
    },
    SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT: {
      path: '/fruizione/interop-m2m/:clientId',
      element: <ConsumerClientManagePage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE_INTEROP_M2M: {
      path: '/fruizione/interop-m2m',
      element: <ConsumerClientM2MListPage />,
      public: false,
      authLevels: ['admin', 'security'],
    },
    SUBSCRIBE: {
      path: '/fruizione',
      redirect: 'SUBSCRIBE_CATALOG_LIST',
      public: false,
      authLevels: ['admin', 'security'],
    },
    PARTY_REGISTRY: {
      path: '/ente',
      element: <PartyRegistryPage />,
      public: false,
      authLevels: ['admin', 'api', 'security'],
    },
    NOT_FOUND: {
      path: '/404',
      element: <NotFoundPage />,
      public: true,
      authLevels: ['admin', 'api', 'security'],
    },
    DEFAULT: {
      path: '/',
      redirect: 'SUBSCRIBE_CATALOG_LIST',
      public: true,
      authLevels: ['admin', 'api', 'security'],
    },
    SUBSCRIBE_DEBUG_VOUCHER: {
      path: '/fruizione/debug-voucher',
      element: <ConsumerDebugVoucherPage />,
      public: false,
      authLevels: ['admin'],
    },
  },
  { languages: ['it', 'en'] }
)

export type RouteKey = InferRouteKey<typeof routes>

export const router = createBrowserRouter(
  [
    { element: <RoutesWrapper />, children: reactRouterDOMRoutes },
    { path: '/', element: <components.Redirect to="SUBSCRIBE_CATALOG_LIST" /> },
    { path: '/*', element: <components.Redirect to="NOT_FOUND" /> },
  ],
  { basename: '/ui' }
)
