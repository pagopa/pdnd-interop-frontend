import { RouteConfig } from '../../types'
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
import { UserEdit } from '../views/UserEdit'
import { UserList } from '../views/UserList'
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
import { InteropM2M } from '../views/InteropM2M'
import { ClientAssertionGuide } from '../views/ClientAssertionGuide'

export const BASIC_ROUTES: Record<string, RouteConfig> = {
  LOGOUT: {
    PATH: { it: '/it/logout', en: '/en/logout' },
    LABEL: { it: 'Logout', en: 'Logout' },
    COMPONENT: Logout,
    PUBLIC: true,
  },
  HELP: {
    PATH: { it: '/it/aiuto', en: '/en/help' },
    LABEL: { it: 'Guida introduttiva', en: 'Introductive guide' },
    COMPONENT: Help,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  SECURITY_KEY_GUIDE: {
    PATH: { it: '/it/generazione-chiavi', en: '/en/generate-keys' },
    LABEL: { it: 'Come caricare le chiavi di sicurezza', en: 'How to upload public keys' },
    COMPONENT: SecurityKeyGuide,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  CLIENT_ASSERTION_GUIDE: {
    PATH: { it: '/it/client-assertion', en: '/en/client-assertion' },
    LABEL: { it: 'Come implementare la client assertion', en: 'How to implement client assertion' },
    COMPONENT: ClientAssertionGuide,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  CHOOSE_PARTY: {
    PATH: { it: '/it/scelta', en: '/en/choice' },
    LABEL: { it: 'Scegli ente', en: 'Choose institution' },
    COMPONENT: ChooseParty,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  NOTIFICATION: {
    PATH: { it: '/it/notifiche', en: '/en/notifications' },
    LABEL: { it: 'Notifiche', en: 'Notifications' },
    COMPONENT: Notifications,
    PUBLIC: false,
    AUTH_LEVELS: 'any',
  },
  PROVIDE_ESERVICE_CREATE: {
    PATH: { it: '/it/erogazione/e-service/crea', en: '/en/provider/e-service/create' },
    LABEL: { it: 'Crea E-Service', en: 'Create E-Service' },
    EXACT: true,
    COMPONENT: EServiceCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_EDIT: {
    PATH: {
      it: '/it/erogazione/e-service/:eserviceId/:descriptorId/modifica',
      en: '/en/provider/e-service/:eserviceId/:descriptorId/edit',
    },
    LABEL: { it: 'Modifica E-Service', en: 'Edit E-Service' },
    EXACT: false,
    COMPONENT: EServiceCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_MANAGE: {
    PATH: {
      it: '/it/erogazione/e-service/:eserviceId/:descriptorId',
      en: '/en/provider/e-service/:eserviceId/:descriptorId',
    },
    LABEL: { it: 'Visualizza E-Service', en: 'View E-Service' },
    EXACT: false,
    COMPONENT: EServiceManage,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_ESERVICE_LIST: {
    PATH: { it: '/it/erogazione/e-service', en: '/en/provider/e-service' },
    LABEL: { it: 'I tuoi E-Service', en: 'Your E-Services' },
    EXACT: true,
    COMPONENT: EServiceList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  PROVIDE_AGREEMENT_EDIT: {
    PATH: { it: '/it/erogazione/accordi/:agreementId', en: '/en/provider/agreements/:agreementId' },
    LABEL: { it: 'Gestisci richiesta', en: 'Manage request' },
    EXACT: false,
    COMPONENT: AgreementEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_AGREEMENT_LIST: {
    PATH: { it: '/it/erogazione/accordi', en: '/en/provider/agreements' },
    LABEL: { it: 'Richieste di fruizione', en: 'Requests for use' },
    EXACT: true,
    COMPONENT: AgreementList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_OPERATOR_EDIT: {
    PATH: { it: '/it/erogazione/operatori/:operatorId', en: '/en/provider/operators/:operatorId' },
    LABEL: { it: 'Gestisci utenza', en: 'Manage user' },
    EXACT: false,
    COMPONENT: UserEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE_OPERATOR_LIST: {
    PATH: { it: '/it/erogazione/operatori', en: '/en/provider/operators' },
    LABEL: { it: 'I tuoi operatori API', en: 'Your API operators' },
    EXACT: true,
    COMPONENT: UserList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  PROVIDE: {
    PATH: { it: '/it/erogazione', en: '/en/provider' },
    LABEL: { it: 'Erogazione', en: 'Provider' },
    REDIRECT: { it: '/it/erogazione/e-service', en: '/en/provider/e-service' },
    EXACT: true,
    COMPONENT: EmptyComponent,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
  SUBSCRIBE_CATALOG_VIEW: {
    PATH: {
      it: '/it/fruizione/catalogo-e-service/:eserviceId/:descriptorId',
      en: '/en/subscriber/e-service-catalog/:eserviceId/:descriptorId',
    },
    LABEL: { it: 'Visualizza E-Service', en: 'View E-Service' },
    EXACT: false,
    COMPONENT: EServiceRead,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CATALOG_LIST: {
    PATH: { it: '/it/fruizione/catalogo-e-service', en: '/en/subscriber/e-service-catalog' },
    LABEL: { it: 'Catalogo E-Service', en: 'E-Service catalog' },
    EXACT: false,
    COMPONENT: EServiceCatalog,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_PURPOSE_CREATE: {
    PATH: { it: '/it/fruizione/finalita/crea', en: '/en/subscriber/purpose/create' },
    LABEL: { it: 'Crea finalità', en: 'Create purpose' },
    EXACT: false,
    COMPONENT: PurposeCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_EDIT: {
    PATH: {
      it: '/it/fruizione/finalita/:purposeId/modifica',
      en: '/en/subrscriber/purpose/:purposeId/edit',
    },
    LABEL: { it: 'Modifica finalità', en: 'Edit purpose' },
    EXACT: false,
    COMPONENT: PurposeCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_VIEW: {
    PATH: { it: '/it/fruizione/finalita/:purposeId', en: '/en/subscriber/purpose/:purposeId' },
    LABEL: { it: 'Gestisci singola finalità', en: 'Manage purpose' },
    EXACT: false,
    COMPONENT: PurposeView,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_PURPOSE_LIST: {
    PATH: { it: '/it/fruizione/finalita', en: '/en/subscriber/purpose' },
    LABEL: { it: 'Le tue finalità', en: 'Your purpose' },
    EXACT: false,
    COMPONENT: PurposeList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_OPERATOR_EDIT: {
    PATH: {
      it: '/it/fruizione/client/:clientId/operatori/:operatorId',
      en: '/en/subscriber/client/:clientId/operators/:operatorId',
    },
    LABEL: { it: 'Gestisci operatore del client', en: 'Manage client operator' },
    EXACT: false,
    COMPONENT: UserEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_KEY_EDIT: {
    PATH: {
      it: '/it/fruizione/client/:clientId/chiavi/:kid',
      en: '/en/subscriber/client/:clientId/keys/:kid',
    },
    LABEL: { it: 'Gestisci chiave pubblica del client', en: 'Manage client public key' },
    EXACT: false,
    COMPONENT: KeyEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_CREATE: {
    PATH: { it: '/it/fruizione/client/crea', en: '/en/subscriber/client/create' },
    LABEL: { it: 'Crea client', en: 'Create client' },
    EXACT: false,
    COMPONENT: ClientCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_CLIENT_EDIT: {
    PATH: { it: '/it/fruizione/client/:clientId', en: '/en/subscriber/client/:clientId' },
    LABEL: { it: 'Gestisci client', en: 'Manage client' },
    EXACT: true,
    COMPONENT: ClientEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_CLIENT_LIST: {
    PATH: { it: '/it/fruizione/client', en: '/en/subscriber/client' },
    LABEL: { it: 'I tuoi client', en: 'Your clients' },
    EXACT: false,
    COMPONENT: ClientList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_AGREEMENT_EDIT: {
    PATH: {
      it: '/it/fruizione/accordi/:agreementId',
      en: '/en/subscriber/agreements/:agreementId',
    },
    LABEL: { it: 'Gestisci richiesta', en: 'Manage request' },
    EXACT: false,
    COMPONENT: AgreementEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_AGREEMENT_LIST: {
    PATH: { it: '/it/fruizione/accordi', en: '/en/subscriber/agreements' },
    LABEL: { it: 'Le tue richieste', en: 'Your requests' },
    EXACT: true,
    COMPONENT: AgreementList,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT: {
    PATH: {
      it: '/it/fruizione/interop-m2m/:clientId/operatori/:operatorId',
      en: '/en/subscriber/interop-m2m/:clientId/operators/:operatorId',
    },
    LABEL: { it: 'Gestisci operatore del client', en: 'Manage client operator' },
    EXACT: false,
    COMPONENT: UserEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT: {
    PATH: {
      it: '/it/fruizione/interop-m2m/:clientId/chiavi/:kid',
      en: '/en/subscriber/interop-m2m/:clientId/keys/:kid',
    },
    LABEL: { it: 'Gestisci chiave pubblica del client', en: 'Manage client public key' },
    EXACT: false,
    COMPONENT: KeyEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE: {
    PATH: { it: '/it/fruizione/interop-m2m/crea', en: '/en/subscriber/interop-m2m/create' },
    LABEL: { it: 'Crea client M2M', en: 'Create M2M client' },
    COMPONENT: ClientCreate,
    PUBLIC: false,
    AUTH_LEVELS: ['admin'],
  },
  SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT: {
    PATH: { it: '/it/fruizione/interop-m2m/:clientId', en: '/en/subscriber/interop-m2m/:clientId' },
    LABEL: { it: 'Gestisci client M2M', en: 'Manage M2M client' },
    EXACT: true,
    COMPONENT: ClientEdit,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE_INTEROP_M2M: {
    PATH: { it: '/it/fruizione/interop-m2m', en: '/en/subscriber/interop-m2m' },
    LABEL: { it: 'Interop M2M', en: 'Interop M2M' },
    COMPONENT: InteropM2M,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'security'],
  },
  SUBSCRIBE: {
    PATH: { it: '/it/fruizione', en: '/en/subscriber' },
    LABEL: { it: 'Fruizione', en: 'Subscriber' },
    REDIRECT: { it: '/it/fruizione/catalogo-e-service', en: '/en/subscriber/e-service-catalog' },
    EXACT: true,
    COMPONENT: EmptyComponent,
    PUBLIC: false,
    AUTH_LEVELS: ['admin', 'api'],
  },
}
