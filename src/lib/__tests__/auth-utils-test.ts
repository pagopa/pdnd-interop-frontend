import { Party } from '../../../types'
import { isAdmin, isOperatorAPI, isOperatorSecurity } from '../auth-utils'

const exampleParty: Party = {
  role: 'Manager',
  platformRole: 'admin',
  status: 'active',
  partyId: 'dsjdf-djsfsdoj-sdfjdso',
  attributes: [],
  description: 'Lorem ipsum...',
  institutionId: 'dmsfisd-sdfjsdis-df',
  digitalAddress: 'comune@test.it',
}

describe('Check ProductRole', () => {
  it('Is admin', () => {
    expect(isAdmin({ ...exampleParty, role: 'Manager', platformRole: 'admin' })).toBeTruthy()
    expect(isAdmin({ ...exampleParty, role: 'Delegate', platformRole: 'admin' })).toBeTruthy()
    expect(isAdmin(null)).toBeFalsy()
  })

  it('Is operator API', () => {
    expect(isOperatorAPI({ ...exampleParty, role: 'Operator', platformRole: 'api' })).toBeTruthy()
    expect(isOperatorAPI(null)).toBeFalsy()
  })

  it('Is operator security', () => {
    expect(
      isOperatorSecurity({ ...exampleParty, role: 'Operator', platformRole: 'security' })
    ).toBeTruthy()
    expect(isOperatorSecurity(null)).toBeFalsy()
  })
})
