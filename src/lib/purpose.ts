import { DecoratedPurpose, Purpose } from '../../types'
import { Location } from 'history'
import { URL_FRAGMENTS } from './constants'
import { getBits } from './router-utils'

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

export function getComputedPurposeState(purpose: DecoratedPurpose): Array<string> {
  const isEserviceActive =
    purpose.eservice.descriptor.state === 'PUBLISHED' ||
    purpose.eservice.descriptor.state === 'DEPRECATED'
  const isAgreementActive = purpose.agreement.state === 'ACTIVE'
  const isPurposeActive = purpose.currentVersion && purpose.currentVersion.state === 'ACTIVE'

  const possibleReasons = [
    { labelKey: 'eservice', outcome: isEserviceActive },
    { labelKey: 'agreement', outcome: isAgreementActive },
    { labelKey: 'purpose', outcome: isPurposeActive },
  ]

  const reasons = possibleReasons
    .map(({ outcome, labelKey }) => (!outcome ? labelKey : undefined))
    .filter((r) => r) as Array<string>

  return reasons
}

export function getPurposeFromUrl(location: Location<unknown>) {
  const bits = getBits(location)

  // If we are in edit mode, strip that path bit
  if (Object.values(URL_FRAGMENTS.EDIT).includes(bits[bits.length - 1])) {
    bits.pop()
  }

  return bits.pop()
}
