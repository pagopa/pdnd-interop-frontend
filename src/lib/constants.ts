import { DisplayLogsType, RoutesObject } from '../../types'
import { ChooseParty } from '../views/ChooseParty'
import { ClientEdit } from '../views/ClientEdit'
import { ClientList } from '../views/ClientList'
import { AgreementEdit } from '../views/AgreementEdit'
import { AgreementList } from '../views/AgreementList'
import { EServiceCatalog } from '../views/EServiceCatalog'
import { EServiceWrite } from '../views/EServiceWrite'
import { EServiceRead } from '../views/EServiceRead'
import { EServiceList } from '../views/EServiceList'
import { Help } from '../views/Help'
import { Login } from '../views/Login'
import { Logout } from '../views/Logout'
import { Notifications } from '../views/Notifications'
import { Onboarding } from '../views/Onboarding'
import { CompleteRegistration } from '../views/CompleteRegistration'
import { RejectRegistration } from '../views/RejectRegistration'
import { Profile } from '../views/Profile'
import { Provide } from '../views/Provide'
import { Subscribe } from '../views/Subscribe'
import { UserEdit } from '../views/UserEdit'
import { UserList } from '../views/UserList'

export const USE_LOCAL_DATA = false
export const USE_LOCAL_DATA_RESPONSE_STATUS = 200 // The response status code to simulate if USE_LOCAL_DATA is true
export const DISPLAY_LOGS: DisplayLogsType = 'all'

export const ROUTES: RoutesObject = {
  LOGIN: { PATH: '/login', LABEL: 'Login', COMPONENT: Login },
  LOGOUT: { PATH: '/logout', LABEL: 'Logout', COMPONENT: Logout },
  HELP: { PATH: '/aiuto', LABEL: 'Serve aiuto?', COMPONENT: Help },
  CHOOSE_PARTY: { PATH: '/scelta', LABEL: 'Scegli ente', COMPONENT: ChooseParty },
  ONBOARDING: {
    PATH: '/onboarding',
    LABEL: 'Onboarding',
    EXACT: true,
    COMPONENT: Onboarding,
  },
  REGISTRATION_FINALIZE_COMPLETE: {
    PATH: '/conferma-registrazione',
    LABEL: 'Completa la procedura di onboarding',
    COMPONENT: CompleteRegistration,
  },
  REGISTRATION_FINALIZE_REJECT: {
    PATH: '/cancella-registrazione',
    LABEL: 'Cancella la procedura di onboarding',
    COMPONENT: RejectRegistration,
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
        PATH: '/erogazione/e-service/crea',
        EXACT: true,
        LABEL: 'Crea nuovo e-service',
        COMPONENT: EServiceWrite,
      },
      ESERVICE_EDIT: {
        PATH: '/erogazione/e-service/:id',
        EXACT: false,
        LABEL: 'Ispeziona e-service',
        COMPONENT: EServiceRead,
      },
      AGREEMENT_LIST: {
        PATH: '/erogazione/accordi',
        EXACT: true,
        LABEL: 'Gestisci accordi',
        COMPONENT: AgreementList,
      },
      AGREEMENT_EDIT: {
        PATH: '/erogazione/accordi/:id',
        EXACT: false,
        LABEL: 'Modifica accordo',
        COMPONENT: AgreementEdit,
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
      AGREEMENT_LIST: {
        PATH: '/fruizione/accordi',
        EXACT: true,
        LABEL: 'Gestisci accordi',
        COMPONENT: AgreementList,
      },
      AGREEMENT_EDIT: {
        PATH: '/fruizione/accordi/:id',
        EXACT: false,
        LABEL: 'Modifica accordo',
        COMPONENT: AgreementEdit,
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
        COMPONENT: EServiceRead,
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
    SHOULD_CALL: true,
  },
  ONBOARDING_GET_AVAILABLE_PARTIES: {
    URL: 'pdnd-interop-uservice-party-process/0.0.1/onboarding/info/{{taxCode}}',
    LOCAL: 'get-available-parties.json',
    SHOULD_CALL: true,
  },
  ONBOARDING_GET_SEARCH_PARTIES: {
    URL: 'pdnd-interop-uservice-party-registry-proxy/0.0.1/institutions',
    LOCAL: 'get-all-parties.json',
    SHOULD_CALL: true,
  },
  ONBOARDING_POST_LEGALS: {
    URL: 'pdnd-interop-uservice-party-process/0.0.1/onboarding/legals',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ONBOARDING_COMPLETE_REGISTRATION: {
    URL: 'pdnd-interop-uservice-party-process/0.0.1/onboarding/complete/{{token}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_GET_LIST: {
    URL: 'pdnd-interop-uservice-catalog-management/0.0.1/eservices',
    LOCAL: 'get-eservice-list.json',
    SHOULD_CALL: true,
  },
  ESERVICE_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-catalog-management/0.0.1/eservices/{{eserviceId}}',
    LOCAL: 'get-eservice-list.json',
    SHOULD_CALL: true,
  },
  ESERVICE_CREATE: {
    URL: 'pdnd-interop-uservice-catalog-management/0.0.1/eservices',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_PUBLISH: {
    URL: '/pdnd-interop-uservice-catalog-management/0.0.1/eservices/{{eserviceId}}/descriptors/{{descriptorId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_POST_DESCRIPTOR_DOCUMENTS: {
    URL: 'pdnd-interop-uservice-catalog-management/0.0.1/eservices/{{eserviceId}}/descriptors/{{descriptorId}}/documents',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ATTRIBUTES_GET_LIST: {
    URL: 'pdnd-interop-uservice-attribute-registry-management/0.0.1/attributes',
    LOCAL: 'get-attributes-list.json',
    SHOULD_CALL: true,
  },
  ATTRIBUTES_CREATE: {
    URL: 'pdnd-interop-uservice-attribute-registry-management/0.0.1/attributes',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  PARTY_GET_PARTY_ID: {
    URL: 'pdnd-interop-uservice-party-management/0.0.1/organizations/{{institutionId}}',
    LOCAL: 'get-party-id.json',
    SHOULD_CALL: true,
  },
  AGREEMENT_GET_LIST: {
    URL: 'pdnd-interop-uservice-agreement-management/0.0.1/agreements',
    LOCAL: 'get-agreement-list.json',
    SHOULD_CALL: true,
  },
  AGREEMENT_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-agreement-management/0.0.1/agreement/{{agreementId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.0.1/agreement/{{agreementId}}/attribute/{{attributeId}}/verify',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  AGREEMENT_ACTIVATE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.0.1/agreement/{{agreementId}}/activate',
    LOCAL: '',
    SHOULD_CALL: true,
  },
}

export const ESERVICE_STATUS = {
  active: 'attivo',
  draft: 'in bozza',
  suspended: 'sospeso',

  // Not implemented yet
  archived: 'archiviato',
  deprecated: 'deprecato',
}

export const AGREEMENT_STATUS = {
  active: 'attivo',
  suspended: 'sospeso',
  pending: 'in attesa di approvazione',
}
