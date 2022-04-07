import { ApiEndpointContent, ApiEndpointKey } from '../../types'

const API_VERSION = '0.1'

export const API: Record<ApiEndpointKey, ApiEndpointContent> = {
  ONBOARDING_GET_AVAILABLE_PARTIES: {
    URL: `party-process/${API_VERSION}/onboarding/info`,
    METHOD: 'GET',
  },
  ESERVICE_GET_LIST_FLAT: {
    URL: `catalog-process/${API_VERSION}/flatten/eservices`,
    METHOD: 'GET',
  },
  ESERVICE_GET_SINGLE: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId`,
    METHOD: 'GET',
  },
  ESERVICE_DRAFT_CREATE: {
    URL: `catalog-process/${API_VERSION}/eservices`,
    METHOD: 'POST',
  },
  ESERVICE_DRAFT_UPDATE: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId`,
    METHOD: 'PUT',
  },
  ESERVICE_DRAFT_DELETE: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId`,
    METHOD: 'DELETE',
  },
  ESERVICE_CLONE_FROM_VERSION: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId/clone`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_CREATE: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_UPDATE: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId`,
    METHOD: 'PUT',
  },
  ESERVICE_VERSION_DRAFT_PUBLISH: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId/publish`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_SUSPEND: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId/suspend`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_REACTIVATE: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId/activate`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_DELETE: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId`,
    METHOD: 'DELETE',
  },
  ESERVICE_VERSION_DRAFT_POST_DOCUMENT: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId/documents`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId`,
    METHOD: 'DELETE',
  },
  ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId/update`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {
    URL: `catalog-process/${API_VERSION}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId`,
    METHOD: 'GET',
  },
  ATTRIBUTE_GET_LIST: {
    URL: `attribute-registry-management/${API_VERSION}/attributes`,
    METHOD: 'GET',
  },
  ATTRIBUTE_GET_SINGLE: {
    URL: `attribute-registry-management/${API_VERSION}/attributes/origin/:origin/code/:code`,
    METHOD: 'GET',
  },
  ATTRIBUTE_CREATE: {
    URL: `attribute-registry-management/${API_VERSION}/attributes`,
    METHOD: 'POST',
  },
  AGREEMENT_CREATE: {
    URL: `agreement-process/${API_VERSION}/agreements`,
    METHOD: 'POST',
  },
  AGREEMENT_GET_LIST: {
    URL: `agreement-process/${API_VERSION}/agreements`,
    METHOD: 'GET',
  },
  AGREEMENT_GET_SINGLE: {
    URL: `agreement-process/${API_VERSION}/agreements/:agreementId`,
    METHOD: 'GET',
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    URL: `agreement-process/${API_VERSION}/agreements/:agreementId/attributes/:attributeId/verify`,
    METHOD: 'POST',
  },
  AGREEMENT_ACTIVATE: {
    URL: `agreement-process/${API_VERSION}/agreements/:agreementId/parties/:partyId/activate`,
    METHOD: 'POST',
  },
  AGREEMENT_SUSPEND: {
    URL: `agreement-process/${API_VERSION}/agreements/:agreementId/parties/:partyId/suspend`,
    METHOD: 'POST',
  },
  AGREEMENT_UPGRADE: {
    URL: `agreement-process/${API_VERSION}/agreements/:agreementId/upgrade`,
    METHOD: 'POST',
  },
  PURPOSE_GET_LIST: {
    URL: `purpose-process/${API_VERSION}/purposes`,
    METHOD: 'GET',
  },
  PURPOSE_GET_SINGLE: {
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId`,
    METHOD: 'GET',
  },
  PURPOSE_DRAFT_CREATE: {
    URL: `purpose-process/${API_VERSION}/purposes`,
    METHOD: 'POST',
  },
  PURPOSE_DRAFT_UPDATE: {
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId`,
    METHOD: 'POST',
  },
  PURPOSE_DRAFT_DELETE: {
    // Only applicable if empty or just 1 version in DRAFT
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId`,
    METHOD: 'DELETE',
  },
  PURPOSE_VERSION_DRAFT_CREATE: {
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId/versions`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_DRAFT_UPDATE: {
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId/versions/:versionId/update/draft`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_WAITING_FOR_APPROVAL_UPDATE: {
    // To TEST
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId/versions/:versionId/update/waitingForApproval`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId/versions/:versionId/documents/:documentId`,
    METHOD: 'GET',
  },
  PURPOSE_VERSION_SUSPEND: {
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId/versions/:versionId/suspend`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_ACTIVATE: {
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId/versions/:versionId/activate`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_ARCHIVE: {
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId/versions/:versionId/archive`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_DELETE: {
    URL: `purpose-process/${API_VERSION}/purposes/:purposeId/versions/:versionId`,
    METHOD: 'DELETE',
  },
  CLIENT_GET_LIST: {
    URL: `authorization-process/${API_VERSION}/clients`,
    METHOD: 'GET',
  },
  CLIENT_GET_SINGLE: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId`,
    METHOD: 'GET',
  },
  CLIENT_CREATE: {
    URL: `authorization-process/${API_VERSION}/clientsConsumer`,
    METHOD: 'POST',
  },
  CLIENT_DELETE: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId`,
    METHOD: 'DELETE',
  },
  CLIENT_INTEROP_M2M_CREATE: {
    URL: `authorization-process/${API_VERSION}/clientsApi`,
    METHOD: 'POST',
  },
  CLIENT_JOIN_WITH_PURPOSE: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/purposes`,
    METHOD: 'POST',
  },
  CLIENT_REMOVE_FROM_PURPOSE: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/purposes/:purposeId`,
    METHOD: 'DELETE',
  },
  KEY_GET_LIST: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/keys`,
    METHOD: 'GET',
  },
  KEY_GET_SINGLE: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/keys/:kid`,
    METHOD: 'GET',
  },
  KEY_POST: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/keys`,
    METHOD: 'POST',
  },
  KEY_DOWNLOAD: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/encoded/keys/:keyId`,
    METHOD: 'GET',
  },
  KEY_DELETE: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/keys/:keyId`,
    METHOD: 'DELETE',
  },
  USER_GET_LIST: {
    URL: `party-process/${API_VERSION}/institutions/:institutionId/relationships`,
    METHOD: 'GET',
  },
  OPERATOR_CREATE: {
    URL: `party-process/${API_VERSION}/onboarding/operators`,
    METHOD: 'POST',
  },
  OPERATOR_GET_SINGLE: {
    URL: `party-process/${API_VERSION}/relationships/:relationshipId`,
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_JOIN_WITH_CLIENT: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/relationships/:relationshipId`,
    METHOD: 'POST',
  },
  OPERATOR_SECURITY_REMOVE_FROM_CLIENT: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/relationships/:relationshipId`,
    METHOD: 'DELETE',
  },
  OPERATOR_SECURITY_GET_LIST: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/operators`,
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_GET_KEYS_LIST: {
    URL: `authorization-process/${API_VERSION}/clients/:clientId/operators/:operatorId/keys`,
    METHOD: 'GET',
  },
}
