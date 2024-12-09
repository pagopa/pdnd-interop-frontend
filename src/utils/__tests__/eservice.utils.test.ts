import { getDownloadDocumentName, getLastDescriptor } from '../eservice.utils'

describe('getDownloadDocumentName utility function testing', () => {
  it('should correctly get the document namy from a DocumentRead data type', () => {
    const result = getDownloadDocumentName({
      id: 'test-id',
      contentType: 'pdf',
      name: 'test.pdf',
      prettyName: 'document',
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
})
