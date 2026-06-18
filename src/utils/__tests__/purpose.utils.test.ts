import {
  checkPurposeSuspendedByConsumer,
  getPurposeFailureReasons,
  getDaysToExpiration,
  checkIsRulesetExpired,
  getFormattedExpirationDate,
  getReviewModeLabel,
} from '../purpose.utils'
import type { TFunction } from 'i18next'
import { createMockPurpose } from '@/../__mocks__/data/purpose.mocks'
import { describe, it, expect, vi, afterEach } from 'vitest'

describe('checks if the getPurposeFailureReasons purpose util function work as expected', () => {
  it('should have no failure if the e-service is published, the agreement and the purpose current version are active', () => {
    const mockPurpose = createMockPurpose({
      eservice: { descriptor: { state: 'PUBLISHED' } },
      agreement: { state: 'ACTIVE' },
      currentVersion: { state: 'ACTIVE' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons).toHaveLength(0)
  })

  it('should have no failure if the e-service is deprecated, the agreement and the purpose current version are active', () => {
    const mockPurpose = createMockPurpose({
      eservice: { descriptor: { state: 'DEPRECATED' } },
      agreement: { state: 'ACTIVE' },
      currentVersion: { state: 'ACTIVE' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons).toHaveLength(0)
  })

  it('should have e-service failure reason if the e-service is neither deprecated or published', () => {
    const mockPurpose = createMockPurpose({
      eservice: { descriptor: { state: 'DRAFT' } },
      agreement: { state: 'ACTIVE' },
      currentVersion: { state: 'ACTIVE' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons.length).toBeGreaterThanOrEqual(1)
    expect(failureReasons).toContain('eservice')
  })

  it('should have agreement failure reason if the agreement is not active', () => {
    const mockPurpose = createMockPurpose({
      eservice: { descriptor: { state: 'PUBLISHED' } },
      agreement: { state: 'SUSPENDED' },
      currentVersion: { state: 'ACTIVE' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons.length).toBeGreaterThanOrEqual(1)
    expect(failureReasons).toContain('agreement')
  })

  it('should have purpose failure reason if the purpose current version is not active', () => {
    const mockPurpose = createMockPurpose({
      eservice: { descriptor: { state: 'PUBLISHED' } },
      agreement: { state: 'ACTIVE' },
      currentVersion: { state: 'SUSPENDED' },
    })
    const failureReasons = getPurposeFailureReasons(mockPurpose)
    expect(failureReasons.length).toBeGreaterThanOrEqual(1)
    expect(failureReasons).toContain('purpose')
  })

  it('should have puspoe, agreement and e-servive failure reasons if the purpose current version and the agreement are not active and the eservice is neither published or deprecated ', () => {
    const mockPurpose = createMockPurpose({
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
    const mockPurpose = createMockPurpose({
      currentVersion: { state: 'ACTIVE' },
    })
    const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(mockPurpose)
    expect(isSuspendedByConsumer).toBe(false)
  })

  it('should return false if the suspendedByConsumer flag is false', () => {
    const mockPurpose = createMockPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: false,
    })
    const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(mockPurpose)
    expect(isSuspendedByConsumer).toBe(false)
  })

  it('should return true if the suspendedByConsumer flag is true', () => {
    const mockPurpose = createMockPurpose({
      currentVersion: { state: 'SUSPENDED' },
      suspendedByConsumer: true,
    })
    const isSuspendedByConsumer = checkPurposeSuspendedByConsumer(mockPurpose, 'test-id')
    expect(isSuspendedByConsumer).toBe(true)
  })

  it('should return true if the active party is both the e-service producer and purpose consumer and the purpose is supended by the party itself.', () => {
    const mockPurpose = createMockPurpose({
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

describe('getDaysToExpiration', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns undefined if no date is provided', () => {
    expect(getDaysToExpiration(undefined)).toBeUndefined()
  })

  it('returns 0 for the same day', () => {
    vi.useFakeTimers({ now: new Date('2026-06-15T12:00:00Z') })
    expect(getDaysToExpiration('2026-06-15T12:00:00Z')).toBe(0)
  })

  it('returns 1 for a date exactly 24 hours away', () => {
    vi.useFakeTimers({ now: new Date('2026-06-15T12:00:00Z') })
    expect(getDaysToExpiration('2026-06-16T12:00:00Z')).toBe(1)
  })

  it('returns a negative number for past dates', () => {
    vi.useFakeTimers({ now: new Date('2026-06-15T12:00:00Z') })
    expect(getDaysToExpiration('2026-06-14T12:00:00Z')).toBe(-1)
  })

  it('handles invalid date strings gracefully', () => {
    expect(getDaysToExpiration('not-a-date')).toBeNaN()
  })
})

describe('getFormattedExpirationDate', () => {
  it('returns undefined if no date is provided', () => {
    expect(getFormattedExpirationDate(undefined)).toBeUndefined()
  })

  it('should return a formatted date string for a valid ISO string', () => {
    const result = getFormattedExpirationDate('2025-12-25')
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/)
  })

  it('handles invalid date strings gracefully', () => {
    expect(getFormattedExpirationDate('not-a-date')).toBe('Invalid Date')
  })
})

describe('checkIsRulesetExpired', () => {
  it('returns false if no date is provided', () => {
    expect(checkIsRulesetExpired(undefined)).toBeFalsy()
  })

  it('should return true if the date is in the past', () => {
    const result = checkIsRulesetExpired('2020-12-25')
    expect(result).toBeTruthy()
  })

  it('should return false if the date is in the future', () => {
    const result = checkIsRulesetExpired('2099-12-25')
    expect(result).toBeFalsy()
  })
})

describe('getReviewModeLabel', () => {
  // Stub `t` returning the requested key, so we assert the mode-to-key mapping regardless of copy.
  const t = ((key: string) => key) as unknown as TFunction<'purpose', 'riskAnalysisAssignment'>

  it('maps an undefined review mode to the autonomy label', () => {
    expect(getReviewModeLabel(undefined, t)).toBe('mode.autonomy')
  })

  it('maps ADMIN_WRITES_REVIEWER_SIGNS to its label', () => {
    expect(getReviewModeLabel('ADMIN_WRITES_REVIEWER_SIGNS', t)).toBe(
      'mode.adminWritesReviewerSigns'
    )
  })

  it('maps REVIEWER_WRITES_REVIEWER_SIGNS to its label', () => {
    expect(getReviewModeLabel('REVIEWER_WRITES_REVIEWER_SIGNS', t)).toBe(
      'mode.reviewerWritesReviewerSigns'
    )
  })
})
