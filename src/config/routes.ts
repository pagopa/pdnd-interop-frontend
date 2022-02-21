import { RouteConfig, MappedRouteConfig } from '../../types'
import { decorateRouteWithParents } from '../lib/router-utils'
import { ChooseParty } from '../views/ChooseParty'
import { ClientEdit } from '../views/ClientEdit'
import { ClientList } from '../views/ClientList'
import { AgreementEdit } from '../views/AgreementEdit'
import { AgreementList } from '../views/AgreementList'
import { EServiceCatalog } from '../views/EServiceCatalog'
import { EServiceList } from '../views/EServiceList'
import { Help } from '../views/Help'
import { Logout } from '../views/Logout'
import { Notifications } from '../views/Notifications'
import { Profile } from '../views/Profile'
import { UserEdit } from '../views/UserEdit'
import { UserList } from '../views/UserList'
import { UserCreate } from '../views/UserCreate'
import { ClientCreate } from '../views/ClientCreate'
import { SecurityKeyGuide } from '../views/SecurityKeyGuide'
import { EmptyComponent } from '../components/Shared/EmptyComponent'
import { KeyEdit } from '../views/KeyEdit'
import { PurposeList } from '../views/PurposeList'
import { PurposeView } from '../views/PurposeView'
import { PurposeCreate } from '../views/PurposeCreate'
import { EServiceRead } from '../views/EServiceRead'
import { EServiceCreate } from '../views/EServiceCreate'
import { EServiceManage } from '../views/EServiceManage'

export const BASIC_ROUTES: Record<string, RouteConfig> = {
  LOGOUT: {
    PATH: { it: '/it/logout' },
    LABEL: { it: 'Logout' },
    COMPONENT: Logout,
    PUBLIC: true,
  },
  HELP: {
    PATH: { it: '/it/aiuto' },
    LABEL: { it: 'Serve aiuto?' },
    COMPONENT: Help,
    PUBLIC: true,
  },
  SECURITY_KEY_GUIDE: {
    PATH: { it: '/it/generazione-chiavi' },
    LABEL: { it: 'Come caricare le chiavi di sicurezza' },
    COMPONENT: SecurityKeyGuide,
    PUBLIC: true,
  },
  CHOOSE_PARTY: {
    PATH: { it: '/it/scelta' },
    LABEL: { it: 'Scegli ente' },
    COMPONENT: ChooseParty,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  PROFILE: {
    PATH: { it: '/it/profilo' },
    LABEL: { it: 'Profilo' },
    COMPONENT: Profile,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  NOTIFICATION: {
    PATH: { it: '/it/notifiche' },
    LABEL: { it: 'Notifiche' },
    COMPONENT: Notifications,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  PROVIDE_ESERVICE_CREATE: {
    PATH: { it: '/it/erogazione/e-service/crea' },
    LABEL: { it: 'Crea e-service' },
    EXACT: true,
    COMPONENT: EServiceCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_EDIT: {
    PATH: { it: '/it/erogazione/e-service/:eserviceId/:descriptorId/modifica' },
    LABEL: { it: 'Modifica e-service' },
    EXACT: false,
    COMPONENT: EServiceCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_MANAGE: {
    PATH: { it: '/it/erogazione/e-service/:eserviceId/:descriptorId' },
    LABEL: { it: 'Visualizza e-service' },
    EXACT: false,
    COMPONENT: EServiceManage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_LIST: {
    PATH: { it: '/it/erogazione/e-service' },
    LABEL: { it: 'I tuoi e-service' },
    EXACT: true,
    COMPONENT: EServiceList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_AGREEMENT_EDIT: {
    PATH: { it: '/it/erogazione/accordi/:agreementId' },
    LABEL: { it: 'Gestisci accordo' },
    EXACT: false,
    COMPONENT: AgreementEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_AGREEMENT_LIST: {
    PATH: { it: '/it/erogazione/accordi' },
    LABEL: { it: 'I tuoi accordi' },
    EXACT: true,
    COMPONENT: AgreementList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_OPERATOR_CREATE: {
    PATH: { it: '/it/erogazione/operatori/crea' },
    LABEL: { it: 'Crea operatore API' },
    EXACT: false,
    COMPONENT: UserCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_OPERATOR_EDIT: {
    PATH: { it: '/it/erogazione/operatori/:operatorId' },
    LABEL: { it: 'Gestisci operatore API' },
    EXACT: false,
    COMPONENT: UserEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_OPERATOR_LIST: {
    PATH: { it: '/it/erogazione/operatori' },
    LABEL: { it: 'I tuoi operatori API' },
    EXACT: true,
    COMPONENT: UserList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE: {
    PATH: { it: '/it/erogazione' },
    LABEL: { it: 'Erogazione' },
    REDIRECT: { it: '/it/erogazione/e-service' },
    EXACT: true,
    COMPONENT: EmptyComponent,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  SUBSCRIBE_CATALOG_VIEW: {
    PATH: { it: '/it/fruizione/catalogo-e-service/:eserviceId/:descriptorId' },
    LABEL: { it: 'Visualizza e-service' },
    EXACT: false,
    COMPONENT: EServiceRead,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CATALOG_LIST: {
    PATH: { it: '/it/fruizione/catalogo-e-service' },
    LABEL: { it: 'E-service disponibili' },
    EXACT: false,
    COMPONENT: EServiceCatalog,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_PURPOSE_CREATE: {
    PATH: { it: '/it/fruizione/finalita/crea' },
    LABEL: { it: 'Crea finalità' },
    EXACT: false,
    COMPONENT: PurposeCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_EDIT: {
    PATH: { it: '/it/fruizione/finalita/:purposeId/modifica' },
    LABEL: { it: 'Modifica finalità' },
    EXACT: false,
    COMPONENT: PurposeCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_VIEW: {
    PATH: { it: '/it/fruizione/finalita/:purposeId' },
    LABEL: { it: 'Modifica finalità' },
    EXACT: false,
    COMPONENT: PurposeView,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_LIST: {
    PATH: { it: '/it/fruizione/finalita' },
    LABEL: { it: 'Le tue finalità' },
    EXACT: false,
    COMPONENT: PurposeList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_OPERATOR_CREATE: {
    PATH: { it: '/it/fruizione/client/:clientId/operatori/crea' },
    LABEL: { it: 'Crea operatore di sicurezza' },
    EXACT: false,
    COMPONENT: UserCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_OPERATOR_EDIT: {
    PATH: { it: '/it/fruizione/client/:clientId/operatori/:operatorId' },
    LABEL: { it: 'Gestisci operatore del client' },
    EXACT: false,
    COMPONENT: UserEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_KEY_EDIT: {
    PATH: { it: '/it/fruizione/client/:clientId/chiavi/:kid' },
    LABEL: { it: 'Gestisci chiave pubblica del client' },
    EXACT: false,
    COMPONENT: KeyEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_CREATE: {
    PATH: { it: '/it/fruizione/client/crea' },
    LABEL: { it: 'Crea client' },
    EXACT: false,
    COMPONENT: ClientCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_EDIT: {
    PATH: { it: '/it/fruizione/client/:clientId' },
    LABEL: { it: 'Gestisci client' },
    EXACT: true,
    COMPONENT: ClientEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_LIST: {
    PATH: { it: '/it/fruizione/client' },
    LABEL: { it: 'I tuoi client' },
    EXACT: false,
    COMPONENT: ClientList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_AGREEMENT_EDIT: {
    PATH: { it: '/it/fruizione/accordi/:agreementId' },
    LABEL: { it: 'Gestisci accordo' },
    EXACT: false,
    COMPONENT: AgreementEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_AGREEMENT_LIST: {
    PATH: { it: '/it/fruizione/accordi' },
    LABEL: { it: 'I tuoi accordi' },
    EXACT: true,
    COMPONENT: AgreementList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE: {
    PATH: { it: '/it/fruizione' },
    LABEL: { it: 'Fruizione' },
    REDIRECT: { it: '/it/fruizione/catalogo-e-service' },
    EXACT: true,
    COMPONENT: EmptyComponent,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
}

export const ROUTES = {} as Record<string, MappedRouteConfig>
// decorateRouteWithParents(BASIC_ROUTES as Record<string, MappedRouteConfig>)
