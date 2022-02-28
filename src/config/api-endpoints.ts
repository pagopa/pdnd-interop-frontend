import { ApiEndpointContent, ApiEndpointKey } from '../../types'

export const API: Record<ApiEndpointKey, ApiEndpointContent> = {
  ONBOARDING_GET_AVAILABLE_PARTIES: {
    URL: 'party-process/0.1/onboarding/info',
    METHOD: 'GET',
  },
  PARTY_GET_PARTY_ID: {
    URL: 'party-management/0.1/organizations/external/:id',
    METHOD: 'GET',
  },
  ESERVICE_GET_LIST: {
    URL: 'catalog-process/0.1/eservices',
    METHOD: 'GET',
  },
  ESERVICE_GET_LIST_FLAT: {
    // TEMP PIN-1052
    URL: 'catalog-process/0.1/flatten/eservices',
    METHOD: 'GET',
  },
  ESERVICE_GET_SINGLE: {
    URL: 'catalog-process/0.1/eservices/:eserviceId',
    METHOD: 'GET',
  },
  ESERVICE_DRAFT_CREATE: {
    URL: 'catalog-process/0.1/eservices',
    METHOD: 'POST',
  },
  ESERVICE_DRAFT_UPDATE: {
    URL: 'catalog-process/0.1/eservices/:eserviceId',
    METHOD: 'PUT',
  },
  ESERVICE_DRAFT_DELETE: {
    URL: 'catalog-process/0.1/eservices/:eserviceId',
    METHOD: 'DELETE',
  },
  ESERVICE_CLONE_FROM_VERSION: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/clone',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_CREATE: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_UPDATE: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId',
    METHOD: 'PUT',
  },
  ESERVICE_VERSION_DRAFT_PUBLISH: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/publish',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_SUSPEND: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/suspend',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_REACTIVATE: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/activate',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_DELETE: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId',
    METHOD: 'DELETE',
  },
  ESERVICE_VERSION_DRAFT_POST_DOCUMENT: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/documents',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId',
    METHOD: 'DELETE',
  },
  ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId/update',
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {
    URL: 'catalog-process/0.1/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId',
    METHOD: 'GET',
  },
  ATTRIBUTE_GET_LIST: {
    URL: 'attribute-registry-management/0.1/attributes',
    METHOD: 'GET',
  },
  ATTRIBUTE_CREATE: {
    URL: 'attribute-registry-management/0.1/attributes',
    METHOD: 'POST',
  },
  AGREEMENT_CREATE: {
    URL: 'agreement-process/0.1/agreements',
    METHOD: 'POST',
  },
  AGREEMENT_GET_LIST: {
    URL: 'agreement-process/0.1/agreements',
    METHOD: 'GET',
  },
  AGREEMENT_GET_SINGLE: {
    URL: 'agreement-process/0.1/agreements/:agreementId',
    METHOD: 'GET',
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    URL: 'agreement-process/0.1/agreements/:agreementId/attributes/:attributeId/verify',
    METHOD: 'PATCH',
  },
  AGREEMENT_ACTIVATE: {
    URL: 'agreement-process/0.1/agreements/:agreementId/parties/:partyId/activate',
    METHOD: 'PATCH',
  },
  AGREEMENT_SUSPEND: {
    URL: 'agreement-process/0.1/agreements/:agreementId/parties/:partyId/suspend',
    METHOD: 'PATCH',
  },
  AGREEMENT_UPGRADE: {
    URL: 'agreement-process/0.1/agreements/:agreementId/upgrade',
    METHOD: 'POST',
  },
  PURPOSE_GET_LIST: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes',
    METHOD: 'GET',
  },
  PURPOSE_GET_SINGLE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId',
    METHOD: 'GET',
  },
  PURPOSE_DRAFT_CREATE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes',
    METHOD: 'POST',
  },
  PURPOSE_DRAFT_UPDATE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId/update',
    METHOD: 'POST',
  },
  // Only applicable if empty or just 1 version in DRAFT
  PURPOSE_DRAFT_DELETE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId',
    METHOD: 'DELETE',
  },
  PURPOSE_VERSION_DRAFT_CREATE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId/versions',
    METHOD: 'POST',
  },
  PURPOSE_VERSION_DRAFT_UPDATE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId/versions/:versionId/update',
    METHOD: 'POST',
  },
  PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId/versions/:versionId/documents/:documentId',
    METHOD: 'GET',
  },
  PURPOSE_VERSION_SUSPEND: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId/versions/:versionId/suspend',
    METHOD: 'POST',
  },
  PURPOSE_VERSION_ACTIVATE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId/versions/:versionId/activate',
    METHOD: 'POST',
  },
  PURPOSE_VERSION_ARCHIVE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: 'purpose-process/0.1/purposes/:purposeId/versions/:versionId/archive',
    METHOD: 'POST',
  },
  CLIENT_GET_LIST: {
    URL: 'authorization-process/0.1/clients',
    METHOD: 'GET',
  },
  CLIENT_GET_SINGLE: {
    URL: 'authorization-process/0.1/clients/:clientId',
    METHOD: 'GET',
  },
  CLIENT_CREATE: {
    URL: 'authorization-process/0.1/clients',
    METHOD: 'POST',
  },
  CLIENT_SUSPEND: {
    // TEMP PIN-1026
    URL: 'authorization-process/0.1/clients/:clientId/suspend',
    METHOD: 'POST',
  },
  CLIENT_ACTIVATE: {
    // TEMP PIN-1026
    URL: 'authorization-process/0.1/clients/:clientId/activate',
    METHOD: 'POST',
  },
  CLIENT_JOIN_WITH_PURPOSE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: '',
    METHOD: 'POST',
  },
  CLIENT_REMOVE_FROM_PURPOSE: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: '',
    METHOD: 'POST',
  },

  KEY_GET_LIST: {
    URL: 'authorization-process/0.1/clients/:clientId/keys',
    METHOD: 'GET',
  },
  KEY_GET_SINGLE: {
    URL: 'authorization-process/0.1/clients/:clientId/keys/:kid',
    METHOD: 'GET',
  },
  KEY_POST: {
    URL: 'authorization-process/0.1/clients/:clientId/keys',
    METHOD: 'POST',
  },
  KEY_DOWNLOAD: {
    URL: 'authorization-process/0.1/clients/:clientId/encoded/keys/:keyId',
    METHOD: 'GET',
  },
  KEY_DELETE: {
    URL: 'authorization-process/0.1/clients/:clientId/keys/:keyId',
    METHOD: 'DELETE',
  },
  USER_GET_LIST: {
    URL: 'party-process/0.1/institutions/:institutionId/relationships',
    METHOD: 'GET',
  },
  USER_GET_SINGLE: {
    URL: 'party-management/0.1/persons/:id',
    METHOD: 'GET',
  },
  USER_SUSPEND: {
    URL: 'party-process/0.1/relationships/:relationshipId/suspend',
    METHOD: 'POST',
  },
  USER_REACTIVATE: {
    URL: 'party-process/0.1/relationships/:relationshipId/activate',
    METHOD: 'POST',
  },
  OPERATOR_CREATE: {
    URL: 'party-process/0.1/onboarding/operators',
    METHOD: 'POST',
  },
  OPERATOR_SECURITY_JOIN_WITH_CLIENT: {
    URL: 'authorization-process/0.1/clients/:clientId/relationships/:relationshipId',
    METHOD: 'POST',
  },
  OPERATOR_SECURITY_REMOVE_FROM_CLIENT: {
    URL: 'authorization-process/0.1/clients/:clientId/relationships/:relationshipId',
    METHOD: 'DELETE',
  },
  OPERATOR_API_GET_SINGLE: {
    URL: 'party-process/0.1/relationships/:relationshipId',
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_GET_LIST: {
    URL: 'authorization-process/0.1/clients/:clientId/operators',
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_GET_SINGLE: {
    URL: 'authorization-process/0.1/clients/:clientId/operators',
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_GET_KEYS_LIST: {
    URL: 'authorization-process/0.1/clients/:clientId/operators/:operatorId/keys',
    METHOD: 'GET',
  },
}
