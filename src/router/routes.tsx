import React from 'react'
import { type InferRouteKey, InteropRouterBuilder } from '@pagopa/interop-fe-commons'
import { createBrowserRouter } from 'react-router-dom'
import {
  PartyRegistryPage,
  ConsumerEServiceCatalogPage,
  ProviderEServiceListPage,
  ProviderAgreementsListPage,
  ConsumerAgreementsListPage,
  ConsumerPurposesListPage,
  ConsumerClientListPage,
  ConsumerClientM2MListPage,
  ConsumerEServiceDetailsPage,
  TOSPage,
  PrivacyPolicyPage,
  ProviderEServiceDetailsPage,
  ConsumerAgreementDetailsPage,
  ProviderAgreementDetailsPage,
  ProviderPurposeDetailsPage,
  OperatorDetailsPage,
  LogoutPage,
  KeyDetailsPage,
  ConsumerClientCreatePage,
  ConsumerPurposeCreatePage,
  ConsumerAgreementCreatePage,
  NotFoundPage,
  ConsumerClientManagePage,
  ConsumerPurposeEditPage,
  ProviderEServiceCreatePage,
  ProviderPurposesListPage,
  ConsumerPurposeDetailsPage,
  ConsumerDebugVoucherPage,
  AssistanceTenantSelectionPage,
  AssistanceTenantSelectionErrorPage,
  ConsumerPurposeSummaryPage,
  ProviderEServiceSummaryPage,
  TenantCertifierPage,
  TenantCertifierAttributeDetails,
  ProviderKeychainsListPage,
  ProviderKeychainCreatePage,
  ProviderKeychainDetailsPage,
  ProviderKeychainUserDetailsPage,
  ProviderKeychainPublicKeyDetailsPage,
  DelegationsPage,
  DelegationCreatePage,
  DelegationDetailsPage,
  ProviderEServiceTemplatesCatalogPage,
  ProviderEServiceTemplatesListPage,
  ProviderEServiceTemplateDetailsPage,
  ProviderEServiceTemplateCreatePage,
  ProviderEServiceTemplateSummaryPage,
  ProviderEServiceFromTemplateCreatePage,
  RiskAnalysisEServiceAssociatedPage,
  DeveloperToolsPage,
  RiskAnalysisExporterToolPage,
} from '@/pages'
import RoutesWrapper from './components/RoutesWrapper'
import type { LangCode } from '@/types/common.types'
import type { UserProductRole } from '@/types/party.types'
import ConsumerEServiceTemplateDetailsPage from '@/pages/ConsumerEServiceTemplateDetailsPage/ConsumerEServiceTemplateDetails.page'
import ConsumerPurposeTemplateListPage from '@/pages/ConsumerPurposeTemplateListPage/ConsumerPurposeTemplateList.page'
import ConsumerPurposeTemplateCatalogPage from '@/pages/ConsumerPurposeTemplateCatalogPage/ConsumerPurposeTemplateCatalog.page'
import { ConsumerPurposeTemplateDetailsPage } from '@/pages/ConsumerPurposeTemplateDetailsPage'

export const { routes, reactRouterDOMRoutes, hooks, components, utils } = new InteropRouterBuilder<
  LangCode,
  UserProductRole,
  { hideSideNav: boolean }
>({
  languages: ['it', 'en'],
})
  .addRoute({
    key: 'LOGOUT',
    path: '/logout',
    element: <LogoutPage />,
    public: true,
    hideSideNav: true,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'TOS',
    path: '/termini-di-servizio',
    element: <TOSPage />,
    public: true,
    hideSideNav: true,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'PRIVACY_POLICY',
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />,
    public: true,
    hideSideNav: true,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_CREATE',
    path: '/erogazione/e-service/crea/',
    element: <ProviderEServiceCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_EDIT',
    path: '/erogazione/e-service/:eserviceId/:descriptorId/modifica',
    element: <ProviderEServiceCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_SUMMARY',
    path: '/erogazione/e-service/:eserviceId/:descriptorId/modifica/riepilogo',
    element: <ProviderEServiceSummaryPage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_MANAGE',
    path: '/erogazione/e-service/:eserviceId/:descriptorId',
    element: <ProviderEServiceDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_LIST',
    path: '/erogazione/e-service',
    element: <ProviderEServiceListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'PROVIDE_AGREEMENT_READ',
    path: '/erogazione/richieste/:agreementId',
    element: <ProviderAgreementDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api'],
  })
  .addRoute({
    key: 'PROVIDE_AGREEMENT_LIST',
    path: '/erogazione/richieste',
    element: <ProviderAgreementsListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api'],
  })
  .addRoute({
    key: 'PROVIDE_PURPOSE_LIST',
    path: '/erogazione/finalita',
    element: <ProviderPurposesListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api'],
  })
  .addRoute({
    key: 'PROVIDE_PURPOSE_DETAILS',
    path: '/erogazione/finalita/:purposeId',
    element: <ProviderPurposeDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api'],
  })
  .addRoute({
    key: 'SUBSCRIBE_CATALOG_VIEW',
    path: '/catalogo-e-service/:eserviceId/:descriptorId',
    element: <ConsumerEServiceDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security', 'api'],
  })
  .addRoute({
    key: 'SUBSCRIBE_CATALOG_LIST',
    path: '/catalogo-e-service',
    element: <ConsumerEServiceCatalogPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security', 'api'],
  })
  .addRoute({
    key: 'SUBSCRIBE_PURPOSE_CREATE',
    path: '/fruizione/finalita/crea',
    element: <ConsumerPurposeCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin'],
  })
  .addRoute({
    key: 'SUBSCRIBE_PURPOSE_EDIT',
    path: '/fruizione/finalita/:purposeId/modifica',
    element: <ConsumerPurposeEditPage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin'],
  })
  .addRoute({
    key: 'SUBSCRIBE_PURPOSE_SUMMARY',
    path: '/fruizione/finalita/:purposeId/riepilogo',
    element: <ConsumerPurposeSummaryPage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin'],
  })
  .addRoute({
    key: 'SUBSCRIBE_PURPOSE_DETAILS',
    path: '/fruizione/finalita/:purposeId',
    element: <ConsumerPurposeDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_PURPOSE_LIST',
    path: '/fruizione/finalita',
    element: <ConsumerPurposesListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_CLIENT_OPERATOR_EDIT',
    path: '/gestione-client/api-e-service/:clientId/operatori/:operatorId',
    element: <OperatorDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'security', 'support'],
  })
  .addRoute({
    key: 'SUBSCRIBE_CLIENT_KEY_EDIT',
    path: '/gestione-client/api-e-service/:clientId/chiavi/:kid',
    element: <KeyDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'security', 'support'],
  })
  .addRoute({
    key: 'SUBSCRIBE_CLIENT_CREATE',
    path: '/gestione-client/api-e-service/crea',
    element: <ConsumerClientCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin'],
  })
  .addRoute({
    key: 'SUBSCRIBE_CLIENT_EDIT',
    path: '/gestione-client/api-e-service/:clientId',
    element: <ConsumerClientManagePage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_CLIENT_LIST',
    path: '/gestione-client/api-e-service',
    element: <ConsumerClientListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_AGREEMENT_READ',
    path: '/fruizione/richieste/:agreementId',
    element: <ConsumerAgreementDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_AGREEMENT_LIST',
    path: '/fruizione/richieste',
    element: <ConsumerAgreementsListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_AGREEMENT_EDIT',
    path: '/fruizione/richieste/:agreementId/modifica',
    element: <ConsumerAgreementCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin'],
  })
  .addRoute({
    key: 'SUBSCRIBE_INTEROP_M2M_CLIENT_OPERATOR_EDIT',
    path: '/gestione-client/api-interop/:clientId/operatori/:operatorId',
    element: <OperatorDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'security', 'support'],
  })
  .addRoute({
    key: 'SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT',
    path: '/gestione-client/api-interop/:clientId/chiavi/:kid',
    element: <KeyDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'security', 'support'],
  })
  .addRoute({
    key: 'SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE',
    path: '/gestione-client/api-interop/crea',
    element: <ConsumerClientCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin'],
  })
  .addRoute({
    key: 'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT',
    path: '/gestione-client/api-interop/:clientId',
    element: <ConsumerClientManagePage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_INTEROP_M2M',
    path: '/gestione-client/api-interop',
    element: <ConsumerClientM2MListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE',
    path: '/fruizione',
    redirect: 'SUBSCRIBE_AGREEMENT_LIST',
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security', 'api'],
  })
  .addRoute({
    key: 'PARTY_REGISTRY',
    path: '/aderente/anagrafica',
    element: <PartyRegistryPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'ASSISTENCE_PARTY_SELECTION',
    path: '/assistenza/scelta-ente',
    element: <AssistanceTenantSelectionPage />,
    public: true,
    hideSideNav: true,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'ASSISTENCE_PARTY_SELECTION_ERROR',
    path: '/assistenza/errore',
    element: <AssistanceTenantSelectionErrorPage />,
    public: true,
    hideSideNav: true,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'NOT_FOUND',
    path: '/404',
    element: <NotFoundPage />,
    public: true,
    hideSideNav: true,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'DEFAULT',
    path: '/',
    redirect: 'SUBSCRIBE_CATALOG_LIST',
    public: true,
    hideSideNav: true,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_DEBUG_VOUCHER',
    path: '/tool-sviluppo/debug-voucher',
    element: <ConsumerDebugVoucherPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'TENANT',
    path: '/aderente',
    redirect: 'PARTY_REGISTRY',
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'api', 'security'],
  })
  .addRoute({
    key: 'TENANT_CERTIFIER',
    path: '/aderente/certificatore',
    element: <TenantCertifierPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support'],
  })
  .addRoute({
    key: 'TENANT_CERTIFIER_ATTRIBUTE_DETAILS',
    path: '/aderente/certificatore/attributi/:attributeId',
    element: <TenantCertifierAttributeDetails />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_KEYCHAINS_LIST',
    path: '/erogazione/portachiavi',
    element: <ProviderKeychainsListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'PROVIDE_KEYCHAIN_CREATE',
    path: '/erogazione/portachiavi/crea',
    element: <ProviderKeychainCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin'],
  })
  .addRoute({
    key: 'PROVIDE_KEYCHAIN_DETAILS',
    path: 'erogazione/portachiavi/:keychainId',
    element: <ProviderKeychainDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'PROVIDE_KEYCHAIN_USER_DETAILS',
    path: '/erogazione/portachiavi/:keychainId/user/:userId',
    element: <ProviderKeychainUserDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'PROVIDE_KEYCHAIN_PUBLIC_KEY_DETAILS',
    path: '/erogazione/portachiavi/:keychainId/chiavi-pubbliche/:keyId',
    element: <ProviderKeychainPublicKeyDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'DELEGATIONS',
    path: '/aderente/deleghe',
    element: <DelegationsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support'],
  })
  .addRoute({
    key: 'CREATE_DELEGATION',
    path: '/aderente/deleghe/crea',
    element: <DelegationCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'support'],
  })
  .addRoute({
    key: 'DELEGATION_DETAILS',
    path: '/aderente/deleghe/:delegationId',
    element: <DelegationDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_TEMPLATE_CATALOG',
    path: '/erogazione/catalogo-template',
    element: <ProviderEServiceTemplatesCatalogPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_TEMPLATE_LIST',
    path: '/erogazione/template-eservice',
    element: <ProviderEServiceTemplatesListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'PROVIDE',
    path: '/erogazione',
    redirect: 'PROVIDE_ESERVICE_LIST',
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_TEMPLATE_DETAILS',
    path: '/erogazione/template-eservice/:eServiceTemplateId/:eServiceTemplateVersionId',
    element: <ProviderEServiceTemplateDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS',
    path: '/erogazione/catalogo-template/:eServiceTemplateId/:eServiceTemplateVersionId',
    element: <ConsumerEServiceTemplateDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_TEMPLATE_CREATE',
    path: '/erogazione/template-eservice/crea',
    element: <ProviderEServiceTemplateCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_TEMPLATE_EDIT',
    path: '/erogazione/template-eservice/:eServiceTemplateId/:eServiceTemplateVersionId/modifica',
    element: <ProviderEServiceTemplateCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_TEMPLATE_SUMMARY',
    path: '/erogazione/template-eservice/:eServiceTemplateId/:eServiceTemplateVersionId/modifica/riepilogo',
    element: <ProviderEServiceTemplateSummaryPage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'PROVIDE_ESERVICE_FROM_TEMPLATE_CREATE',
    path: '/erogazione/template-eservice/:eServiceTemplateId/e-service/crea',
    element: <ProviderEServiceFromTemplateCreatePage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'WATCH_RISK_ANALYSIS_FOR_ESERVICE',
    path: '/erogazione/e-service/:eserviceId/:descriptorId/finalita',
    element: <RiskAnalysisEServiceAssociatedPage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'DEVELOPER_TOOLS',
    path: '/tool-sviluppo',
    element: <DeveloperToolsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support', 'security'],
  })
  .addRoute({
    key: 'RISK_ANALYSIS_EXPORTER_TOOL',
    path: '/tool-sviluppo/export-analisi-del-rischio',
    element: <RiskAnalysisExporterToolPage />,
    public: false,
    hideSideNav: true,
    authLevels: ['admin', 'api', 'support', 'security'],
  })
  .addRoute({
    key: 'CLIENT_MANAGEMENT',
    path: '/gestione-client',
    redirect: 'SUBSCRIBE_CLIENT_LIST',
    element: <ConsumerClientListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'support', 'security'],
  })
  .addRoute({
    key: 'SUBSCRIBE_PURPOSE_TEMPLATE_LIST',
    path: 'fruizione/template-finalita',
    element: <ConsumerPurposeTemplateListPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'SUBSCRIBE_PURPOSE_TEMPLATE_CATALOG',
    path: 'fruizione/catalogo-template-finalita',
    element: <ConsumerPurposeTemplateCatalogPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support'],
  })
  .addRoute({
    key: 'SUBSCRIBE_PURPOSE_TEMPLATE_DETAILS',
    path: 'fruizione/template-finalita/:purposeTemplateId',
    element: <ConsumerPurposeTemplateDetailsPage />,
    public: false,
    hideSideNav: false,
    authLevels: ['admin', 'api', 'support'],
  })
  .build()

export type RouteKey = InferRouteKey<typeof routes>

export const router = createBrowserRouter(
  [
    { element: <RoutesWrapper />, children: reactRouterDOMRoutes },
    { path: '/', element: <components.Redirect to="SUBSCRIBE_CATALOG_LIST" /> },
    { path: '/*', element: <components.Redirect to="NOT_FOUND" /> },
  ],
  { basename: '/ui' }
)
