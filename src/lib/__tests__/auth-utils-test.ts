import { Party } from '../../../types'
import { isAdmin, isOperatorAPI, isOperatorSecurity } from '../auth-utils'

const exampleParty: Party = {
  role: 'MANAGER',
  productInfo: {
    createdAt: '',
    id: 'interop',
    role: 'admin',
  },
  state: 'ACTIVE',
  partyId: 'dsjdf-djsfsdoj-sdfjdso',
  attributes: [],
  description: 'Lorem ipsum...',
  institutionId: 'dmsfisd-sdfjsdis-df',
  digitalAddress: 'comune@test.it',
}

describe('Check ProductRole', () => {
  it('Is admin', () => {
    expect(
      isAdmin({
        ...exampleParty,
        role: 'MANAGER',
        productInfo: { ...exampleParty.productInfo, role: 'admin' },
      })
    ).toBeTruthy()
    expect(
      isAdmin({
        ...exampleParty,
        role: 'DELEGATE',
        productInfo: { ...exampleParty.productInfo, role: 'admin' },
      })
    ).toBeTruthy()
    expect(isAdmin(null)).toBeFalsy()
  })

  it('Is operator API', () => {
    expect(
      isOperatorAPI({
        ...exampleParty,
        role: 'OPERATOR',
        productInfo: { ...exampleParty.productInfo, role: 'api' },
      })
    ).toBeTruthy()
    expect(isOperatorAPI(null)).toBeFalsy()
  })

  it('Is operator security', () => {
    expect(
      isOperatorSecurity({
        ...exampleParty,
        role: 'OPERATOR',
        productInfo: { ...exampleParty.productInfo, role: 'security' },
      })
    ).toBeTruthy()
    expect(isOperatorSecurity(null)).toBeFalsy()
  })
})
