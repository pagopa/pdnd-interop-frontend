import { BasicRouteConfig, RouteConfig } from '../../types'
import { decorateRouteWithParents } from '../lib/router-utils'
import { ChooseParty } from '../views/ChooseParty'
import { ClientEdit } from '../views/ClientEdit'
import { ClientList } from '../views/ClientList'
import { AgreementEdit } from '../views/AgreementEdit'
import { AgreementList } from '../views/AgreementList'
import { EServiceCatalog } from '../views/EServiceCatalog'
import { EServiceList } from '../views/EServiceList'
import { Help } from '../views/Help'
import { Login } from '../views/Login'
import { Logout } from '../views/Logout'
import { Notifications } from '../views/Notifications'
import { Onboarding } from '../views/Onboarding'
import { CompleteRegistration } from '../views/CompleteRegistration'
import { RejectRegistration } from '../views/RejectRegistration'
import { Profile } from '../views/Profile'
import { UserEdit } from '../views/UserEdit'
import { UserList } from '../views/UserList'
import { EServiceGate } from '../views/EServiceGate'
import { UserCreate } from '../views/UserCreate'
import { TempSPIDUser } from '../components/TempSPIDUser'
import { ClientCreate } from '../views/ClientCreate'
import { IPAGuide } from '../views/IPAGuide'
import { SecurityKeyGuide } from '../views/SecurityKeyGuide'
import { EmptyComponent } from '../components/Shared/EmptyComponent'

const BASIC_ROUTES: Record<string, BasicRouteConfig> = {
  LOGIN: {
    PATH: '/login',
    LABEL: 'Login',
    COMPONENT: Login,
    PUBLIC: true,
  },
  LOGOUT: {
    PATH: '/logout',
    LABEL: 'Logout',
    COMPONENT: Logout,
    PUBLIC: true,
  },
  HELP: {
    PATH: '/aiuto',
    LABEL: 'Serve aiuto?',
    COMPONENT: Help,
    PUBLIC: true,
  },
  IPA_GUIDE: {
    PATH: '/guida-ipa',
    LABEL: 'Accreditarsi su IPA',
    COMPONENT: IPAGuide,
    PUBLIC: true,
  },
  SECURITY_KEY_GUIDE: {
    PATH: '/generazione-chiavi',
    LABEL: 'Come caricare le chiavi di sicurezza',
    COMPONENT: SecurityKeyGuide,
    PUBLIC: true,
  },
  TEMP_SPID_USER: {
    PATH: '/temp-spid',
    LABEL: 'Genera utente SPID di test',
    COMPONENT: TempSPIDUser,
    PUBLIC: true,
    AUTH_LEVELS: 'any',
  },
  CHOOSE_PARTY: {
    PATH: '/scelta',
    LABEL: 'Scegli ente',
    COMPONENT: ChooseParty,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  ONBOARDING: {
    PATH: '/onboarding',
    LABEL: 'Onboarding',
    EXACT: true,
    COMPONENT: Onboarding,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  REGISTRATION_FINALIZE_COMPLETE: {
    PATH: '/conferma-registrazione',
    LABEL: 'Completa la procedura di onboarding',
    COMPONENT: CompleteRegistration,
    PUBLIC: true,
  },
  REGISTRATION_FINALIZE_REJECT: {
    PATH: '/cancella-registrazione',
    LABEL: 'Cancella la procedura di onboarding',
    COMPONENT: RejectRegistration,
    PUBLIC: true,
  },
  PROFILE: {
    PATH: '/profilo',
    LABEL: 'Profilo',
    COMPONENT: Profile,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  NOTIFICATION: {
    PATH: '/notifiche',
    LABEL: 'Notifiche',
    COMPONENT: Notifications,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  PROVIDE_ESERVICE_CREATE: {
    PATH: '/erogazione/e-service/crea',
    EXACT: true,
    LABEL: 'Crea e-service',
    COMPONENT: EServiceGate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_EDIT: {
    PATH: '/erogazione/e-service/:eserviceId/:descriptorId',
    EXACT: false,
    LABEL: 'Gestisci o visualizza e-service',
    COMPONENT: EServiceGate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_LIST: {
    PATH: '/erogazione/e-service',
    EXACT: true,
    LABEL: 'I tuoi e-service',
    COMPONENT: EServiceList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_AGREEMENT_EDIT: {
    PATH: '/erogazione/accordi/:id',
    EXACT: false,
    LABEL: 'Gestisci accordo',
    COMPONENT: AgreementEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_AGREEMENT_LIST: {
    PATH: '/erogazione/accordi',
    EXACT: true,
    LABEL: 'I tuoi accordi',
    COMPONENT: AgreementList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_OPERATOR_CREATE: {
    PATH: '/erogazione/operatori/crea',
    EXACT: false,
    LABEL: 'Crea operatore API',
    COMPONENT: UserCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_OPERATOR_EDIT: {
    PATH: '/erogazione/operatori/:id',
    EXACT: false,
    LABEL: 'Gestisci operatore API',
    COMPONENT: UserEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_OPERATOR_LIST: {
    PATH: '/erogazione/operatori',
    EXACT: true,
    LABEL: 'I tuoi operatori API',
    COMPONENT: UserList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE: {
    PATH: '/erogazione',
    LABEL: 'Erogazione',
    EXACT: true,
    REDIRECT: '/erogazione/e-service',
    COMPONENT: EmptyComponent,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  SUBSCRIBE_CATALOG_VIEW: {
    PATH: '/fruizione/catalogo-e-service/:eserviceId/:descriptorId',
    EXACT: false,
    LABEL: 'Visualizza e-service',
    COMPONENT: EServiceGate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CATALOG_LIST: {
    PATH: '/fruizione/catalogo-e-service',
    EXACT: false,
    LABEL: 'E-service disponibili',
    COMPONENT: EServiceCatalog,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_OPERATOR_CREATE: {
    PATH: '/fruizione/client/:id/operatori/crea',
    EXACT: false,
    LABEL: 'Crea operatore di sicurezza',
    COMPONENT: UserCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_OPERATOR_EDIT: {
    PATH: '/fruizione/client/:id/operatori/:operatorId',
    EXACT: false,
    LABEL: 'Gestisci operatore del client',
    COMPONENT: UserEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_CREATE: {
    PATH: '/fruizione/client/crea',
    EXACT: false,
    LABEL: 'Crea client',
    COMPONENT: ClientCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_EDIT: {
    PATH: '/fruizione/client/:id',
    EXACT: true,
    LABEL: 'Gestisci client',
    COMPONENT: ClientEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_LIST: {
    PATH: '/fruizione/client',
    EXACT: false,
    LABEL: 'I tuoi client',
    COMPONENT: ClientList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_AGREEMENT_EDIT: {
    PATH: '/fruizione/accordi/:id',
    EXACT: false,
    LABEL: 'Gestisci accordo',
    COMPONENT: AgreementEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_AGREEMENT_LIST: {
    PATH: '/fruizione/accordi',
    EXACT: true,
    LABEL: 'I tuoi accordi',
    COMPONENT: AgreementList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE: {
    PATH: '/fruizione',
    LABEL: 'Fruizione',
    EXACT: true,
    REDIRECT: '/fruizione/catalogo-e-service',
    COMPONENT: EmptyComponent,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
}

export const ROUTES = decorateRouteWithParents(BASIC_ROUTES as Record<string, RouteConfig>)
