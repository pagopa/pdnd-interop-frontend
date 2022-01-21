import {
  partyActiveDelegate,
  partyActiveManager,
  partyActiveOperatorApi,
  partyActiveOperatorSecurity,
} from '../../__mocks__/party'
import { isAdmin, isOperatorAPI, isOperatorSecurity } from '../auth-utils'

describe('Check ProductRole', () => {
  it('Is admin', () => {
    expect(isAdmin(partyActiveManager)).toBeTruthy()
    expect(isAdmin(partyActiveDelegate)).toBeTruthy()
    expect(isAdmin(null)).toBeFalsy()
  })

  it('Is operator API', () => {
    expect(isOperatorAPI(partyActiveOperatorApi)).toBeTruthy()
    expect(isOperatorAPI(null)).toBeFalsy()
  })

  it('Is operator security', () => {
    expect(isOperatorSecurity(partyActiveOperatorSecurity)).toBeTruthy()
    expect(isOperatorSecurity(null)).toBeFalsy()
  })
})
