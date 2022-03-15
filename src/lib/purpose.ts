import { DecoratedPurpose, Purpose } from '../../types'
import { Location } from 'history'
import { URL_FRAGMENTS } from './constants'
import { getBits } from './router-utils'

export function decoratePurposeWithMostRecentVersion(purpose: Purpose): DecoratedPurpose {
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

export function getComputedPurposeState(purpose: DecoratedPurpose) {
  const isEserviceActive =
    purpose.eservice.descriptor.state === 'PUBLISHED' ||
    purpose.eservice.descriptor.state === 'DEPRECATED'
  const isAgreementActive = purpose.agreement.state === 'ACTIVE'
  const isPurposeActive = purpose.currentVersion.state === 'ACTIVE'

  const reasons = [
    { label: 'E-Service', outcome: isEserviceActive },
    { label: 'richiesta di fruizione', outcome: isAgreementActive },
    { label: 'finalità', outcome: isPurposeActive },
  ]
    .map(({ outcome, label }) => (outcome ? label : null))
    .filter((r) => r)

  if (reasons.length === 0) {
    return 'Sì, questa finalità può accedere all’E-Service dell’erogatore a patto che abbia almeno un client associato che contenga almeno una chiave pubblica'
  }

  return `No, in questo momento non sono attivi: ${reasons.join(', ')}`
}

export function getPurposeFromUrl(location: Location<unknown>) {
  const bits = getBits(location)

  // If we are in edit mode, strip that path bit
  if (Object.values(URL_FRAGMENTS.EDIT).includes(bits[bits.length - 1])) {
    bits.pop()
  }

  return bits.pop()
}
