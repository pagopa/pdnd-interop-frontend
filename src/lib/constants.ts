import {
  ApiEndpointContent,
  BasicRouteConfig,
  DialogActionKeys,
  DialogContent,
  RouteConfig,
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
import { getDevLabels } from './wip-utils'
import { SecurityKeyGuide } from '../views/SecurityKeyGuide'
import { decorateRouteWithParents } from './url-utils'
import { EmptyComponent } from '../components/Shared/EmptyComponent'

const isDevelopment = !!(process.env.NODE_ENV === 'development')

export const SHOW_DEV_LABELS = isDevelopment || getDevLabels()
export const USE_MOCK_SPID_USER = isDevelopment
export const DISPLAY_LOGS = isDevelopment

export const NARROW_MAX_WIDTH = 480
export const MEDIUM_MAX_WIDTH = 768

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
    PUBLIC: false,
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
    PUBLIC: true,
    AUTH_LEVELS: 'any',
  },
  PROVIDE: {
    PATH: '/erogazione',
    LABEL: 'Erogazione',
    COMPONENT: Provide,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
    SUBROUTES: {
      ESERVICE: {
        PATH: '/erogazione/e-service',
        EXACT: false,
        LABEL: 'Gestisci e-service',
        COMPONENT: EmptyComponent,
        RENDER: false,
        PUBLIC: false,
        AUTH_LEVELS: ['admin', 'api'],
        SUBROUTES: {
          LIST: {
            PATH: '/erogazione/e-service/lista',
            EXACT: true,
            LABEL: 'I tuoi e-service',
            COMPONENT: EServiceList,
            PUBLIC: false,
            AUTH_LEVELS: ['admin', 'api'],
          },
          CREATE: {
            PATH: '/erogazione/e-service/crea',
            EXACT: true,
            LABEL: 'Crea e-service',
            COMPONENT: EServiceWrite,
            PUBLIC: false,
            AUTH_LEVELS: ['admin', 'api'],
          },
          EDIT: {
            PATH: '/erogazione/e-service/:eserviceId/:descriptorId',
            EXACT: false,
            LABEL: 'Ispeziona e-service',
            COMPONENT: EServiceGate,
            PUBLIC: false,
            AUTH_LEVELS: ['admin', 'api'],
          },
        },
      },
      AGREEMENT: {
        PATH: '/erogazione/accordi',
        EXACT: false,
        LABEL: 'Gestisci accordi',
        COMPONENT: EmptyComponent,
        RENDER: false,
        PUBLIC: false,
        AUTH_LEVELS: ['admin'],
        SUBROUTES: {
          LIST: {
            PATH: '/erogazione/accordi/lista',
            EXACT: true,
            LABEL: 'I tuoi accordi',
            COMPONENT: AgreementList,
            PUBLIC: false,
            AUTH_LEVELS: ['admin'],
          },
          EDIT: {
            PATH: '/erogazione/accordi/:id',
            EXACT: false,
            LABEL: 'Modifica accordo',
            COMPONENT: AgreementEdit,
            PUBLIC: false,
            AUTH_LEVELS: ['admin'],
          },
        },
      },
      OPERATOR: {
        PATH: '/erogazione/operatori',
        EXACT: false,
        LABEL: 'Gestisci operatori API',
        COMPONENT: EmptyComponent,
        RENDER: false,
        PUBLIC: false,
        AUTH_LEVELS: ['admin'],
        SUBROUTES: {
          LIST: {
            PATH: '/erogazione/operatori/lista',
            EXACT: true,
            LABEL: 'I tuoi operatori API',
            COMPONENT: UserList,
            PUBLIC: false,
            AUTH_LEVELS: ['admin'],
          },
          CREATE: {
            PATH: '/erogazione/operatori/crea',
            EXACT: false,
            LABEL: 'Crea operatore API',
            COMPONENT: UserCreate,
            PUBLIC: false,
            AUTH_LEVELS: ['admin'],
          },
          EDIT: {
            PATH: '/erogazione/operatori/:id',
            EXACT: false,
            LABEL: 'Modifica operatore API',
            COMPONENT: UserEdit,
            PUBLIC: false,
            AUTH_LEVELS: ['admin'],
          },
        },
      },
    },
  },
  SUBSCRIBE: {
    PATH: '/fruizione',
    LABEL: 'Fruizione',
    COMPONENT: Subscribe,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
    SUBROUTES: {
      CLIENT: {
        PATH: '/fruizione/client',
        EXACT: false,
        LABEL: 'Gestisci client',
        COMPONENT: EmptyComponent,
        RENDER: false,
        PUBLIC: false,
        AUTH_LEVELS: ['admin', 'security'],
        SUBROUTES: {
          LIST: {
            PATH: '/fruizione/client/lista',
            EXACT: true,
            LABEL: 'I tuoi client',
            COMPONENT: ClientList,
            PUBLIC: false,
            AUTH_LEVELS: ['admin', 'security'],
          },
          CREATE: {
            PATH: '/fruizione/client/crea',
            EXACT: true,
            LABEL: 'Crea client',
            COMPONENT: ClientCreate,
            PUBLIC: false,
            AUTH_LEVELS: ['admin'],
          },
          HANDLE: {
            PATH: '/fruizione/client/:id',
            EXACT: false,
            LABEL: 'Gestisci client',
            COMPONENT: EmptyComponent,
            RENDER: false,
            PUBLIC: false,
            AUTH_LEVELS: ['admin', 'security'],
            SUBROUTES: {
              EDIT: {
                PATH: '/fruizione/client/:id/modifica',
                EXACT: true,
                LABEL: 'Modifica client',
                COMPONENT: ClientEdit,
                PUBLIC: false,
                AUTH_LEVELS: ['admin', 'security'],
              },
              OPERATOR: {
                PATH: '/fruizione/client/:id/operatori',
                EXACT: false,
                LABEL: 'I tuoi operatori di sicurezza',
                COMPONENT: EmptyComponent,
                RENDER: false,
                PUBLIC: false,
                AUTH_LEVELS: ['admin'],
                SUBROUTES: {
                  CREATE: {
                    PATH: '/fruizione/client/:id/operatori/crea',
                    EXACT: false,
                    LABEL: 'Crea operatore di sicurezza',
                    COMPONENT: UserCreate,
                    PUBLIC: false,
                    AUTH_LEVELS: ['admin'],
                  },
                  EDIT: {
                    PATH: '/fruizione/client/:id/operatori/:operatorId',
                    EXACT: false,
                    LABEL: 'Modifica operatore',
                    COMPONENT: UserEdit,
                    PUBLIC: false,
                    AUTH_LEVELS: ['admin', 'security'],
                  },
                },
              },
            },
          },
        },
      },
      AGREEMENT: {
        PATH: '/fruizione/accordi',
        EXACT: false,
        LABEL: 'Gestisci accordi',
        COMPONENT: EmptyComponent,
        RENDER: false,
        PUBLIC: false,
        AUTH_LEVELS: ['admin'],
        SUBROUTES: {
          LIST: {
            PATH: '/fruizione/accordi/lista',
            EXACT: true,
            LABEL: 'I tuoi accordi',
            COMPONENT: AgreementList,
            PUBLIC: false,
            AUTH_LEVELS: ['admin'],
          },
          EDIT: {
            PATH: '/fruizione/accordi/:id',
            EXACT: false,
            LABEL: 'Modifica accordo',
            COMPONENT: AgreementEdit,
            PUBLIC: false,
            AUTH_LEVELS: ['admin'],
          },
        },
      },
      CATALOG: {
        PATH: '/fruizione/catalogo-e-service',
        EXACT: false,
        LABEL: 'Catalogo e-service',
        COMPONENT: EmptyComponent,
        RENDER: false,
        PUBLIC: false,
        AUTH_LEVELS: ['admin', 'security'],
        SUBROUTES: {
          LIST: {
            PATH: '/fruizione/catalogo-e-service/lista',
            EXACT: true,
            LABEL: 'E-service disponibili',
            COMPONENT: EServiceCatalog,
            PUBLIC: false,
            AUTH_LEVELS: ['admin', 'security'],
          },
          VIEW: {
            PATH: '/fruizione/catalogo-e-service/:eserviceId/:descriptorId',
            EXACT: false,
            LABEL: 'Visualizza e-service',
            COMPONENT: EServiceGate,
            PUBLIC: false,
            AUTH_LEVELS: ['admin', 'security'],
          },
        },
      },
    },
  },
}

export const ROUTES = decorateRouteWithParents(BASIC_ROUTES as Record<string, RouteConfig>)

export const API: Record<string, ApiEndpointContent> = {
  ONBOARDING_GET_AVAILABLE_PARTIES: {
    URL: 'pdnd-interop-uservice-party-process/0.1/onboarding/info/:taxCode',
    METHOD: 'GET',
  },
  ONBOARDING_GET_SEARCH_PARTIES: {
    URL: 'pdnd-interop-uservice-party-registry-proxy/0.1/institutions',
    METHOD: 'GET',
  },
  ONBOARDING_POST_LEGALS: {
    URL: 'pdnd-interop-uservice-party-process/0.1/onboarding/legals',
    METHOD: 'POST',
  },
  ONBOARDING_COMPLETE_REGISTRATION: {
    URL: 'pdnd-interop-uservice-party-process/0.1/onboarding/complete/:token',
    METHOD: 'POST',
  },
  ESERVICE_GET_LIST: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices',
    METHOD: 'GET',
  },
  ESERVICE_GET_LIST_FLAT: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/flatten/eservices',
    METHOD: 'GET',
  },
  ESERVICE_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId',
    METHOD: 'GET',
  },
  ESERVICE_CREATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices',
    METHOD: 'POST',
  },
  ESERVICE_UPDATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId',
    METHOD: 'PUT',
  },
  ESERVICE_DELETE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId',
    METHOD: 'DELETE',
  },
  ESERVICE_CLONE_FROM_VERSION: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/clone',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_CREATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_UPDATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId',
    METHOD: 'PUT',
  },
  ESERVICE_VERSION_PUBLISH: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/publish',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_SUSPEND: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/suspend',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_REACTIVATE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/activate',
    METHOD: 'POST',
  },
  // Only drafts can be deleted
  ESERVICE_VERSION_DELETE: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId',
    METHOD: 'DELETE',
  },
  ESERVICE_VERSION_POST_DOCUMENT: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/documents',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DELETE_DOCUMENT: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId',
    METHOD: 'DELETE',
  },
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId',
    METHOD: 'GET',
  },
  ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION: {
    URL: 'pdnd-interop-uservice-catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId/update',
    METHOD: 'POST',
  },
  OPERATOR_API_CREATE: {
    URL: 'pdnd-interop-uservice-party-process/0.1/onboarding/operators',
    METHOD: 'POST',
  },
  OPERATOR_API_GET_LIST: {
    URL: 'pdnd-interop-uservice-party-process/0.1/institutions/:institutionId/relationships',
    METHOD: 'GET',
  },
  OPERATOR_API_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-party-process/0.1/institutions/:institutionId/relationships/:taxCode',
    METHOD: 'GET',
  },
  ATTRIBUTES_GET_LIST: {
    URL: 'pdnd-interop-uservice-attribute-registry-management/0.1/attributes',
    METHOD: 'GET',
  },
  ATTRIBUTE_CREATE: {
    URL: 'pdnd-interop-uservice-attribute-registry-management/0.1/attributes',
    METHOD: 'POST',
  },
  PARTY_GET_PARTY_ID: {
    URL: 'pdnd-interop-uservice-party-management/0.1/organizations/:institutionId',
    METHOD: 'GET',
  },
  AGREEMENT_CREATE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.1/agreements',
    METHOD: 'POST',
  },
  AGREEMENT_GET_LIST: {
    URL: 'pdnd-interop-uservice-agreement-process/0.1/agreements',
    METHOD: 'GET',
  },
  AGREEMENT_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.1/agreements/:agreementId',
    METHOD: 'GET',
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.1/agreements/:agreementId/attributes/:attributeId/verify',
    METHOD: 'PATCH',
  },
  AGREEMENT_ACTIVATE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.1/agreements/:agreementId/parties/:partyId/activate',
    METHOD: 'PATCH',
  },
  AGREEMENT_SUSPEND: {
    URL: 'pdnd-interop-uservice-agreement-process/0.1/agreements/:agreementId/parties/:partyId/suspend',
    METHOD: 'PATCH',
  },
  AGREEMENT_UPGRADE: {
    URL: 'pdnd-interop-uservice-agreement-process/0.1/agreements/:agreementId/upgrade',
    METHOD: 'POST',
  },
  CLIENT_GET_LIST: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients',
    METHOD: 'GET',
  },
  CLIENT_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId',
    METHOD: 'GET',
  },
  CLIENT_CREATE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients',
    METHOD: 'POST',
  },
  CLIENT_SUSPEND: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId/suspend',
    METHOD: 'POST',
  },
  CLIENT_ACTIVATE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId/activate',
    METHOD: 'POST',
  },
  OPERATOR_SECURITY_GET_LIST: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId/operators',
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_GET_SINGLE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId/operators/:operatorTaxCode',
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_CREATE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId/operators',
    METHOD: 'POST',
  },
  OPERATOR_SECURITY_KEYS_GET: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId/operators/:taxCode/keys',
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_KEYS_POST: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/operators/:taxCode/keys',
    METHOD: 'POST',
  },
  OPERATOR_SECURITY_KEY_DOWNLOAD: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId/encoded/keys/:keyId',
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_KEY_DELETE: {
    URL: 'pdnd-interop-uservice-authorization-process/0.1/clients/:clientId/keys/:keyId',
    METHOD: 'DELETE',
  },
  USER_SUSPEND: {
    URL: 'pdnd-interop-uservice-party-process/0.1/institutions/:institutionId/relationships/:taxCode/suspend',
    METHOD: 'POST',
  },
  USER_REACTIVATE: {
    URL: 'pdnd-interop-uservice-party-process/0.1/institutions/:institutionId/relationships/:taxCode/activate',
    METHOD: 'POST',
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
        "Non è stato possibile creare una bozza per la nuova versione dell'e-service. Assicurarsi di aver compilato tuttii i campi e riprovare",
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
  ESERVICE_VERSION_SUSPEND: {
    loadingText: 'Stiamo sospendendo la versione',
    success: {
      title: 'Versione sospesa',
      description: "La versione dell'e-service è stata sospesa",
    },
    error: {
      title: 'Errore',
      description:
        "Si è verificato un errore, non è stato possibile sospendere questa versione dell'e-service",
    },
  },
  ESERVICE_VERSION_REACTIVATE: {
    loadingText: 'Stiamo riattivando la versione',
    success: {
      title: 'Versione riattivata',
      description: "La versione dell'e-service è stata riattivata",
    },
    error: {
      title: 'Errore',
      description:
        "Si è verificato un errore, non è stato possibile riattivare questa versione dell'e-service",
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
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {
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
    success: {
      title: 'Accordo attivato',
      description:
        "L'accordo è ora attivo, ed è possibile creare client da associare all'e-service",
    },
    error: {
      title: 'Errore',
      description:
        "Non è stato possibile attivare l'accordo. Accertarsi che tutti gli attributi siano stati verificati",
    },
  },
  AGREEMENT_SUSPEND: {
    loadingText: "Stiamo sospendendo l'accordo",
    success: {
      title: 'Accordo sospeso',
      description:
        "Non è più possibile per i client associati all'e-service accedere al servizio in erogazione",
    },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile sospendere l'accordo",
    },
  },
  AGREEMENT_UPGRADE: {
    loadingText: "Stiamo aggiornando l'accordo",
    success: {
      title: 'Accordo aggiornato',
      description: "L'accordo è stato aggiornato alla versione più recente dell'e-service",
    },
    error: {
      title: 'Errore',
      description: "C'è stato un errore, non è stato possibile aggiornare l'accordo",
    },
  },
  CLIENT_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  CLIENT_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  CLIENT_CREATE: { loadingText: 'Stiamo creando il client richiesto', success: {}, error: {} },
  CLIENT_SUSPEND: { loadingText: 'Stiamo sospendendo il client richiesto', success: {}, error: {} },
  CLIENT_ACTIVATE: {
    loadingText: 'Stiamo riattivando il client richiesto',
    success: {},
    error: {},
  },
  OPERATOR_SECURITY_GET_LIST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_GET_SINGLE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_CREATE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEYS_GET: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEYS_POST: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEY_DOWNLOAD: { loadingText: 'Operazione in corso', success: {}, error: {} },
  OPERATOR_SECURITY_KEY_DELETE: { loadingText: 'Operazione in corso', success: {}, error: {} },
  USER_SUSPEND: {
    loadingText: "Stiamo sospendendo l'operatore",
    success: {
      title: 'Operatore sospeso',
      description:
        "L'operatore richiesto è stato sospeso e non può più accedere alla piattaforma per quest'ente",
    },
    error: {},
  },
  USER_REACTIVATE: {
    loadingText: "Stiamo riattivando l'operatore",
    success: {
      title: 'Operatore riattivato',
      description:
        "L'operatore richiesto è stato riattivato e può nuovamente accedere alla piattaforma per quest'ente",
    },
    error: {},
  },
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
    children:
      'Cliccando "conferma", una nuova bozza verrà creata. Potrà essere pubblicata successivamente, oppure cancellata',
  },
  ESERVICE_UPDATE: {},
  ESERVICE_DELETE: {
    title: 'Conferma cancellazione bozza',
    children:
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_CLONE_FROM_VERSION: {
    title: 'Conferma clonazione e-service',
    children:
      "Verrà creato un nuovo e-service in bozza con le stesse caratteristiche dell'e-service selezionato",
  },
  ESERVICE_VERSION_CREATE: {
    title: 'Conferma creazione bozza versione',
    children: "Verrà creata una nuova versione (in bozza) dell'e-service selezionato",
  },
  ESERVICE_VERSION_UPDATE: {},
  ESERVICE_VERSION_PUBLISH: {
    title: 'Conferma pubblicazione bozza',
    children:
      "Una volta pubblicata, una versione dell'e-service non è più cancellabile e diventa disponibile nel catalogo degli e-service. Sarà comunque possibile sospenderla, o renderla obsoleta una volta che una nuova versione diventa disponibile.",
  },
  ESERVICE_VERSION_DELETE: {
    title: 'Conferma cancellazione bozza',
    children:
      'Cliccando "conferma" questa bozza verrà cancellata e non sarà più recuperabile. Sarà sempre possibile creare nuove bozze',
  },
  ESERVICE_VERSION_SUSPEND: {
    title: 'Conferma sospensione versione',
    children:
      'Cliccando "conferma" questa versione di e-service sarà sospesa. Nessun fruitore potrà accedere a questa versione finché non sarà riattivata',
  },
  ESERVICE_VERSION_REACTIVATE: {
    title: 'Conferma riattivazione versione',
    children:
      'Cliccando "conferma" questa versione di e-service sarà riattivata. Tutti i fruitori che hanno un accordo di interoperabilità attivo per questa versione di servizio potranno nuovamente usufruirne',
  },
  ESERVICE_VERSION_POST_DOCUMENT: {},
  ESERVICE_VERSION_DELETE_DOCUMENT: {},
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {},
  ESERVICE_VERSION_UPDATE_DOCUMENT_DESCRIPTION: {},
  OPERATOR_API_GET_LIST: {},
  OPERATOR_API_GET_SINGLE: {},
  OPERATOR_API_CREATE: {},
  ATTRIBUTES_GET_LIST: {},
  ATTRIBUTE_CREATE: {},
  PARTY_GET_PARTY_ID: {},
  AGREEMENT_GET_LIST: {},
  AGREEMENT_GET_SINGLE: {},
  AGREEMENT_ACTIVATE: {
    title: "Attiva l'accordo",
    children:
      'Cliccando su "conferma" si attiverà l\'accordo di interoperabilità. Potrà essere sospeso in qualunque momento da questo pannello',
  },
  AGREEMENT_SUSPEND: {
    title: "Sospendi l'accordo",
    children:
      "Cliccando su \"conferma\", l'accordo di interoperabilità sarà sospeso. I client collegati a questo accordo non avranno più accesso all'e-service in erogazione. L'accordo è riattivabile in qualsiasi momento da questa stessa pagina",
  },
  AGREEMENT_UPGRADE: {
    title: "Aggiorna l'accordo",
    children:
      "Cliccando su \"conferma\", l'accordo di interoperabilità sarà aggiornato alla versione più recente dell'e-service attualmente disponibile. I client collegati a questo accordo continueranno ad avere accesso all'e-service in erogazione, aggiornato all'ultima versione",
  },
  CLIENT_GET_LIST: {},
  CLIENT_GET_SINGLE: {},
  CLIENT_CREATE: {},
  CLIENT_SUSPEND: {
    title: 'Sospendi il client',
    children:
      'Il client è attualmente attivo. Cliccando "conferma" verrà sospeso e le chiavi di sicurezza associate a quel client non saranno considerate più valide per garantire l\'accesso al servizio erogato. Il client si potrà riattivare in qualsiasi momento, ripristinando l\'accesso al servizio',
  },
  CLIENT_ACTIVATE: {
    title: 'Riattiva il client',
    children:
      "Il client è attualmente inattivo, e si sta per riattivarlo. Se ci sono altri impedimenti (es. l'accordo di interoperabilità è sospeso) non sarà comunque possibile accedere all'e-service erogato",
  },
  OPERATOR_SECURITY_GET_LIST: {},
  OPERATOR_SECURITY_GET_SINGLE: {},
  OPERATOR_SECURITY_CREATE: {},
  OPERATOR_SECURITY_KEYS_GET: {},
  OPERATOR_SECURITY_KEYS_POST: {},
  OPERATOR_SECURITY_KEY_DOWNLOAD: {},
  OPERATOR_SECURITY_KEY_DELETE: {
    title: 'Cancella la chiave pubblica',
    children:
      'Cliccando su "conferma" si cancellerà la chiave pubblica relativa a questo operatore. NB: tutti i servizi che utilizzano questa chiave non potranno più accedere al servizio dell\'ente erogatore. Se non sei sicuro, scarica e salva la tua chiave pubblica prima di cancellarla',
  },
  USER_SUSPEND: {
    title: 'Sospendi operatore',
    children:
      "Cliccando su \"conferma\", l'operatore richiesto sarà sospeso dall'accesso alla piattaforma per l'ente corrente. Se è un operatore di sicurezza, anche le sue chiavi sono sospese",
  },
  USER_REACTIVATE: {
    title: 'Riattiva operatore',
    children:
      "Cliccando su \"conferma\", l'operatore richiesto sarà riabilitato all'accesso alla piattaforma per l'ente corrente. Se è un operatore di sicurezza, anche le sue chiavi sono riabilitate",
  },
}

export const ESERVICE_STATUS_LABEL = {
  published: 'Attivo',
  draft: 'In bozza',
  suspended: 'Sospeso',
  archived: 'Archiviato',
  deprecated: 'Deprecato',
}

export const ATTRIBUTE_TYPE_LABEL = {
  certified: 'Certificati',
  verified: 'Verificati',
  declared: 'Dichiarati',
}

export const AGREEMENT_STATUS_LABEL = {
  active: 'Attivo',
  suspended: 'Sospeso',
  pending: 'In attesa di approvazione',
  inactive: 'Archiviato',
}

export const CLIENT_STATUS_LABEL = {
  active: 'Attivo',
  suspended: 'Sospeso',
}

export const COMPUTED_STATUS_LABEL = {
  active: 'Attivo',
  inactive: 'Non attivo',
}

export const USER_STATUS_LABEL = {
  pending: 'In attesa di approvazione',
  active: 'Attivo',
  suspended: 'Sospeso',
}

export const USER_ROLE_LABEL = {
  Manager: 'Amministratore',
  Delegate: 'Delegato',
  Operator: 'Operatore',
}

export const USER_PLATFORM_ROLE_LABEL = {
  admin: 'Amministratore',
  security: 'Operatore di sicurezza',
  api: 'Operatore API',
}
