import { ApiEndpointContent } from '../../types'

export const API: Record<string, ApiEndpointContent> = {
  ONBOARDING_GET_USER: {
    URL: 'pdnd-interop-uservice-user-registry-management/0.1/users/external-id',
    METHOD: 'POST',
  },
  ONBOARDING_CREATE_USER: {
    URL: 'pdnd-interop-uservice-user-registry-management/0.1/users',
    METHOD: 'POST',
  },
  ONBOARDING_GET_AVAILABLE_PARTIES: {
    URL: 'pdnd-interop-uservice-party-process/0.1/onboarding/info',
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
    URL: 'pdnd-interop-uservice-party-management/0.1/organizations/external/:id',
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
