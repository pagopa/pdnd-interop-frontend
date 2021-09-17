import {
  EServiceCreateDataType,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'

export function remapBackendDocumentsToFrontend(
  interfaceDoc: EServiceDocumentRead | undefined,
  docs: EServiceDocumentRead[] | undefined
): {
  [key: string]: EServiceDocumentWrite
} {
  const documents: { [key: string]: EServiceDocumentWrite } = {}

  // Don't check it with isEmpty, as a File object may be without enumerable properties
  if (typeof interfaceDoc !== 'undefined') {
    const writeInterface: EServiceDocumentWrite = {
      kind: 'interface',
      description: interfaceDoc!.description,
      doc: { name: interfaceDoc!.name }, // TEMP BACKEND: this "doc" should be the document blob
    }

    documents['interface'] = writeInterface
  }

  if (typeof docs !== 'undefined') {
    docs!.forEach(({ name, description }, i) => {
      // TEMP BACKEND: this "doc" should be the document blob
      const doc: EServiceDocumentWrite = { kind: 'document', description, doc: { name } }
      documents[`document-${i}`] = doc
    })
  }

  return documents
}

export function remapBackendEServiceDataToFrontend(data: EServiceReadType): EServiceCreateDataType {
  return {
    name: data.name,
    description: data.description,
    audience: data.audience,
    technology: data.technology,
    voucherLifespan: data.voucherLifespan,
    producerId: data.producerId,
    pop: false,
  }
}
