import type { TFunction } from 'i18next'
import type { EServiceDescriptorState } from '@/api/api.generatedTypes'
import {
  calculateArchivableOn,
  getAsyncExchangePropertiesWithDefaults,
  getDownloadDocumentName,
  getEServiceDescriptorAlertSpec,
  getLastDescriptor,
  getViewLatestVersionTargetId,
  isDescriptorPendingArchiving,
  sanitizeImportEserviceFileName,
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

describe('isDescriptorPendingArchiving utility function testing', () => {
  it('returns true for ARCHIVING and ARCHIVING_SUSPENDED', () => {
    expect(isDescriptorPendingArchiving('ARCHIVING')).toBe(true)
    expect(isDescriptorPendingArchiving('ARCHIVING_SUSPENDED')).toBe(true)
  })

  it.each<EServiceDescriptorState | undefined>([
    'PUBLISHED',
    'ARCHIVED',
    'SUSPENDED',
    'DEPRECATED',
    'DRAFT',
    undefined,
  ])('returns false for state %s', (state) => {
    expect(isDescriptorPendingArchiving(state)).toBe(false)
  })
})

describe('getEServiceDescriptorAlertSpec utility function testing', () => {
  const t = ((key: string, opts?: { date?: string }) =>
    opts && 'date' in opts ? `${key}:${opts.date}` : key) as unknown as TFunction<
    'eservice',
    'read.alert'
  >

  const baseArgs = {
    scope: undefined,
    archivableOn: undefined,
    archivedAt: undefined,
    t,
  } as const

  it('returns error severity with suspended content when state is SUSPENDED (scope ignored)', () => {
    expect(getEServiceDescriptorAlertSpec({ ...baseArgs, state: 'SUSPENDED' })).toEqual({
      severity: 'error',
      content: 'suspended',
    })
  })

  it('returns info severity with deprecated content when state is DEPRECATED (scope ignored)', () => {
    expect(getEServiceDescriptorAlertSpec({ ...baseArgs, state: 'DEPRECATED' })).toEqual({
      severity: 'info',
      content: 'deprecated',
    })
  })

  it('returns info archivingDescriptor with formatted scheduled date when ARCHIVING + DESCRIPTOR', () => {
    expect(
      getEServiceDescriptorAlertSpec({
        ...baseArgs,
        state: 'ARCHIVING',
        scope: 'DESCRIPTOR',
        archivableOn: '2026-12-01T00:00:00.000Z',
      })
    ).toEqual({
      severity: 'info',
      content: expect.stringMatching(/^archivingDescriptor:.+/),
    })
  })

  it('returns error archivingSuspendedDescriptor when ARCHIVING_SUSPENDED + DESCRIPTOR', () => {
    expect(
      getEServiceDescriptorAlertSpec({
        ...baseArgs,
        state: 'ARCHIVING_SUSPENDED',
        scope: 'DESCRIPTOR',
        archivableOn: '2026-12-01T00:00:00.000Z',
      })
    ).toEqual({
      severity: 'error',
      content: expect.stringMatching(/^archivingSuspendedDescriptor:.+/),
    })
  })

  it('returns error archivingSuspendedEService when ARCHIVING_SUSPENDED + ESERVICE', () => {
    expect(
      getEServiceDescriptorAlertSpec({
        ...baseArgs,
        state: 'ARCHIVING_SUSPENDED',
        scope: 'ESERVICE',
        archivableOn: '2026-12-01T00:00:00.000Z',
      })
    ).toEqual({
      severity: 'error',
      content: expect.stringMatching(/^archivingSuspendedEService:.+/),
    })
  })

  it('returns info archivedEService when ARCHIVED + ESERVICE', () => {
    expect(
      getEServiceDescriptorAlertSpec({
        ...baseArgs,
        state: 'ARCHIVED',
        scope: 'ESERVICE',
        archivedAt: '2026-12-01T00:00:00.000Z',
      })
    ).toEqual({
      severity: 'info',
      content: expect.stringMatching(/^archivedEService:.+/),
    })
  })

  it('returns info archivedDescriptor for ARCHIVED with scope DESCRIPTOR (default branch)', () => {
    expect(
      getEServiceDescriptorAlertSpec({
        ...baseArgs,
        state: 'ARCHIVED',
        scope: 'DESCRIPTOR',
        archivedAt: '2026-12-01T00:00:00.000Z',
      })
    ).toEqual({
      severity: 'info',
      content: expect.stringMatching(/^archivedDescriptor:.+/),
    })
  })

  it('returns info archivedDescriptor for ARCHIVED with no scope (default branch fallback)', () => {
    expect(
      getEServiceDescriptorAlertSpec({
        ...baseArgs,
        state: 'ARCHIVED',
        archivedAt: '2026-12-01T00:00:00.000Z',
      })
    ).toEqual({
      severity: 'info',
      content: expect.stringMatching(/^archivedDescriptor:.+/),
    })
  })

  it('returns combined archivedDescriptor + archivingEService when ARCHIVED and the e-service is being archived', () => {
    expect(
      getEServiceDescriptorAlertSpec({
        ...baseArgs,
        state: 'ARCHIVED',
        archivedAt: '2026-12-01T00:00:00.000Z',
        isEServiceBeingArchived: true,
        eserviceArchivableOn: '2027-01-15T00:00:00.000Z',
      })
    ).toEqual({
      severity: 'info',
      content: expect.stringMatching(/^archivedDescriptor:.+ archivingEService:.+$/),
    })
  })

  it('returns undefined for states not handled by any branch (PUBLISHED)', () => {
    expect(getEServiceDescriptorAlertSpec({ ...baseArgs, state: 'PUBLISHED' })).toBeUndefined()
  })

  it('returns undefined for ARCHIVING without a scope (no matching branch)', () => {
    expect(getEServiceDescriptorAlertSpec({ ...baseArgs, state: 'ARCHIVING' })).toBeUndefined()
  })

  it('passes empty string for the date when archivableOn is undefined on ARCHIVING + DESCRIPTOR', () => {
    expect(
      getEServiceDescriptorAlertSpec({
        ...baseArgs,
        state: 'ARCHIVING',
        scope: 'DESCRIPTOR',
      })
    ).toEqual({
      severity: 'info',
      content: 'archivingDescriptor:',
    })
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

describe('sanitizeImportEserviceFileName utility function testing', () => {
  it.each([
    {
      scenario: 'strips the browser ` (1)` collision suffix',
      input: 'abc123_def456 (1).zip',
      expected: 'abc123_def456.zip',
    },
    {
      scenario: 'strips a multi-digit ` (n)` suffix',
      input: 'abc123_def456 (12).zip',
      expected: 'abc123_def456.zip',
    },
    {
      scenario: 'strips the no-space `(n)` suffix (e.g. Firefox)',
      input: 'abc123_def456(1).zip',
      expected: 'abc123_def456.zip',
    },
    {
      scenario: 'leaves an untouched file name unchanged',
      input: 'abc123_def456.zip',
      expected: 'abc123_def456.zip',
    },
    {
      scenario: 'does not strip a suffix that is not right before the extension',
      input: 'abc (1) def.zip',
      expected: 'abc (1) def.zip',
    },
    {
      scenario: 'only strips the suffix adjacent to the .zip extension',
      input: 'abc (2) def (1).zip',
      expected: 'abc (2) def.zip',
    },
    {
      scenario: 'does not strip the suffix when the extension is not .zip',
      input: 'abc (1).txt',
      expected: 'abc (1).txt',
    },
    {
      scenario: 'keeps parentheses that are part of the name (no number)',
      input: 'abc (copy).zip',
      expected: 'abc (copy).zip',
    },
  ])('should $scenario', ({ input, expected }) => {
    expect(sanitizeImportEserviceFileName(input)).toEqual(expected)
  })
})
