import { AgreementSummary } from '@/types/agreement.types'

export function updateAgreementsListCache(
  newAgreementData: AgreementSummary,
  agreementsListCache: Array<AgreementSummary> = []
) {
  const agreementsListCacheCopy = [...agreementsListCache]
  const index = agreementsListCacheCopy.findIndex(
    (agreement) => agreement.id === newAgreementData.id
  )
  if (index !== -1) {
    agreementsListCacheCopy[index] = newAgreementData
  }

  console.log(index, agreementsListCacheCopy, newAgreementData)
  return agreementsListCacheCopy
}

export function removeAgreementFromListCache(
  agreementId: string,
  agreementsListCache: Array<AgreementSummary> = []
) {
  return agreementsListCache.filter((agreementCache) => agreementCache.id !== agreementId)
}
