import { checkPurposeSuspendedByConsumer, getPurposeFailureReasons } from '../purpose.utils'
import { createMockDecoratedPurpose } from '__mocks__/data/purpose.mocks'

describe('checks if the getPurposeFailureReasons purpose util function work as expected', () => {
  it('should have no failure if the e-service is published, the agreement and the purpose current version are active', () => {
    const mockPurpose = createMockDecoratedPurpose({
      eservice: { descriptor: { state: 'PUBLISHED' } },
      agreement: { state: 'ACTIVE' },
      currentVersion: { state: 'ACTIVE' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons).toHaveLength(0)
  })

  it('should have no failure if the e-service is deprecated, the agreement and the purpose current version are active', () => {
    const mockPurpose = createMockDecoratedPurpose({
      eservice: { descriptor: { state: 'DEPRECATED' } },
      agreement: { state: 'ACTIVE' },
      currentVersion: { state: 'ACTIVE' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons).toHaveLength(0)
  })

  it('should have e-service failure reason if the e-service is neither deprecated or published', () => {
    const mockPurpose = createMockDecoratedPurpose({
      eservice: { descriptor: { state: 'DRAFT' } },
      agreement: { state: 'ACTIVE' },
      currentVersion: { state: 'ACTIVE' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons.length).toBeGreaterThanOrEqual(1)
    expect(failureReasons).toContain('eservice')
  })

  it('should have agreement failure reason if the agreement is not active', () => {
    const mockPurpose = createMockDecoratedPurpose({
      eservice: { descriptor: { state: 'PUBLISHED' } },
      agreement: { state: 'SUSPENDED' },
      currentVersion: { state: 'ACTIVE' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons.length).toBeGreaterThanOrEqual(1)
    expect(failureReasons).toContain('agreement')
  })

  it('should have purpose failure reason if the purpose current version is not active', () => {
    const mockPurpose = createMockDecoratedPurpose({
      eservice: { descriptor: { state: 'PUBLISHED' } },
      agreement: { state: 'ACTIVE' },
      currentVersion: { state: 'SUSPENDED' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons.length).toBeGreaterThanOrEqual(1)
    expect(failureReasons).toContain('purpose')
  })

  it('should have puspoe, agreement and e-servive failure reasons if the purpose current version and the agreement are not active and the eservice is neither published or deprecated ', () => {
    const mockPurpose = createMockDecoratedPurpose({
      eservice: { descriptor: { state: 'DRAFT' } },
      agreement: { state: 'SUSPENDED' },
      currentVersion: { state: 'SUSPENDED' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons).toHaveLength(3)
    expect(failureReasons).toContain('eservice')
    expect(failureReasons).toContain('agreement')
    expect(failureReasons).toContain('purpose')
  })
})

describe('checks if the checkPurposeSuspendedByConsumer purpose util function work as expected', () => {
  it("should return false if the purpose's current version is not suspended", () => {
    const mockPurpose = createMockDecoratedPurpose({
      currentVersion: { state: 'ACTIVE' },
    })
    const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(mockPurpose)
    expect(isSuspendedByConsumer).toBe(false)
  })

  it('should return false if the suspendedByConsumer flag is false', () => {
    const mockPurpose = createMockDecoratedPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: false,
    })
    const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(mockPurpose)
    expect(isSuspendedByConsumer).toBe(false)
  })

  it('should return true if the suspendedByConsumer flag is true', () => {
    const mockPurpose = createMockDecoratedPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: true,
    })
    const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(mockPurpose, 'test-id')
    expect(isSuspendedByConsumer).toBe(true)
  })

  it('should return true if the suspendedByConsumer flag is false, the suspendedByProducer is true and the passed party id is equal to the e-service producer id and the purpose producer id', () => {
    const mockPurpose = createMockDecoratedPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByProducer: true,
      suspendedByConsumer: false,
      eservice: { producer: { id: 'test-id' } },
      consumer: { id: 'test-id' },
    })
    const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(mockPurpose, 'test-id')
    expect(isSuspendedByConsumer).toBe(true)
  })
})
