import { DecoratedPurpose, Purpose, PurposeVersion } from '@/types/purpose.types'

export function decoratePurposeWithMostRecentVersion(purpose: Purpose): DecoratedPurpose {
  if (purpose.versions.length === 0) {
    return {
      ...purpose,
      waitingForApprovalVersion: null,
      currentVersion: null,
    }
  }

  const sorted = purpose.versions.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
  const mostRecentVersion = sorted[sorted.length - 1]
  let currentVersion = null

  if (mostRecentVersion.state === 'WAITING_FOR_APPROVAL' && sorted.length >= 2) {
    currentVersion = sorted[sorted.length - 2]
  }

  if (mostRecentVersion.state !== 'WAITING_FOR_APPROVAL') {
    currentVersion = mostRecentVersion
  }

  return {
    ...purpose,
    waitingForApprovalVersion:
      mostRecentVersion.state === 'WAITING_FOR_APPROVAL' ? mostRecentVersion : null,
    currentVersion,
  }
}

export function removePurposeFromListCache(
  purposeId: string,
  purposesListCache: Array<DecoratedPurpose> = []
) {
  return purposesListCache.filter((purposeCache) => purposeCache.id !== purposeId)
}

export function addPurposeVersionToPurposeCache(
  purposeVersion: PurposeVersion,
  purpose: Purpose | undefined
) {
  if (!purpose) return undefined
  return { ...purpose, versions: [...purpose.versions, purposeVersion] }
}

export function updatePurposeVersionCache(
  purposeVersion: PurposeVersion,
  purpose: Purpose | undefined
) {
  if (!purpose) return undefined

  const purposeCopy = { ...purpose }
  const index = purposeCopy.versions.findIndex((v) => v.id === purposeVersion.id)
  if (index !== -1) {
    purposeCopy.versions[index] = purposeVersion
  }
  return purposeCopy
}

export function updatePurposeListCache(
  purpose: Purpose,
  purposeListCache: Array<DecoratedPurpose> | undefined
) {
  if (!purposeListCache) return undefined

  const purposeListCopy = [...purposeListCache]
  const index = purposeListCopy.findIndex((v) => v.id === purpose.id)
  if (index !== -1) {
    purposeListCopy[index] = decoratePurposeWithMostRecentVersion(purpose)
  }
  return purposeListCopy
}
