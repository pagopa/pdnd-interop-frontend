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
    sorted[sorted.length - 1].state === 'WAITING_FOR_APPROVAL'
      ? sorted[sorted.length - 2]
      : sorted[sorted.length - 1]

  return {
    ...purpose,
    mostRecentVersion,
    currentVersion,
    awaitingApproval: mostRecentVersion !== currentVersion,
  }
}

export function getComputedPurposeState(purpose: DecoratedPurpose) {
  const isEserviceActive =
    purpose.eservice.descriptor.state === 'PUBLISHED' ||
    purpose.eservice.descriptor.state === 'DEPRECATED'
  const isAgreementActive = purpose.agreement.state === 'ACTIVE'

  if (!isEserviceActive && isAgreementActive) {
    return "No, perché l'eservice non è attivo"
  }

  if (isEserviceActive && !isAgreementActive) {
    return 'No, perché la richiesta di fruizione non è attiva'
  }

  if (!isEserviceActive && !isAgreementActive) {
    return "No, perché sia l'eservice che la richiesta di fruizione sono inattivi"
  }

  return 'Sì, a patto che almeno uno dei client associati a questa finalità sia attivo ed abbia almeno un operatore che ha caricato una chiave pubblica'
}

export function getPurposeFromUrl(location: Location<unknown>) {
  const bits = getBits(location)

  // If we are in edit mode, strip that path bit
  if (Object.values(URL_FRAGMENTS.EDIT).includes(bits[bits.length - 1])) {
    bits.pop()
  }

  return bits.pop()
}
