import { DecoratedPurpose } from '@/types/purpose.types'

export function getPurposeFailureReasons(
  purpose: DecoratedPurpose
): Array<'eservice' | 'agreement' | 'purpose'> {
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
    .filter((r) => r) as Array<'eservice' | 'agreement' | 'purpose'>

  return reasons
}
