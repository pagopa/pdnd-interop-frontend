import { describe, expect, it } from 'vitest'
import { getArchivingRelativeDate } from '../monitoring.utils'

describe('getArchivingRelativeDate', () => {
  const now = new Date(2026, 5, 10, 18, 30)

  it('uses calendar days in local time', () => {
    expect(getArchivingRelativeDate(new Date(2026, 5, 10, 23, 0).toISOString(), now)).toEqual({
      kind: 'today',
    })
    expect(getArchivingRelativeDate(new Date(2026, 5, 11, 0, 5).toISOString(), now)).toEqual({
      kind: 'inDays',
      count: 1,
    })
    expect(getArchivingRelativeDate(new Date(2026, 6, 10, 9, 0).toISOString(), now)).toEqual({
      kind: 'inDays',
      count: 30,
    })
  })

  it('marks past dates and ignores invalid ones', () => {
    expect(getArchivingRelativeDate(new Date(2026, 5, 9, 23, 59).toISOString(), now)).toEqual({
      kind: 'pastDue',
    })
    expect(getArchivingRelativeDate('not-a-date', now)).toBeUndefined()
  })
})
