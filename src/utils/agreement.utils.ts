import type { Agreement } from '@/api/api.generatedTypes'
import type { ProviderOrConsumer } from '@/types/common.types'

/**
 * The agreement can be upgraded if:
 * - The agreement is in ACTIVE or SUSPENDED state
 * - The active descriptor is in PUBLISHED or SUSPENDED state
 * - The active descriptor has a higher version than the agreement
 * - The user is in the consumer context
 *
 * @param agreement The agreement to check
 * @param mode The actual user context (provider or consumer)
 * @returns `true` if the agreement can be upgraded, `false` otherwise
 */
export const canAgreementBeUpgraded = (agreement: Agreement, mode: ProviderOrConsumer) => {
  const eserviceActiveDescriptor = agreement.eservice.activeDescriptor
  if (!eserviceActiveDescriptor) return false

  const isConsumer = mode === 'consumer'
  const isActiveDescriptorPublishedOrSuspended = ['PUBLISHED', 'SUSPENDED'].includes(
    eserviceActiveDescriptor.state
  )
  const hasNewVersion = eserviceActiveDescriptor.version > agreement.eservice.version
  const isAgreementActiveOrSuspended = ['ACTIVE', 'SUSPENDED'].includes(agreement.state)

  return (
    isConsumer &&
    hasNewVersion &&
    isActiveDescriptorPublishedOrSuspended &&
    isAgreementActiveOrSuspended
  )
}
