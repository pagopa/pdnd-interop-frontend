import { createMockPublicKey } from '__mocks__/data/key.mocks'
import { createMockSelfCareUser } from '__mocks__/data/user.mocks'
import { isKeyOrphan } from '../key.utils'

describe('isKeyOrphan utility function test', () => {
  it('should return false when the active users array contains the key operator id', () => {
    const keyMock = createMockPublicKey({ operator: { id: 'test-id' } })
    const activeUsersMock = [
      createMockSelfCareUser({ id: 'test-id' }),
      createMockSelfCareUser({ id: 'test-id-2' }),
    ]
    const result = isKeyOrphan(keyMock, activeUsersMock)

    expect(result).toBe(false)
  })

  it('should return false when the active users array is empty', () => {
    const keyMock = createMockPublicKey({ operator: { id: 'test-id' } })
    const result = isKeyOrphan(keyMock, [])

    expect(result).toBe(true)
  })

  it('should return trye when the active users array does not contain the key operator id', () => {
    const keyMock = createMockPublicKey({ operator: { id: 'test-id' } })
    const activeUsersMock = [
      createMockSelfCareUser({ id: 'test-id-3' }),
      createMockSelfCareUser({ id: 'test-id-2' }),
    ]
    const result = isKeyOrphan(keyMock, activeUsersMock)

    expect(result).toBe(true)
  })
})
