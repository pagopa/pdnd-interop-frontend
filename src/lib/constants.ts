import { ChooseParty } from '../views/ChooseParty'
import { ClientEdit } from '../views/ClientEdit'
import { ClientList } from '../views/ClientList'
import { ContractEdit } from '../views/ContractEdit'
import { ContractList } from '../views/ContractList'
import { EServiceCatalog } from '../views/EServiceCatalog'
import { EServiceCatalogEntry } from '../views/EServiceCatalogEntry'
import { EServiceCreate } from '../views/EServiceCreate'
import { EServiceEdit } from '../views/EServiceEdit'
import { EServiceList } from '../views/EServiceList'
import { Help } from '../views/Help'
import { Login } from '../views/Login'
import { Logout } from '../views/Logout'
import { Notifications } from '../views/Notifications'
import { Onboarding } from '../views/Onboarding'
import { Profile } from '../views/Profile'
import { Provide } from '../views/Provide'
import { Subscribe } from '../views/Subscribe'
import { UserEdit } from '../views/UserEdit'
import { UserList } from '../views/UserList'

export const ROUTES = {
  ROOT: { PATH: '/', LABEL: 'Home' },
  LOGIN: { PATH: '/login', LABEL: 'Login', COMPONENT: Login },
  LOGOUT: { PATH: '/logout', LABEL: 'Logout', COMPONENT: Logout },
  HELP: { PATH: '/aiuto', LABEL: 'Aiuto', COMPONENT: Help },
  CHOOSE_PARTY: { PATH: '/scelta', LABEL: 'Scegli ente', COMPONENT: ChooseParty },
  ONBOARDING: { PATH: '/onboarding', LABEL: 'Onboarding', COMPONENT: Onboarding },
  PROFILE: { PATH: '/profilo', LABEL: 'Profilo', COMPONENT: Profile },
  NOTIFICATION: { PATH: '/notifiche', LABEL: 'Notifiche', COMPONENT: Notifications },
  PROVIDE: {
    PATH: '/erogazione',
    LABEL: 'Erogazione',
    COMPONENT: Provide,
    SUBROUTES: {
      ESERVICE_LIST: {
        PATH: '/erogazione/e-service',
        EXACT: true,
        LABEL: 'Gestisci e-service',
        COMPONENT: EServiceList,
      },
      ESERVICE_CREATE: {
        PATH: '/erogazione/crea-e-service',
        EXACT: true,
        LABEL: 'Crea e-service',
        COMPONENT: EServiceCreate,
      },
      ESERVICE_EDIT: {
        PATH: '/erogazione/e-service/:id',
        EXACT: false,
        LABEL: 'Modifica e-service',
        COMPONENT: EServiceEdit,
      },
      CONTRACT_LIST: {
        PATH: '/erogazione/accordi',
        EXACT: true,
        LABEL: 'Gestisci accordi',
        COMPONENT: ContractList,
      },
      CONTRACT_EDIT: {
        PATH: '/erogazione/accordi/:id',
        EXACT: false,
        LABEL: 'Modifica accordo',
        COMPONENT: ContractEdit,
      },
      USERS_LIST: {
        PATH: '/erogazione/operatori',
        EXACT: true,
        LABEL: 'Gestisci operatori',
        COMPONENT: UserList,
      },
      USERS_EDIT: {
        PATH: '/erogazione/operatori/:id',
        EXACT: false,
        LABEL: 'Modifica operatore',
        COMPONENT: UserEdit,
      },
    },
  },
  SUBSCRIBE: {
    PATH: '/fruizione',
    LABEL: 'Fruizione',
    COMPONENT: Subscribe,
    SUBROUTES: {
      CLIENT_LIST: {
        PATH: '/fruizione/client',
        EXACT: true,
        LABEL: 'Gestisci client',
        COMPONENT: ClientList,
      },
      CLIENT_EDIT: {
        PATH: '/fruizione/client/:id',
        EXACT: false,
        LABEL: 'Modifica client',
        COMPONENT: ClientEdit,
      },
      CONTRACT_LIST: {
        PATH: '/fruizione/accordi',
        EXACT: true,
        LABEL: 'Gestisci accordi',
        COMPONENT: ContractList,
      },
      CONTRACT_EDIT: {
        PATH: '/fruizione/accordi/:id',
        EXACT: false,
        LABEL: 'Modifica accordo',
        COMPONENT: ContractEdit,
      },
      CATALOG_LIST: {
        PATH: '/fruizione/catalogo-e-service',
        EXACT: true,
        LABEL: 'Catalogo e-service',
        COMPONENT: EServiceCatalog,
      },
      CATALOG_VIEW: {
        PATH: '/fruizione/catalogo-e-service/:id',
        EXACT: false,
        LABEL: 'Visualizza e-service',
        COMPONENT: EServiceCatalogEntry,
      },
      USERS_LIST: {
        PATH: '/fruizione/operatori',
        EXACT: true,
        LABEL: 'Gestisci operatori',
        COMPONENT: UserList,
      },
      USERS_EDIT: {
        PATH: '/fruizione/operatori/:id',
        EXACT: false,
        LABEL: 'Modifica operatore',
        COMPONENT: UserEdit,
      },
    },
  },
}

export const testUser = {
  name: 'Mario',
  surname: 'Rossi',
  cf: 'RSSMRI43R12M100E',
  mail: 'mario.rossi@comune.sassari.it',
}

export const testParties = [
  {
    name: 'Comune di Sassari',
    mail: 'info@comune.sassari.it',
  },
  {
    name: 'Comune di Olbia',
    mail: 'info@comune.olbia.it',
  },
]
