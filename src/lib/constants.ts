import {
  DialogActionKeys,
  DialogContent,
  DisplayLogsType,
  RoutesObject,
  RunActionProps,
  ToastActionKeys,
} from '../../types'
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
import { ClientCreate } from '../views/ClientCreate'
import { IPAGuide } from '../views/IPAGuide'

export const SHOW_DEV_LABELS = process.env.NODE_ENV === 'production' ? false : true
export const USE_SPID_USER_LORENZO_CARMILLI = process.env.NODE_ENV === 'production' ? false : true
export const USE_LOCAL_DATA = false
export const USE_LOCAL_DATA_RESPONSE_STATUS = 200 // The response status code to simulate if USE_LOCAL_DATA is true
export const DISPLAY_LOGS: DisplayLogsType = 'all'

// TEMP PoC: we won't need this with the new UI
export const HARDCODED_MAIN_TAG_HEIGHT = 'calc(100vh - 86px - 101px - 3rem - 72px - 3rem)'

export const BASE_ROUTE = '/ui'

export const ROUTES: RoutesObject = {
  LOGIN: { PATH: `${BASE_ROUTE}/login`, LABEL: 'Login', COMPONENT: Login },
  LOGOUT: { PATH: `${BASE_ROUTE}/logout`, LABEL: 'Logout', COMPONENT: Logout },
  HELP: { PATH: `${BASE_ROUTE}/aiuto`, LABEL: 'Serve aiuto?', COMPONENT: Help },
  IPA_GUIDE: { PATH: `${BASE_ROUTE}/guida-ipa`, LABEL: 'Accreditarsi su IPA', COMPONENT: IPAGuide },
  TEMP_SPID_USER: {
    PATH: `${BASE_ROUTE}/temp-spid`,
    LABEL: 'Genera utente SPID di test',
    COMPONENT: TempSPIDUser,
  },
  CHOOSE_PARTY: { PATH: `${BASE_ROUTE}/scelta`, LABEL: 'Scegli ente', COMPONENT: ChooseParty },
  ONBOARDING: {
    PATH: `${BASE_ROUTE}/onboarding`,
    LABEL: 'Onboarding',
    EXACT: true,
    COMPONENT: Onboarding,
  },
  REGISTRATION_FINALIZE_COMPLETE: {
    PATH: `${BASE_ROUTE}/conferma-registrazione`,
    LABEL: 'Completa la procedura di onboarding',
    COMPONENT: CompleteRegistration,
  },
  REGISTRATION_FINALIZE_REJECT: {
    PATH: `${BASE_ROUTE}/cancella-registrazione`,
    LABEL: 'Cancella la procedura di onboarding',
    COMPONENT: RejectRegistration,
  },
  PROFILE: { PATH: `${BASE_ROUTE}/profilo`, LABEL: 'Profilo', COMPONENT: Profile },
  NOTIFICATION: { PATH: `${BASE_ROUTE}/notifiche`, LABEL: 'Notifiche', COMPONENT: Notifications },
  PROVIDE: {
    PATH: `${BASE_ROUTE}/erogazione`,
    LABEL: 'Erogazione',
    COMPONENT: Provide,
    SUBROUTES: {
      ESERVICE_LIST: {
        PATH: `${BASE_ROUTE}/erogazione/e-service`,
        EXACT: true,
        LABEL: 'Gestisci e-service',
        COMPONENT: EServiceList,
      },
      ESERVICE_CREATE: {
        PATH: `${BASE_ROUTE}/erogazione/e-service/crea`,
        EXACT: true,
        LABEL: 'Crea nuovo e-service',
        COMPONENT: EServiceWrite,
      },
      ESERVICE_EDIT: {
        PATH: `${BASE_ROUTE}/erogazione/e-service/:eserviceId/:descriptorId`,
        EXACT: false,
        LABEL: 'Ispeziona e-service',
        COMPONENT: EServiceGate,
      },
      AGREEMENT_LIST: {
        PATH: `${BASE_ROUTE}/erogazione/accordi`,
        EXACT: true,
        LABEL: 'Gestisci accordi',
        COMPONENT: AgreementList,
      },
      AGREEMENT_EDIT: {
        PATH: `${BASE_ROUTE}/erogazione/accordi/:id`,
        EXACT: false,
        LABEL: 'Modifica accordo',
        COMPONENT: AgreementEdit,
      },
      OPERATOR_API_LIST: {
        PATH: `${BASE_ROUTE}/erogazione/operatori`,
        EXACT: true,
        LABEL: 'Gestisci operatori API',
        COMPONENT: UserList,
      },
      OPERATOR_API_CREATE: {
        PATH: `${BASE_ROUTE}/erogazione/operatori/crea`,
        EXACT: false,
        LABEL: 'Crea nuovo operatore API',
        COMPONENT: UserCreate,
      },
      OPERATOR_API_EDIT: {
        PATH: `${BASE_ROUTE}/erogazione/operatori/:id`,
        EXACT: false,
        LABEL: 'Modifica operatore API',
        COMPONENT: UserEdit,
      },
    },
  },
  SUBSCRIBE: {
    PATH: `${BASE_ROUTE}/fruizione`,
    LABEL: 'Fruizione',
    COMPONENT: Subscribe,
    SUBROUTES: {
      CLIENT_LIST: {
        PATH: `${BASE_ROUTE}/fruizione/client`,
        EXACT: true,
        LABEL: 'Gestisci client',
        COMPONENT: ClientList,
      },
      CLIENT_CREATE: {
        PATH: `${BASE_ROUTE}/fruizione/client/crea`,
        EXACT: false,
        LABEL: 'Crea nuovo client',
        COMPONENT: ClientCreate,
      },
      CLIENT_EDIT: {
        PATH: `${BASE_ROUTE}/fruizione/client/:id`,
        EXACT: true,
        LABEL: 'Modifica client',
        COMPONENT: ClientEdit,
      },
      AGREEMENT_LIST: {
        PATH: `${BASE_ROUTE}/fruizione/accordi`,
        EXACT: true,
        LABEL: 'Gestisci accordi',
        COMPONENT: AgreementList,
      },
      AGREEMENT_EDIT: {
        PATH: `${BASE_ROUTE}/fruizione/accordi/:id`,
        EXACT: false,
        LABEL: 'Modifica accordo',
        COMPONENT: AgreementEdit,
      },
      CATALOG_LIST: {
        PATH: `${BASE_ROUTE}/fruizione/catalogo-e-service`,
        EXACT: true,
        LABEL: 'Catalogo e-service',
        COMPONENT: EServiceCatalog,
      },
      CATALOG_VIEW: {
        PATH: `${BASE_ROUTE}/fruizione/catalogo-e-service/:eserviceId/:descriptorId`,
        EXACT: false,
        LABEL: 'Visualizza e-service',
        COMPONENT: EServiceGate,
      },
      OPERATOR_SECURITY_LIST: {
        PATH: `${BASE_ROUTE}/fruizione/client/operatori`,
        EXACT: true,
        LABEL: 'Gestisci operatori',
        COMPONENT: UserList,
      },
      OPERATOR_SECURITY_CREATE: {
        PATH: `${BASE_ROUTE}/fruizione/client/operatori/crea`,
        EXACT: false,
        LABEL: 'Crea nuovo operatore di sicurezza',
        COMPONENT: UserCreate,
      },
      OPERATOR_SECURITY_EDIT: {
        PATH: `${BASE_ROUTE}/fruizione/client/operatori/:clientId/:operatorId`,
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
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices',
    LOCAL: 'get-eservice-list.json',
    SHOULD_CALL: true,
  },
  ESERVICE_GET_LIST_FLAT: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/flatten/eservices',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}',
    LOCAL: 'get-eservice-list.json',
    SHOULD_CALL: true,
  },
  ESERVICE_CREATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_UPDATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_DELETE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_CLONE_FROM_VERSION: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors/{{descriptorId}}/clone',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_CREATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_UPDATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors/{{descriptorId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_PUBLISH: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors/{{descriptorId}}/publish',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_DELETE: {
    // Only drafts can be deleted
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors/{{descriptorId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_POST_DOCUMENT: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors/{{descriptorId}}/documents',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_DELETE_DOCUMENT: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors/{{descriptorId}}/documents/{{documentId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_GET_DOCUMENTS: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors/{{descriptorId}}/documents/{{documentId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION: {
    URL: 'pdnd-interop-uservice-catalog-process/0.0/eservices/{{eserviceId}}/descriptors/{{descriptorId}}/documents/{{documentId}}/update',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  OPERATOR_API_CREATE: {
    URL: 'pdnd-interop-uservice-party-process/0.0.1/onboarding/operators',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  OPERATOR_API_GET_LIST: {
    URL: 'pdnd-interop-uservice-party-process/0.0.1/institutions/{{institutionId}}/relationships',
    LOCAL: 'get-user-list.json',
    SHOULD_CALL: false,
  },
  OPERATOR_API_GET_SINGLE: {
    URL: 'TODO',
    LOCAL: 'get-user-single.json', // TEMP PIN-438
    SHOULD_CALL: false,
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
    URL: 'pdnd-interop-uservice-agreement-process/0.0.1/agreements',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  AGREEMENT_GET_LIST: {
    URL: 'pdnd-interop-uservice-agreement-process/0.0.1/agreements',
    LOCAL: 'get-agreement-list.json',
    SHOULD_CALL: true,
  },
  AGREEMENT_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.0.1/agreements/{{agreementId}}',
    LOCAL: 'get-agreement-single.json',
    SHOULD_CALL: true,
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.0.1/agreements/{{agreementId}}/attributes/{{attributeId}}/verify',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  AGREEMENT_ACTIVATE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.0.1/agreements/{{agreementId}}/activate',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  AGREEMENT_SUSPEND: {
    URL: 'pdnd-interop-uservice-agreement-process/0.0.1/agreements/{{agreementId}}/suspend',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  CLIENT_GET_LIST: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients',
    LOCAL: 'get-client-list.json',
    SHOULD_CALL: true,
  },
  CLIENT_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients/{{clientId}}',
    LOCAL: 'get-client-single.json',
    SHOULD_CALL: true,
  },
  CLIENT_CREATE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  OPERATOR_SECURITY_GET_LIST: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients/{{clientId}}/operators',
    LOCAL: 'get-user-list.json',
    SHOULD_CALL: true,
  },
  OPERATOR_SECURITY_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients/{{clientId}}/operators/{{operatorTaxCode}}',
    LOCAL: 'get-user-single.json',
    SHOULD_CALL: true,
  },
  OPERATOR_SECURITY_CREATE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients/{{clientId}}/operators',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  OPERATOR_SECURITY_KEYS_GET: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients/{{clientId}}/operators/{{taxCode}}/keys',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  OPERATOR_SECURITY_KEYS_POST: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/operators/{{taxCode}}/keys',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  OPERATOR_SECURITY_KEY_DOWNLOAD: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients/{{clientId}}/operators/{{operatorId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  OPERATOR_SECURITY_KEY_ENABLE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients/{{clientId}}/operators/{{operatorId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
  OPERATOR_SECURITY_KEY_DISABLE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.0.1/clients/{{clientId}}/operators/{{operatorId}}',
    LOCAL: '',
    SHOULD_CALL: true,
  },
}

export const TOAST_CONTENTS: { [key in ToastActionKeys]: RunActionProps } = {
  ONBOARDING_GET_AVAILABLE_PARTIES: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ONBOARDING_GET_SEARCH_PARTIES: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ONBOARDING_POST_LEGALS: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ONBOARDING_COMPLETE_REGISTRATION: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ESERVICE_GET_LIST: { loadingText: 'Stiamo caricando gli e-service', success: {}, error: {} },
  ESERVICE_GET_LIST_FLAT: { loadingText: 'Stiamo caricando gli e-service', success: {}, error: {} },
  ESERVICE_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ESERVICE_CREATE: {
    loadingText: 'Stiamo creando la bozza',
    success: { title: 'Bozza creata', description: 'La bozza è stata creata correttamente' },
    error: {
      title: "C'è stato un problema",
      description:
        'Non è stato possibile creare la bozza. Verifica di aver compilato tutti i campi richiesti e riprova!',
    },
  },
  ESERVICE_UPDATE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ESERVICE_DELETE: {
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
  ESERVICE_CLONE_FROM_VERSION: {
    loadingText: "Stiamo clonando l'e-service richiesto",
    success: {
      title: 'Nuova bozza disponibile',
      description: 'Il servizio è stato clonato correttamente ed è disponibile in bozza',
    },
    error: {
      title: 'Errore',
      description: "Non è stato possibile completare l'operazione. Per favore, riprovare",
    },
  },
  ESERVICE_VERSION_CREATE: {
    loadingText: 'Stiamo creando la nuova versione (in bozza)',
    success: {
      title: 'Nuova versione disponibile',
      description: "La nuova versione della nuova versione dell'e-service è disponibile in bozza",
    },
    error: {
      title: 'Errore',
      description:
        "Non è stato possibile creare una bozza per la nuova versione dell'e-service. Per favore, riprovare",
    },
  },
  ESERVICE_VERSION_UPDATE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ESERVICE_VERSION_PUBLISH: {
    loadingText: 'Stiamo pubblicando la versione in bozza',
    success: {
      title: 'Nuova versione disponibile',
      description: "La nuova versione dell'e-service è stata pubblicata correttamente",
    },
    error: {
      title: 'Errore',
      description:
        "Si è verificato un errore, non è stato possibile pubblicare la nuova versione dell'e-service",
    },
  },

  ESERVICE_VERSION_DELETE: {
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
  ESERVICE_VERSION_POST_DOCUMENT: {
    loadingText: 'Operazione in corso',
    success: {},
    error: {},
  },
  ESERVICE_VERSION_DELETE_DOCUMENT: {
    loadingText: 'Operazione in corso',
    success: {},
    error: {},
  },
  ESERVICE_VERSION_GET_DOCUMENTS: {
    loadingText: 'Stiamo scaricando il documento',
    success: {
      title: 'Successo',
      description:
        'Il documento è stato scaricato correttamente. Lo trovi nella cartella dei download del tuo device',
    },
    error: {
      title: 'Errore',
      description: 'Non è stato possibile scaricare il documento. Riprova!',
    },
  },
  ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION: {
    loadingText: 'Operazione in corso',
    success: {},
    error: {},
  },
  OPERATOR_API_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_API_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_API_CREATE: {
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
  ATTRIBUTES_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  ATTRIBUTE_CREATE: {
    loadingText: 'Stiamo salvando il nuovo attributo',
    success: {
      title: 'Attributo creato correttamente',
      description: "Adesso puoi aggiungere l'attributo al tuo e-service",
    },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile completare l'operazione",
    },
  },
  PARTY_GET_PARTY_ID: { loadingText: 'Operazione in corso', success: {}, error: {} },
  AGREEMENT_CREATE: {
    loadingText: "Stiamo creando l'accordo richiesto",
    success: {
      title: 'Accordo creato',
      description:
        "L'accordo è stato creato correttamente ed è in attesa di approvazione. Riceverai notifiche di aggiornamento sul suo stato",
    },
    error: {
      title: 'Errore',
      description:
        "Non è stato possibile creare l'accordo. Se sei sicuro/a di averne diritto, contatta l'assistenza per maggiori informazioni",
    },
  },
  AGREEMENT_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  AGREEMENT_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    loadingText: "Stiamo verificando l'attributo",
    success: { title: 'Attributo verificato', description: "L'attributo è ora stato verificato" },
    error: {
      title: 'Errore',
      description: "Non è stato possibile verificare l'attributo. Riprova!",
    },
  },
  AGREEMENT_ACTIVATE: {
    loadingText: "Stiamo attivando l'accordo",
    success: { title: 'Successo', description: "L'operazione è andata a buon fine" },
    error: {
      title: 'Errore',
      description:
        "Non è stato possibile attivare l'accordo. Accertarsi che tutti gli attributi siano stati verificati",
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
  CLIENT_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  CLIENT_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  CLIENT_CREATE: { loadingText: 'Stiamo creando il client richiesto', success: {}, error: {} },
  OPERATOR_SECURITY_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_CREATE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEYS_GET: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEYS_POST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEY_DOWNLOAD: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEY_ENABLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEY_DISABLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
}

export const DIALOG_CONTENTS: { [key in DialogActionKeys]: DialogContent } = {
  ONBOARDING_GET_AVAILABLE_PARTIES: {},
  ONBOARDING_GET_SEARCH_PARTIES: {},
  ONBOARDING_POST_LEGALS: {},
  ONBOARDING_COMPLETE_REGISTRATION: {},
  ESERVICE_GET_LIST: {},
  ESERVICE_GET_LIST_FLAT: {},
  ESERVICE_GET_SINGLE: {},
  ESERVICE_CREATE: {
    title: 'Conferma creazione bozza',
    description:
      'Cliccando "conferma", una nuova bozza verrà creata. Potrà essere pubblicata successivamente, oppure cancellata',
  },
  ESERVICE_UPDATE: {},
  ESERVICE_DELETE: {
    title: 'Conferma cancellazione bozza',
    description:
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_CLONE_FROM_VERSION: {
    title: 'Conferma clonazione e-service',
    description:
      "Verrà creato un nuovo e-service in bozza con le stesse caratteristiche dell'e-service selezionato",
  },
  ESERVICE_VERSION_CREATE: {
    title: 'Conferma creazione bozza versione',
    description: "Verrà creata una nuova versione (in bozza) dell'e-service selezionato",
  },
  ESERVICE_VERSION_UPDATE: {},
  ESERVICE_VERSION_PUBLISH: {
    title: 'Conferma pubblicazione bozza',
    description:
      "Una volta pubblicata, una versione dell'e-service non è più cancellabile e diventa disponibile nel catalogo degli e-service. Sarà comunque possibile sospenderla, o renderla obsoleta una volta che una nuova versione diventa disponibile.",
  },
  ESERVICE_VERSION_DELETE: {
    title: 'Conferma cancellazione bozza',
    description:
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_VERSION_POST_DOCUMENT: {},
  ESERVICE_VERSION_DELETE_DOCUMENT: {},
  ESERVICE_VERSION_GET_DOCUMENTS: {},
  ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION: {},
  OPERATOR_API_GET_LIST: {},
  OPERATOR_API_GET_SINGLE: {},
  OPERATOR_API_CREATE: {},
  ATTRIBUTES_GET_LIST: {},
  ATTRIBUTE_CREATE: {},
  PARTY_GET_PARTY_ID: {},
  AGREEMENT_CREATE: {
    title: "Iscriviti all'e-service",
    description:
      'Cliccando su "conferma" ti iscriverai all\'e-service richiesto, o a un aggiornamento di versione',
  },
  AGREEMENT_GET_LIST: {},
  AGREEMENT_GET_SINGLE: {},
  AGREEMENT_ACTIVATE: {
    title: "Attiva l'accordo",
    description:
      'Cliccando su "conferma" si attiverà l\'accordo di interoperabilità. Potrà essere sospeso in qualunque momento da questo pannello',
  },
  AGREEMENT_SUSPEND: {},
  CLIENT_GET_LIST: {},
  CLIENT_GET_SINGLE: {},
  CLIENT_CREATE: {},
  OPERATOR_SECURITY_GET_LIST: {},
  OPERATOR_SECURITY_GET_SINGLE: {},
  OPERATOR_SECURITY_CREATE: {},
  OPERATOR_SECURITY_KEYS_GET: {},
  OPERATOR_SECURITY_KEYS_POST: {},
  OPERATOR_SECURITY_KEY_DOWNLOAD: {},
  OPERATOR_SECURITY_KEY_ENABLE: {},
  OPERATOR_SECURITY_KEY_DISABLE: {},
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

export const CLIENT_COMPUTED_STATUS_LABEL = {
  active: 'attivo',
  blocked: 'bloccato',
}

export const USER_STATUS_LABEL = {
  active: 'attivo',
  suspended: 'sospeso',
}

export const USER_ROLE_LABEL = {
  Manager: 'admin', // 'rappresentante legale',
  Delegate: 'delegato',
  Operator: 'operatore',
}

export const USER_PLATFORM_ROLE_LABEL = {
  admin: 'amministratore',
  security: 'operatore di sicurezza',
  api: 'operatore API',
}
