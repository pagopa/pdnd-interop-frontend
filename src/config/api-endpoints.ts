import { ApiEndpointContent, ApiEndpointKey } from '../../types'
import {
  AGREEMENT_PROCESS_URL,
  AUTHORIZATION_PROCESS_URL,
  BACKEND_FOR_FRONTEND_URL,
  CATALOG_PROCESS_URL,
  PURPOSE_PROCESS_URL,
} from '../lib/env'

export const API: Record<ApiEndpointKey, ApiEndpointContent> = {
  AUTH_HEALTH_CHECK: {
    URL: `${BACKEND_FOR_FRONTEND_URL}/status`,
    METHOD: 'GET',
  },
  AUTH_OBTAIN_SESSION_TOKEN: {
    URL: `${BACKEND_FOR_FRONTEND_URL}/session/tokens`,
    METHOD: 'POST',
  },
  ESERVICE_GET_LIST_FLAT: {
    URL: `${CATALOG_PROCESS_URL}/flatten/eservices`,
    METHOD: 'GET',
  },
  ESERVICE_GET_SINGLE: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId`,
    METHOD: 'GET',
  },
  ESERVICE_DRAFT_CREATE: {
    URL: `${CATALOG_PROCESS_URL}/eservices`,
    METHOD: 'POST',
  },
  ESERVICE_DRAFT_UPDATE: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId`,
    METHOD: 'PUT',
  },
  ESERVICE_DRAFT_DELETE: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId`,
    METHOD: 'DELETE',
  },
  ESERVICE_CLONE_FROM_VERSION: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/clone`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_CREATE: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_UPDATE: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId`,
    METHOD: 'PUT',
  },
  ESERVICE_VERSION_DRAFT_PUBLISH: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/publish`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_SUSPEND: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/suspend`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_REACTIVATE: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/activate`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_DELETE: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId`,
    METHOD: 'DELETE',
  },
  ESERVICE_VERSION_DRAFT_POST_DOCUMENT: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DRAFT_DELETE_DOCUMENT: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId`,
    METHOD: 'DELETE',
  },
  ESERVICE_VERSION_DRAFT_UPDATE_DOCUMENT_DESCRIPTION: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId/update`,
    METHOD: 'POST',
  },
  ESERVICE_VERSION_DOWNLOAD_DOCUMENT: {
    URL: `${CATALOG_PROCESS_URL}/eservices/:eserviceId/descriptors/:descriptorId/documents/:documentId`,
    METHOD: 'GET',
  },
  ATTRIBUTE_GET_CERTIFIED_LIST: {
    URL: `${BACKEND_FOR_FRONTEND_URL}/institutions/:institutionId/certifiedAttributes`,
    METHOD: 'GET',
  },
  ATTRIBUTE_GET_LIST: {
    URL: `${BACKEND_FOR_FRONTEND_URL}/attributes`,
    METHOD: 'GET',
  },
  ATTRIBUTE_GET_SINGLE: {
    URL: `${BACKEND_FOR_FRONTEND_URL}/attributes/origin/:origin/code/:code`,
    METHOD: 'GET',
  },
  ATTRIBUTE_CREATE: {
    URL: `${BACKEND_FOR_FRONTEND_URL}/attributes`,
    METHOD: 'POST',
  },
  AGREEMENT_CREATE: {
    URL: `${AGREEMENT_PROCESS_URL}/agreements`,
    METHOD: 'POST',
  },
  AGREEMENT_GET_LIST: {
    URL: `${AGREEMENT_PROCESS_URL}/agreements`,
    METHOD: 'GET',
  },
  AGREEMENT_GET_SINGLE: {
    URL: `${AGREEMENT_PROCESS_URL}/agreements/:agreementId`,
    METHOD: 'GET',
  },
  AGREEMENT_VERIFY_ATTRIBUTE: {
    URL: `${AGREEMENT_PROCESS_URL}/agreements/:agreementId/attributes/:attributeId/verify`,
    METHOD: 'POST',
  },
  AGREEMENT_ACTIVATE: {
    URL: `${AGREEMENT_PROCESS_URL}/agreements/:agreementId/parties/:partyId/activate`,
    METHOD: 'POST',
  },
  AGREEMENT_SUSPEND: {
    URL: `${AGREEMENT_PROCESS_URL}/agreements/:agreementId/parties/:partyId/suspend`,
    METHOD: 'POST',
  },
  AGREEMENT_UPGRADE: {
    URL: `${AGREEMENT_PROCESS_URL}/agreements/:agreementId/upgrade`,
    METHOD: 'POST',
  },
  PURPOSE_GET_LIST: {
    URL: `${PURPOSE_PROCESS_URL}/purposes`,
    METHOD: 'GET',
  },
  PURPOSE_GET_SINGLE: {
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId`,
    METHOD: 'GET',
  },
  PURPOSE_DRAFT_CREATE: {
    URL: `${PURPOSE_PROCESS_URL}/purposes`,
    METHOD: 'POST',
  },
  PURPOSE_DRAFT_UPDATE: {
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId`,
    METHOD: 'POST',
  },
  PURPOSE_DRAFT_DELETE: {
    // Only applicable if empty or just 1 version in DRAFT
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId`,
    METHOD: 'DELETE',
  },
  PURPOSE_VERSION_DRAFT_CREATE: {
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId/versions`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_DRAFT_UPDATE: {
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId/versions/:versionId/update/draft`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_WAITING_FOR_APPROVAL_UPDATE: {
    // To TEST
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId/versions/:versionId/update/waitingForApproval`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_RISK_ANALYSIS_DOWNLOAD: {
    // TEMP BACKEND: waiting for backend endpoint
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId/versions/:versionId/documents/:documentId`,
    METHOD: 'GET',
  },
  PURPOSE_VERSION_SUSPEND: {
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId/versions/:versionId/suspend`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_ACTIVATE: {
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId/versions/:versionId/activate`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_ARCHIVE: {
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId/versions/:versionId/archive`,
    METHOD: 'POST',
  },
  PURPOSE_VERSION_DELETE: {
    URL: `${PURPOSE_PROCESS_URL}/purposes/:purposeId/versions/:versionId`,
    METHOD: 'DELETE',
  },
  CLIENT_GET_LIST: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients`,
    METHOD: 'GET',
  },
  CLIENT_GET_SINGLE: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId`,
    METHOD: 'GET',
  },
  CLIENT_CREATE: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clientsConsumer`,
    METHOD: 'POST',
  },
  CLIENT_DELETE: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId`,
    METHOD: 'DELETE',
  },
  CLIENT_INTEROP_M2M_CREATE: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clientsApi`,
    METHOD: 'POST',
  },
  CLIENT_JOIN_WITH_PURPOSE: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/purposes`,
    METHOD: 'POST',
  },
  CLIENT_REMOVE_FROM_PURPOSE: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/purposes/:purposeId`,
    METHOD: 'DELETE',
  },
  KEY_GET_LIST: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/keys`,
    METHOD: 'GET',
  },
  KEY_GET_SINGLE: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/keys/:kid`,
    METHOD: 'GET',
  },
  KEY_POST: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/keys`,
    METHOD: 'POST',
  },
  KEY_DOWNLOAD: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/encoded/keys/:keyId`,
    METHOD: 'GET',
  },
  KEY_DELETE: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/keys/:keyId`,
    METHOD: 'DELETE',
  },
  USER_GET_LIST: {
    URL: `${BACKEND_FOR_FRONTEND_URL}/institutions/:institutionId/relationships`,
    METHOD: 'GET',
  },
  OPERATOR_GET_SINGLE: {
    URL: `${BACKEND_FOR_FRONTEND_URL}/relationships/:relationshipId`,
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_JOIN_WITH_CLIENT: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/relationships/:relationshipId`,
    METHOD: 'POST',
  },
  OPERATOR_SECURITY_REMOVE_FROM_CLIENT: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/relationships/:relationshipId`,
    METHOD: 'DELETE',
  },
  OPERATOR_SECURITY_GET_LIST: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/operators`,
    METHOD: 'GET',
  },
  OPERATOR_SECURITY_GET_KEYS_LIST: {
    URL: `${AUTHORIZATION_PROCESS_URL}/clients/:clientId/operators/:operatorId/keys`,
    METHOD: 'GET',
  },
}
