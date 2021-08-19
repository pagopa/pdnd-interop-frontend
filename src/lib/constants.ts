import { DisplayLogsType } from '../../types'
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

export const USE_LOCAL_DATA = true
export const USE_LOCAL_DATA_RESPONSE_STATUS = 200 // The response status code to simulate if USE_LOCAL_DATA is true
export const DISPLAY_LOGS: DisplayLogsType = 'all'

export const ROUTES = {
  ROOT: { PATH: '/', LABEL: 'Home' },
  LOGIN: { PATH: '/login', LABEL: 'Login', COMPONENT: Login },
  LOGOUT: { PATH: '/logout', LABEL: 'Logout', COMPONENT: Logout },
  HELP: { PATH: '/aiuto', LABEL: 'Serve aiuto?', COMPONENT: Help },
  CHOOSE_PARTY: { PATH: '/scelta', LABEL: 'Scegli ente', COMPONENT: ChooseParty },
  ONBOARDING: {
    PATH: '/onboarding',
    LABEL: 'Onboarding',
    COMPONENT: Onboarding,
    SUBROUTES: {
      // ONBOARDING_EMAIL_SEND_SUCCESS: {
      //   PATH: '/onboarding/mail-inviata-successo',
      //   EXACT: true,
      //   LABEL: 'Successo invio mail registrazione',
      //   COMPONENT: () => OnboardingEmailSend({outcome: 'failure'})
      // },
    },
  },
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

export const API = {
  BASE: {
    URL: 'https://gateway.interop.pdnd.dev/',
    LOCAL: 'http://localhost:3000/mock-data/',
  },
  ONBOARDING_GET_AVAILABLE_PARTIES: {
    URL: 'pdnd-interop-uservice-party-process/0.0.1/onboarding/info/',
    LOCAL: 'get-available-parties.json',
  },
  ONBOARDING_GET_SEARCH_PARTIES: {
    URL: 'pdnd-interop-uservice-party-registry-proxy/0.0.1/institutions',
    LOCAL: 'get-all-parties.json',
  },
  ONBOARDING_POST_LEGALS: {
    URL: 'pdnd-interop-uservice-party-process/0.0.1/onboarding/legals',
    LOCAL: '',
  },
}

export const testUser = {
  name: 'Mario',
  surname: 'Rossi',
  taxCode: 'ab78d997-a219-4797-a884-66c6025c6bd3',
  email: 'mario.rossi@comune.sassari.it',
}
