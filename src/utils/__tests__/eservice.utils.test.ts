import {
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
