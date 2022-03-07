import { ClientPurpose } from '../../types'

export function getComputedClientAssertionState(clientPurpose: ClientPurpose) {
  const agreementState = clientPurpose.states.agreement.state
  const eserviceState = clientPurpose.states.eservice.state
  const purposeState = clientPurpose.states.purpose.state

  if ([agreementState, eserviceState, purposeState].every((s) => s === 'ACTIVE')) {
    return 'Sì'
  }

  return 'No'
}
