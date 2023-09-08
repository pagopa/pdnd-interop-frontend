import type { RelationshipInfo } from '@/api/api.generatedTypes'
import type { JwtUser } from '@/types/party.types'
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
  externalId: {
    origin: 'IPA',
    value: 'value',
  },
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

export { createMockJwtUser, createMockSelfCareUser }
