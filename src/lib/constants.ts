import { DisplayLogsType, RoutesObject, RunActionProps } from '../../types'
import { ChooseParty } from '../views/ChooseParty'
import { ClientEdit } from '../views/ClientEdit'
import { ClientList } from '../views/ClientList'
import { AgreementEdit } from '../views/AgreementEdit'
import { AgreementList } from '../views/AgreementList'
import { EServiceCatalog } from '../views/EServiceCatalog'
import { EServiceWrite } from '../views/EServiceWrite'
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
import { EServiceGate } from '../views/EServiceGate'
import { UserCreate } from '../views/UserCreate'
import { TempSPIDUser } from '../components/TempSPIDUser'

export const SHOW_DEV_LABELS = true
export const USE_SPID_USER_LORENZO_CARMILLI = true
export const USE_LOCAL_DATA = false
export const USE_LOCAL_DATA_RESPONSE_STATUS = 200 // The response status code to simulate if USE_LOCAL_DATA is true
export const DISPLAY_LOGS: DisplayLogsType = 'all'

export const ROUTES: RoutesObject = {
  LOGIN: { PATH: '/login', LABEL: 'Login', COMPONENT: Login },
  LOGOUT: { PATH: '/logout', LABEL: 'Logout', COMPONENT: Logout },
  HELP: { PATH: '/aiuto', LABEL: 'Serve aiuto?', COMPONENT: Help },
  TEMP_SPID_USER: {
    PATH: '/temp-spid',
    LABEL: 'Genera utente SPID di test',
    COMPONENT: TempSPIDUser,
  },
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
        COMPONENT: EServiceGate,
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
      USER_LIST: {
        PATH: '/erogazione/operatori',
        EXACT: true,
        LABEL: 'Gestisci operatori API',
        COMPONENT: UserList,
      },
      USER_CREATE: {
        PATH: '/erogazione/operatori/crea',
        EXACT: false,
        LABEL: 'Crea nuovo operatore API',
        COMPONENT: UserCreate,
      },
      USER_EDIT: {
        PATH: '/erogazione/operatori/:id',
        EXACT: false,
        LABEL: 'Modifica operatore API',
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
        EXACT: true,
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
        COMPONENT: EServiceGate,
      },
      USER_LIST: {
        PATH: '/fruizione/client/operatori',
        EXACT: true,
        LABEL: 'Gestisci operatori',
        COMPONENT: UserList,
      },
      USER_CREATE: {
        PATH: '/fruizione/client/operatori/crea',
        EXACT: false,
        LABEL: 'Crea nuovo operatore di sicurezza',
        COMPONENT: UserCreate,
      },
      USER_EDIT: {
        PATH: '/fruizione/client/operatori/:id',
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
    URL: 'pdnd-interop-uservice-catalog-process/wrong-version/eservices',
    LOCAL: 'get-eservice-list.json',
    SHOULD_CALL: true,
  },
  ESERVICE_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-catalog-process/wrong-version/eservices/{{eserviceId}}',
    LOCAL: 'get-eservice-list.json',
    SHOULD_CALL: true,
  },
  ESERVICE_CREATE: {
    URL: 'pdnd-interop-uservice-catalog-process/wrong-version/eservices',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_PUBLISH: {
    URL: 'pdnd-interop-uservice-catalog-process/wrong-version/eservices/{{eserviceId}}/descriptors/{{descriptorId}}/publish',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_DRAFT_DELETE: {
    URL: 'pdnd-interop-uservice-catalog-process/wrong-version/eservices/{{eserviceId}}/descriptors/{{descriptorId}}',
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
  ATTRIBUTE_CREATE: {
    URL: 'pdnd-interop-uservice-attribute-registry-management/0.0.1/attribute',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  PARTY_GET_PARTY_ID: {
    URL: 'pdnd-interop-uservice-party-management/0.0.1/organizations/{{institutionId}}',
    LOCAL: 'get-party-id.json',
    SHOULD_CALL: true,
  },
  AGREEMENT_CREATE: {
    URL: 'pdnd-interop-uservice-agreement-management/0.0.1/agreements',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  AGREEMENT_GET_LIST: {
    URL: 'pdnd-interop-uservice-agreement-management/0.0.1/agreements',
    LOCAL: 'get-agreement-list.json',
    SHOULD_CALL: true,
  },
  AGREEMENT_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-agreement-management/0.0.1/agreement/{{agreementId}}',
    LOCAL: 'get-agreement-single.json',
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
  AGREEMENT_SUSPEND: {
    URL: 'pdnd-interop-uservice-agreement-management/0.0.1/agreements/{{agreementId}}/suspend',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  CLIENT_GET_LIST: {
    URL: 'TODO',
    LOCAL: 'get-client-list.json',
    SHOULD_CALL: false,
  },
  CLIENT_GET_SINGLE: {
    URL: 'TODO',
    LOCAL: 'get-client-single.json',
    SHOULD_CALL: false,
  },
  USER_GET_LIST: {
    URL: 'TODO',
    LOCAL: 'get-user-list.json',
    SHOULD_CALL: false,
  },
  USER_GET_SINGLE: {
    URL: 'TODO',
    LOCAL: 'get-user-single.json',
    SHOULD_CALL: false,
  },
  USER_CREATE: {
    URL: 'pdnd-interop-uservice-party-process/0.0.1/onboarding/operators',
    LOCAL: '',
    SHOULD_CALL: true,
  },
}

export const TOAST_CONTENTS: { [key in keyof typeof API]: RunActionProps } = {
  BASE: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ONBOARDING_GET_AVAILABLE_PARTIES: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ONBOARDING_GET_SEARCH_PARTIES: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ONBOARDING_POST_LEGALS: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ONBOARDING_COMPLETE_REGISTRATION: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ESERVICE_GET_LIST: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ESERVICE_GET_SINGLE: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ESERVICE_CREATE: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ESERVICE_VERSION_PUBLISH: {
    loadingText: 'Stiamo pubblicando la versione in bozza',
    success: {
      title: 'Nuova versione disponibile',
      description: 'La nuova versione del servizio è stata pubblicata correttamente',
    },
    error: {
      title: 'Errore',
      description:
        'Si è verificato un errore, non è stato possibile pubblicare la nuova versione del servizio',
    },
  },
  ESERVICE_DRAFT_DELETE: {
    loadingText: 'Stiamo cancellando la bozza',
    success: {
      title: 'Bozza cancellata correttamente',
      description: 'La bozza è stata cancellata correttamente',
    },
    error: {
      title: 'Errore',
      description: 'Si è verificato un errore, non è stato possibile cancellare la bozza',
    },
  },
  ESERVICE_POST_DESCRIPTOR_DOCUMENTS: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ATTRIBUTES_GET_LIST: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  ATTRIBUTE_CREATE: {
    loadingText: 'Operazione in corso',
    success: {
      title: 'Attributo creato correttamente',
      description: "Adesso puoi aggiungere l'attributo al tuo servizio",
    },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  PARTY_GET_PARTY_ID: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  AGREEMENT_CREATE: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  AGREEMENT_GET_LIST: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  AGREEMENT_GET_SINGLE: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    loadingText: "Stiamo verificando l'attributo",
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  AGREEMENT_ACTIVATE: {
    loadingText: "Stiamo attivando l'accordo",
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  AGREEMENT_SUSPEND: {
    loadingText: "Stiamo sospendendo l'accordo",
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  CLIENT_GET_LIST: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  CLIENT_GET_SINGLE: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  USER_GET_LIST: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  USER_GET_SINGLE: {
    loadingText: 'Operazione in corso',
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  USER_CREATE: {
    loadingText: 'Stiamo creando il nuovo operatore',
    success: {
      title: "C'è un nuovo operatore",
      description: 'Nuovo operatore creato correttamente',
    },
    error: {
      title: 'Errore',
      description:
        "Non è stato possibile creare il nuovo operatore. Assicurarsi che non esista già l'utenza ed eventualmente ritentare",
    },
  },
}

export const ESERVICE_STATUS_LABEL = {
  published: 'attivo',
  draft: 'in bozza',
  suspended: 'sospeso',

  // Not implemented yet
  archived: 'archiviato',
  deprecated: 'deprecato',
}

export const ATTRIBUTE_TYPE_LABEL = {
  certified: 'certificati',
  verified: 'verificati',
  declared: 'dichiarati',
}

export const AGREEMENT_STATUS_LABEL = {
  active: 'attivo',
  suspended: 'sospeso',
  pending: 'in attesa di approvazione',
}

export const CLIENT_STATUS_LABEL = {
  active: 'attivo',
  suspended: 'sospeso',
}

export const USER_STATUS_LABEL = {
  active: 'attivo',
  suspended: 'sospeso',
}

export const USER_ROLE_LABEL = {
  Manager: 'Manager',
  Delegate: 'Delegato',
  Operator: 'Operatore',
}

export const USER_PLATFORM_ROLE_LABEL = {
  admin: 'Amministratore',
  security: 'Operatore di sicurezza',
  api: 'Operatore API',
}
