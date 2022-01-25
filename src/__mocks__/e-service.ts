import { EServiceReadType } from '../../types'

export const eservicePublished: EServiceReadType = {
  producer: {
    id: 'djofsi-sdfjdsi-djsfs',
    name: 'Comune di Bologna',
  },
  name: 'Nome e-service',
  description: 'Descrizione e-service',
  technology: 'REST',
  id: 'sdjof-sdfjdspof-dsfdsjf',
  state: 'PUBLISHED',
  descriptors: [],
  attributes: {
    verified: [],
    declared: [],
    certified: [
      {
        single: {
          id: 'dsdsld-dsdlds-lsdasdas',
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
