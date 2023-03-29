import type { Agreement } from '../api.generatedTypes'

export function updateAgreementsListCache(
  newAgreementData: Agreement,
  agreementsListCache: Array<Agreement> = []
) {
  const agreementsListCacheCopy = [...agreementsListCache]
  const index = agreementsListCacheCopy.findIndex(
    (agreement) => agreement.id === newAgreementData.id
  )
  if (index !== -1) {
    agreementsListCacheCopy[index] = newAgreementData
  }
  return agreementsListCacheCopy
}

export function removeAgreementFromListCache(
  agreementId: string,
  agreementsListCache: Array<Agreement> = []
) {
  return agreementsListCache.filter((agreementCache) => agreementCache.id !== agreementId)
}
