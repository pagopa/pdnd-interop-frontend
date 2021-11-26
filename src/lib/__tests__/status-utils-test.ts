import { AgreementSummary, Client, ProviderOrSubscriber } from '../../../types'
import { getAgreementStatus, getClientComputedStatus } from '../status-utils'

describe('Client status', () => {
  it('It is active', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      status: 'active',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        status: 'active',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          status: 'published',
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
    const computedStatus = getClientComputedStatus(client)
    expect(computedStatus).toBe('active')
  })

  it('It is active – even if e-service version is deprecated', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      status: 'active',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        status: 'active',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          status: 'deprecated',
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
          status: 'published',
          version: '7',
        },
      },
      purposes: 'accesso pieno',
    }
    const computedStatus = getClientComputedStatus(client)
    expect(computedStatus).toBe('active')
  })

  it('It is inactive – client suspended', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      status: 'suspended',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        status: 'active',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          status: 'published',
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
    const computedStatus = getClientComputedStatus(client)
    expect(computedStatus).toBe('inactive')
  })

  it('It is inactive – agreement suspended', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      status: 'active',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        status: 'suspended',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          status: 'published',
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
    const computedStatus = getClientComputedStatus(client)
    expect(computedStatus).toBe('inactive')
  })

  it('It is inactive – e-service version suspended', () => {
    const client: Client = {
      id: 'dsfsdjf-sdfjsdfj-sdfjdsf',
      name: 'dipendenti del comune',
      description: 'il client dei dipendenti del mio comune',
      status: 'active',
      agreement: {
        id: 'sjfaisds-sdfjsaodfj-sfajd',
        status: 'active',
        descriptor: {
          id: 'djfiosj-dfjdsofj-dfjsdf',
          status: 'suspended',
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
    const computedStatus = getClientComputedStatus(client)
    expect(computedStatus).toBe('inactive')
  })
})

describe('Agreement status', () => {
  it('Provider/subscriber view: it is active', () => {
    const agreementSummary: AgreementSummary = {
      id: 'dsfjds-jojoi-jdsfds',
      status: 'active',
      eservice: {
        name: 'Riscossione TARI',
        id: 'osdijf-dsjfdisj-jsdfdsj',
        descriptorId: 'lskdfok-jisjdfs-djdsjfn',
        version: '4',
        status: 'published',
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
    const status = getAgreementStatus(agreementSummary, mode)
    expect(status).toBe('active')
  })

  it('Provider view: it is suspended by producer', () => {
    const agreementSummary: AgreementSummary = {
      id: 'dsfjds-jojoi-jdsfds',
      status: 'suspended',
      eservice: {
        name: 'Riscossione TARI',
        id: 'osdijf-dsjfdisj-jsdfdsj',
        descriptorId: 'lskdfok-jisjdfs-djdsjfn',
        version: '4',
        status: 'published',
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
    const status = getAgreementStatus(agreementSummary, mode)
    expect(status).toBe('suspended')
  })

  it('Subscriber view: it is suspended by subscriber', () => {
    const agreementSummary: AgreementSummary = {
      id: 'dsfjds-jojoi-jdsfds',
      status: 'suspended',
      eservice: {
        name: 'Riscossione TARI',
        id: 'osdijf-dsjfdisj-jsdfdsj',
        descriptorId: 'lskdfok-jisjdfs-djdsjfn',
        version: '4',
        status: 'published',
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
    const status = getAgreementStatus(agreementSummary, mode)
    expect(status).toBe('suspended')
  })
})
