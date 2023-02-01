import { JwtUser } from '@/types/party.types'
import { createMockFactory } from '@/utils/testing.utils'

const mockJwtOrg = {
  name: 'orgName',
  roles: [{ partyRole: 'MANAGER' as const, role: 'admin' as const }],
  fiscal_code: 'AAAAAA11A11A111A',
}

const mockJwtUser: JwtUser = {
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
}

export const mockUseJwt = createMockFactory({
  jwt: mockJwtUser,
  isCurrentUser: () => true,
  hasSessionExpired: () => false,
  isAdmin: true,
  isOperatorAPI: false,
  isOperatorSecurity: false,
})
