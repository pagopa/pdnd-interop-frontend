import {
  calculateArchivableOn,
  getAsyncExchangePropertiesWithDefaults,
  getDownloadDocumentName,
  getLastDescriptor,
  getViewLatestVersionTargetId,
} from '../eservice.utils'

describe('getDownloadDocumentName utility function testing', () => {
  it('should correctly get the document namy from a DocumentRead data type', () => {
    const result = getDownloadDocumentName({
      id: 'test-id',
      contentType: 'pdf',
      name: 'test.pdf',
      prettyName: 'document',
      checksum: 'f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2',
    })

    expect(result).toEqual('document.pdf')
  })
})

describe('getLastDescriptor utility function testing', () => {
  it('should correctly get the last descriptor from an array of descriptors', () => {
    const result = getLastDescriptor([
      { id: 'test-id-1', state: 'PUBLISHED', version: '1', audience: ['test-audience'] },
      { id: 'test-id-2', state: 'PUBLISHED', version: '2', audience: ['test-audience'] },
      { id: 'test-id-3', state: 'PUBLISHED', version: '3', audience: ['test-audience'] },
    ])

    expect(result?.id).toEqual('test-id-3')
  })

  it('should return the highest version when comparing two-digit and one-digit versions (numeric comparison, not lexicographic)', () => {
    const result = getLastDescriptor([
      { id: 'test-id-9', state: 'PUBLISHED', version: '9', audience: ['test-audience'] },
      { id: 'test-id-10', state: 'PUBLISHED', version: '10', audience: ['test-audience'] },
    ])

    expect(result?.id).toEqual('test-id-10')
  })
})

describe('getViewLatestVersionTargetId utility function testing', () => {
  it('should return the latest descriptor id when the current is not the latest', () => {
    const result = getViewLatestVersionTargetId(
      [
        { id: 'test-id-1', state: 'DEPRECATED', version: '1', audience: ['test-audience'] },
        { id: 'test-id-2', state: 'PUBLISHED', version: '2', audience: ['test-audience'] },
      ],
      'test-id-1'
    )

    expect(result).toEqual('test-id-2')
  })

  it('should return undefined when the current descriptor is already the latest', () => {
    const result = getViewLatestVersionTargetId(
      [
        { id: 'test-id-1', state: 'DEPRECATED', version: '1', audience: ['test-audience'] },
        { id: 'test-id-2', state: 'PUBLISHED', version: '2', audience: ['test-audience'] },
      ],
      'test-id-2'
    )

    expect(result).toBeUndefined()
  })

  it('should ignore DRAFT, WAITING_FOR_APPROVAL and ARCHIVED descriptors when computing latest', () => {
    const result = getViewLatestVersionTargetId(
      [
        { id: 'test-id-1', state: 'DEPRECATED', version: '1', audience: ['test-audience'] },
        { id: 'test-id-2', state: 'PUBLISHED', version: '2', audience: ['test-audience'] },
        { id: 'test-id-3', state: 'DRAFT', version: '3', audience: ['test-audience'] },
        {
          id: 'test-id-4',
          state: 'WAITING_FOR_APPROVAL',
          version: '4',
          audience: ['test-audience'],
        },
        { id: 'test-id-5', state: 'ARCHIVED', version: '5', audience: ['test-audience'] },
      ],
      'test-id-1'
    )

    expect(result).toEqual('test-id-2')
  })

  it('should return undefined when all non-current descriptors are filtered out', () => {
    const result = getViewLatestVersionTargetId(
      [
        { id: 'test-id-1', state: 'ARCHIVED', version: '1', audience: ['test-audience'] },
        { id: 'test-id-2', state: 'ARCHIVED', version: '2', audience: ['test-audience'] },
      ],
      'test-id-1'
    )

    expect(result).toBeUndefined()
  })
})

describe('calculateArchivableOn utility function testing', () => {
  it('should return midnight UTC of the day after now + gracePeriodDays', () => {
    const now = new Date('2026-10-20T14:30:15.000Z')
    const result = calculateArchivableOn(now, 30)

    expect(result.toISOString()).toEqual('2026-11-20T00:00:00.000Z')
  })

  it('should not mutate the input date', () => {
    const now = new Date('2026-10-20T14:30:15.000Z')
    const nowIso = now.toISOString()
    calculateArchivableOn(now, 30)

    expect(now.toISOString()).toEqual(nowIso)
  })

  it('should correctly handle month boundaries', () => {
    const now = new Date('2026-01-15T10:00:00.000Z')
    const result = calculateArchivableOn(now, 20)

    expect(result.toISOString()).toEqual('2026-02-05T00:00:00.000Z')
  })

  it('should correctly handle year boundaries', () => {
    const now = new Date('2026-12-15T23:59:59.999Z')
    const result = calculateArchivableOn(now, 30)

    expect(result.toISOString()).toEqual('2027-01-15T00:00:00.000Z')
  })

  it('should be timezone-agnostic when called with the same wall-clock UTC instant', () => {
    const now = new Date('2026-06-15T00:00:01.000Z')
    const result = calculateArchivableOn(now, 30)

    expect(result.toISOString()).toEqual('2026-07-16T00:00:00.000Z')
  })

  it('should use UTC arithmetic regardless of local timezone offset (input near midnight)', () => {
    const now = new Date('2026-06-15T23:30:00.000Z')
    const result = calculateArchivableOn(now, 30)

    expect(result.toISOString()).toEqual('2026-07-16T00:00:00.000Z')
  })
})

describe('getAsyncExchangePropertiesWithDefaults utility function testing', () => {
  it('should fill missing async exchange properties with defaults', () => {
    const result = getAsyncExchangePropertiesWithDefaults({
      responseTime: 120,
      bulk: false,
    })

    expect(result).toEqual({
      responseTime: 120,
      resourceAvailableTime: 60,
      maxResultSet: 1,
      confirmation: false,
      bulk: false,
    })
  })
})
