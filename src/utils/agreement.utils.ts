import type {
  Agreement,
  AgreementState,
  CatalogDescriptorEService,
  CatalogEService,
  CatalogEServiceDescriptor,
} from '@/api/api.generatedTypes'

/**
 * Checks if the user has already an active agreement for the given e-service.
 * An agreement is considered active if the eservice object owns the `agreement` property and its state is not one of the following:
 * - REJECTED
 * - DRAFT
 * - ARCHIVED
 * @param eservice The e-service to check
 * @returns `true` if the user has already an active agreement for the given e-service, `false` otherwise
 */
export const checkIfAlreadySubscribed = (
  eservice: CatalogEService | CatalogDescriptorEService | undefined
) => {
  if (!eservice?.agreement) return false
  const notSubscribedStates: Array<AgreementState> = ['REJECTED', 'DRAFT', 'ARCHIVED']

  return !notSubscribedStates.includes(eservice.agreement.state)
}

/**
 * Checks if the user has already an agreement draft for the given e-service.
 * @param eservice The e-service to check
 * @returns `true` if the user has already an agreement draft for the given e-service, `false` otherwise
 */
export const checkIfhasAlreadyAgreementDraft = (
  eservice: CatalogEService | CatalogDescriptorEService | undefined
) => {
  return !!(eservice?.agreement && eservice.agreement.state === 'DRAFT')
}
/**
 * Checks if the user can create an agreement draft for the given e-service.
 * @param eservice The e-service to check
 * @param descriptor the actual viewing descriptor
 * @returns `true` if the user can create an agreement draft for the given e-service, `false` otherwise
 */
export const checkIfcanCreateAgreementDraft = (
  eservice: CatalogEService | CatalogDescriptorEService | undefined,
  descriptor?: CatalogEServiceDescriptor
) => {
  if (!eservice || !descriptor) return false

  let result = false

  /**
   * I can subscribe to the eservice only if...
   * ... I own all the certified attributes...
   * ...or if the subscriber is the owner of the eservice...
   * */
  if (descriptor.eservice.hasCertifiedAttributes || eservice.isMine) {
    result = true
  }

  const isSubscribed = checkIfAlreadySubscribed(eservice)
  const hasAgreementDraft = checkIfhasAlreadyAgreementDraft(eservice)

  /**
   * ... but only if I'm not subscribed to it yet...
   * ... and I don't have an agreement draft...
   */
  if (isSubscribed || hasAgreementDraft) {
    result = false
  }

  // ... and the actual viewing descriptor is published or suspended!
  if (!['PUBLISHED', 'SUSPENDED'].includes(descriptor.state)) {
    result = false
  }

  return result
}

/**
 * The agreement can be upgraded if:
 * - The agreement is in ACTIVE or SUSPENDED state
 * - The active descriptor is in PUBLISHED or SUSPENDED state
 * - The active descriptor has a higher version than the agreement
 *
 * @param agreement The agreement to check
 * @returns `true` if the agreement can be upgraded, `false` otherwise
 */
export const canAgreementBeUpgraded = (agreement?: Agreement) => {
  if (!agreement) return false
  const eserviceActiveDescriptor = agreement.eservice.activeDescriptor
  if (!eserviceActiveDescriptor) return false

  const isActiveDescriptorPublishedOrSuspended = ['PUBLISHED', 'SUSPENDED'].includes(
    eserviceActiveDescriptor.state
  )
  const hasNewVersion =
    parseInt(eserviceActiveDescriptor.version, 10) > parseInt(agreement.eservice.version, 10)
  const isAgreementActiveOrSuspended = ['ACTIVE', 'SUSPENDED'].includes(agreement.state)

  return hasNewVersion && isActiveDescriptorPublishedOrSuspended && isAgreementActiveOrSuspended
}

/**
 * Check if there is an available new e-service version for the given agreement.
 * This is used in the agreement creation page.
 */
export const isNewEServiceVersionAvailable = (agreement: Agreement | undefined) => {
  const eserviceActiveDescriptor = agreement?.eservice.activeDescriptor
  return Boolean(
    eserviceActiveDescriptor &&
      parseInt(eserviceActiveDescriptor.version, 10) > parseInt(agreement.eservice.version, 10)
  )
}
