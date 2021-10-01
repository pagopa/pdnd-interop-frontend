import { User } from '../../types'

export const mockSPIDUser: User = {
  name: 'Tommaso',
  surname: 'Terrili',
  taxCode: 'TRRTMM56T12M333W',
  email: 'tommaso.terrili@test.it',
  role: 'Manager',
  platformRole: 'admin',
  status: 'active',
}

export const testBearerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
