import { AgreementSummary, Client, ProviderOrSubscriber } from '../../../types'
import { getAgreementState, getClientComputedState } from '../status-utils'

describe('Client status', () => {
  it('It is active', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      state: 'active',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        state: 'ACTIVE',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          state: 'PUBLISHED',
          version: '5',
        },
      },
      eservice: {
        id: 'dsnodsi-sdfdsljf-sdjfodsjf',
        name: 'anagrafe comune di roma',
        provider: {
          institutionId: 'abc_fd_df',
          description: 'Comune di Roma',
        },
      },
      purposes: 'accesso pieno',
    }
    const computedState = getClientComputedState(client)
    expect(computedState).toBe('active')
  })

  it('It is active – even if e-service version is deprecated', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      state: 'active',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        state: 'ACTIVE',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          state: 'DEPRECATED',
          version: '5',
        },
      },
      eservice: {
        id: 'dsnodsi-sdfdsljf-sdjfodsjf',
        name: 'anagrafe comune di roma',
        provider: {
          institutionId: 'abc_fd_df',
          description: 'Comune di Roma',
        },
        activeDescriptor: {
          id: 'sdjfsdjf-djfsdj-sdjfdsj',
          state: 'PUBLISHED',
          version: '7',
        },
      },
      purposes: 'accesso pieno',
    }
    const computedState = getClientComputedState(client)
    expect(computedState).toBe('active')
  })

  it('It is inactive – client suspended', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      state: 'suspended',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        state: 'ACTIVE',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          state: 'PUBLISHED',
          version: '5',
        },
      },
      eservice: {
        id: 'dsnodsi-sdfdsljf-sdjfodsjf',
        name: 'anagrafe comune di roma',
        provider: {
          institutionId: 'abc_fd_df',
          description: 'Comune di Roma',
        },
      },
      purposes: 'accesso pieno',
    }
    const computedState = getClientComputedState(client)
    expect(computedState).toBe('inactive')
  })

  it('It is inactive – agreement suspended', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      state: 'active',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        state: 'SUSPENDED',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          state: 'PUBLISHED',
          version: '5',
        },
      },
      eservice: {
        id: 'dsnodsi-sdfdsljf-sdjfodsjf',
        name: 'anagrafe comune di roma',
        provider: {
          institutionId: 'abc_fd_df',
          description: 'Comune di Roma',
        },
      },
      purposes: 'accesso pieno',
    }
    const computedState = getClientComputedState(client)
    expect(computedState).toBe('inactive')
  })

  it('It is inactive – e-service version suspended', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      state: 'active',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        state: 'ACTIVE',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          state: 'SUSPENDED',
          version: '5',
        },
      },
      eservice: {
        id: 'dsnodsi-sdfdsljf-sdjfodsjf',
        name: 'anagrafe comune di roma',
        provider: {
          institutionId: 'abc_fd_df',
          description: 'Comune di Roma',
        },
      },
      purposes: 'accesso pieno',
    }
    const computedState = getClientComputedState(client)
    expect(computedState).toBe('inactive')
  })
})

describe('Agreement status', () => {
  it('Provider/subscriber view: it is active', () => {
    const agreementSummary: AgreementSummary = {
      id: 'dsfjds-jojoi-jdsfds',
      state: 'ACTIVE',
      eservice: {
        name: 'Riscossione TARI',
        id: 'osdijf-dsjfdisj-jsdfdsj',
        descriptorId: 'lskdfok-jisjdfs-djdsjfn',
        version: '4',
        state: 'PUBLISHED',
      },
      eserviceDescriptorId: 'dnsoifn-dsfjdsiof-dsjfsd',
      consumer: {
        name: 'Comune di Milano',
        id: 'afd_dss_cds',
      },
      producer: {
        name: 'Comune di Bologna',
        id: 'lds_kji_dsj',
      },
      attributes: [],
      suspendedByProducer: false,
      suspendedBySubscriber: false,
    }
    const mode = null
    const status = getAgreementState(agreementSummary, mode)
    expect(status).toBe('ACTIVE')
  })

  it('Provider view: it is suspended by producer', () => {
    const agreementSummary: AgreementSummary = {
      id: 'dsfjds-jojoi-jdsfds',
      state: 'SUSPENDED',
      eservice: {
        name: 'Riscossione TARI',
        id: 'osdijf-dsjfdisj-jsdfdsj',
        descriptorId: 'lskdfok-jisjdfs-djdsjfn',
        version: '4',
        state: 'PUBLISHED',
      },
      eserviceDescriptorId: 'dnsoifn-dsfjdsiof-dsjfsd',
      consumer: {
        name: 'Comune di Milano',
        id: 'afd_dss_cds',
      },
      producer: {
        name: 'Comune di Bologna',
        id: 'lds_kji_dsj',
      },
      attributes: [],
      suspendedByProducer: true,
      suspendedBySubscriber: false,
    }
    const mode: ProviderOrSubscriber = 'provider'
    const status = getAgreementState(agreementSummary, mode)
    expect(status).toBe('SUSPENDED')
  })

  it('Subscriber view: it is suspended by subscriber', () => {
    const agreementSummary: AgreementSummary = {
      id: 'dsfjds-jojoi-jdsfds',
      state: 'SUSPENDED',
      eservice: {
        name: 'Riscossione TARI',
        id: 'osdijf-dsjfdisj-jsdfdsj',
        descriptorId: 'lskdfok-jisjdfs-djdsjfn',
        version: '4',
        state: 'PUBLISHED',
      },
      eserviceDescriptorId: 'dnsoifn-dsfjdsiof-dsjfsd',
      consumer: {
        name: 'Comune di Milano',
        id: 'afd_dss_cds',
      },
      producer: {
        name: 'Comune di Bologna',
        id: 'lds_kji_dsj',
      },
      attributes: [],
      suspendedByProducer: false,
      suspendedBySubscriber: true,
    }
    const mode: ProviderOrSubscriber = 'subscriber'
    const status = getAgreementState(agreementSummary, mode)
    expect(status).toBe('SUSPENDED')
  })
})
