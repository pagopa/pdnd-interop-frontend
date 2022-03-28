import { ClientPurpose } from '../../types'

export function getComputedClientAssertionState(clientPurpose: ClientPurpose) {
  const agreementState = { type: 'agreement', state: clientPurpose.states.agreement.state }
  const eserviceState = { type: 'eservice', state: clientPurpose.states.eservice.state }
  const purposeState = { type: 'purpose', state: clientPurpose.states.purpose.state }

  const problems = [agreementState, eserviceState, purposeState].filter(
    (s) => s.state === 'INACTIVE'
  )

  if (problems.length === 0) {
    return 'Sì'
  }

  const LABELS: Record<string, string> = {
    agreement: "la richiesta di fruizione per l'E-Service a cui è associata questa finalità",
    eservice: "l'E-Service a cui è associata questa finalità",
    purpose: 'questa finalità',
  }

  return `No, perché attualmente sono inattivi: ${problems.map((p) => LABELS[p.type]).join(', ')}`
}
