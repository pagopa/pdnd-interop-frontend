import { EServiceReadType } from '../../types'

export const eserviceDraft: EServiceReadType = {
  producer: {
    id: 'djofsi-sdfjdsi-djsfs',
    name: 'Comune di Bologna',
  },
  name: 'Nome E-Service',
  description: 'Descrizione E-Service',
  technology: 'REST',
  id: 'sdjof-sdfjdspof-dsfdsjf',
  descriptors: [],
  attributes: {
    verified: [],
    declared: [],
    certified: [
      {
        single: {
          id: 'dsdsld-dsdlds-lsdasdas',
          creationTime: '2022-02-28T16:16:18.879093Z',
          explicitAttributeVerification: false,
          verified: false,
          origin: 'dfkdsfk',
          code: 'dfjdso',
          name: 'Attributo 1',
          description: 'Descrizione attributo 1',
        },
      },
    ],
  },
}

export const eserviceWithDescriptorDraft: EServiceReadType = {
  producer: {
    id: 'djofsi-sdfjdsi-djsfs',
    name: 'Comune di Bologna',
  },
  name: 'Nome E-Service',
  description: 'Descrizione E-Service',
  technology: 'REST',
  id: 'sdjof-sdfjdspof-dsfdsjf',
  descriptors: [
    {
      id: 'dmpodfm-jsdof-josdfpjd',
      state: 'DRAFT',
      docs: [],
      interface: {
        contentType: 'application/octet-stream',
        description: 'ABC',
        id: 'difosda-sdjfsaj-sjafd',
        name: 'example_open_api.yml',
      },
      version: '1',
      voucherLifespan: 10,
      description: 'Lorem ipsum dolor sit amet...',
      audience: ['v1'],
      dailyCallsPerConsumer: 10000,
      dailyCallsTotal: 100000,
    },
  ],
  attributes: {
    verified: [],
    declared: [],
    certified: [
      {
        single: {
          id: 'dsdsld-dsdlds-lsdasdas',
          creationTime: '2022-02-28T16:16:18.879093Z',
          explicitAttributeVerification: false,
          verified: false,
          origin: 'dfkdsfk',
          code: 'dfjdso',
          name: 'Attributo 1',
          description: 'Descrizione attributo 1',
        },
      },
    ],
  },
}
