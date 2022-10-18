import { EServiceReadType } from '../../types'

export const eserviceDraft: EServiceReadType = {
  producer: {
    id: 'djofsi-sdfjdsi-djsfs',
    name: 'Comune di Bologna',
  },
  name: 'Nome e-service',
  description: 'Descrizione e-service',
  technology: 'REST',
  id: 'sdjof-sdfjdspof-dsfdsjf',
  state: 'DRAFT',
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
