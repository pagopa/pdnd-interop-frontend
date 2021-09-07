import { User } from '../../types'

export const mockSPIDUserLorenzoCarmilli: User = {
  name: 'Lorenzo',
  surname: 'Carmilli',
  taxCode: 'CRMLRN56T12R566Y',
  email: 'lorenzo.carmilli@test.it',
  role: 'Manager',
  platformRole: 'admin',
  status: 'active',
}

export const testBearerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export const testCreateNewServiceStaticFields = {
  pop: false,
  voucherLifespan: 41713585,
  version: 1,
}
