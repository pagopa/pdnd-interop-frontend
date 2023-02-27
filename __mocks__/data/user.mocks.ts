import type { useJwt } from '@/hooks/useJwt'
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
})

const mockUseJwt = createMockFactory<ReturnType<typeof useJwt>>({
  jwt: createMockJwtUser(),
  isCurrentUser: () => true,
  hasSessionExpired: () => false,
  isAdmin: true,
  isOperatorAPI: false,
  isOperatorSecurity: false,
  currentRoles: [],
})

export { createMockJwtUser, mockUseJwt }
