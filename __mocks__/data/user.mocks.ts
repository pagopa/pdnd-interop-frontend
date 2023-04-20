import type { RelationshipInfo } from '@/api/api.generatedTypes'
import type { JwtUser, RemappedTenant } from '@/types/party.types'
import { createMockFactory } from '@/utils/testing.utils'

const mockJwtOrg = {
  name: 'orgName',
  roles: [{ partyRole: 'MANAGER' as const, role: 'admin' as const }],
  fiscal_code: 'AAAAAA11A11A111A',
}

const createMockJwtUser = createMockFactory<JwtUser>({
  aud: 'aud',
  exp: 1972913491,
  iat: 123,
  iss: 'iss',
  jti: 'jti',
  nbf: 123,
  organization: mockJwtOrg,
  selfcareId: 'selfcareId',
  uid: 'uid',
  name: 'name',
  family_name: 'family_name',
  organizationId: 'organizationId',
})

const createMockSelfCareUser = createMockFactory<RelationshipInfo>({
  createdAt: '2022-09-30T15:03:41.078Z',
  familyName: 'Rossi',
  from: 'b7f6b32e-6252-4994-ac7b-47622e674e5a',
  id: 'f59e65fa-1b94-4e53-ae46-a3f60d446ebd',
  name: 'Mario',
  product: { createdAt: '2022-09-30T15:03:41.078Z', id: 'prod-interop', role: 'admin' },
  role: 'DELEGATE',
  state: 'ACTIVE',
  taxCode: 'MRORSSR78M21B354T',
  to: '1962d21c-c701-4805-93f6-53a877898756',
  updatedAt: '2022-09-30T15:04:42.738Z',
})

const createMockRemappedTenant = createMockFactory<RemappedTenant>({
  attributes: {
    certified: [
      {
        id: 'certificato-01',
        name: 'Attributo certificato 01',
        state: 'ACTIVE',
      },
    ],
    verified: [
      {
        id: 'verificato-01',
        name: 'Attributo verificato 01',
        state: 'ACTIVE',
      },
      { id: 'verificato-02', name: 'Attributo verificato 02', state: 'ACTIVE' },
      {
        id: 'verificato-03',
        name: 'Attributo verificato 03',
        state: 'ACTIVE',
      },
      {
        id: 'verificato-04',
        name: 'Attributo verificato 04',
        state: 'REVOKED',
      },
      {
        id: 'verificato-05',
        name: 'Attributo verificato 05',
        state: 'ACTIVE',
      },
    ],
    declared: [
      {
        id: 'dichiarato-01',
        name: 'Attributo dichiarato 01',
        state: 'ACTIVE',
      },
      {
        id: 'dichiarato-0w',
        name: 'Attributo dichiarato 02',
        state: 'REVOKED',
      },
      {
        id: 'dichiarato-03',
        name: 'Attributo dichiarato 03',
        state: 'ACTIVE',
      },
      {
        id: 'dichiarato-04',
        name: 'Attributo dichiarato 04',
        state: 'ACTIVE',
      },
      {
        id: 'dichiarato-05',
        name: 'Attributo dichiarato 05',
        state: 'ACTIVE',
      },
      {
        id: 'dichiarato-06',
        name: 'Attributo dichiarato 06',
        state: 'ACTIVE',
      },
      {
        id: 'dichiarato-07',
        name: 'Attributo dichiarato 07',
        state: 'ACTIVE',
      },
    ],
  },
  createdAt: '2023-02-24T12:03:10.864Z',
  externalId: { origin: 'IPA', value: 'pagopa' },
  id: 'tenant-id',
  name: 'PagoPA S.p.A.',
  selfcareId: 'selfcareId',
  updatedAt: '2023-04-12T13:52:03.027Z',
})

export { createMockJwtUser, createMockSelfCareUser, createMockRemappedTenant }
