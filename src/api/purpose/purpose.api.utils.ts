import { DecoratedPurpose, Purpose } from '@/types/purpose.types'

export function decoratePurposeWithMostRecentVersion(purpose: Purpose): DecoratedPurpose {
  if (purpose.versions.length === 0) {
    return {
      ...purpose,
      mostRecentVersion: null,
      currentVersion: null,
      awaitingApproval: false,
    }
  }

  const sorted = purpose.versions.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
  const mostRecentVersion = sorted[sorted.length - 1]
  const currentVersion =
    mostRecentVersion.state === 'WAITING_FOR_APPROVAL' && sorted.length >= 2
      ? sorted[sorted.length - 2]
      : mostRecentVersion

  return {
    ...purpose,
    mostRecentVersion,
    currentVersion,
    awaitingApproval: mostRecentVersion.id !== currentVersion.id,
  }
}
