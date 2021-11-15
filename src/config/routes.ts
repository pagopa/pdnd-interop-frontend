import { BasicRouteConfig, RouteConfig } from '../../types'
import { decorateRouteWithParents } from '../lib/url-utils'
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
            LABEL: 'Gestisci singolo client',
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
                HIDE_BREADCRUMB: true,
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
