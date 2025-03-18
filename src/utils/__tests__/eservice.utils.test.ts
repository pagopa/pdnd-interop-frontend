import { getDownloadDocumentName } from '../eservice.utils'

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
