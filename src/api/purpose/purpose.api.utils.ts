import { DecoratedPurpose, Purpose } from '@/types/purpose.types'

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
