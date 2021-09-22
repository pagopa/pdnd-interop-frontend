import {
  EServiceCreateDataType,
  EServiceDocumentKind,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'

// export function remapBackendDocumentsToFrontend(
//   interfaceDoc: EServiceDocumentRead | undefined,
//   docs: EServiceDocumentRead[] | undefined
// ): {
//   [key: string]: EServiceDocumentWrite
// } {
//   const documents: { [key: string]: EServiceDocumentWrite } = {}

//   // Don't check it with isEmpty, as a File object may be without enumerable properties
//   if (typeof interfaceDoc !== 'undefined') {
//     const writeInterface: EServiceDocumentWrite = {
//       kind: 'interface',
//       description: interfaceDoc!.description,
//       doc: { name: interfaceDoc!.name }, // TEMP BACKEND: this "doc" should be the document blob
//     }

//     documents['interface'] = writeInterface
//   }

//   if (typeof docs !== 'undefined') {
//     docs!.forEach(({ name, description }, i) => {
//       // TEMP BACKEND: this "doc" should be the document blob
//       const doc: EServiceDocumentWrite = { kind: 'document', description, doc: { name } }
//       documents[`document-${i}`] = doc
//     })
//   }

//   return documents
// }

export function remapBackendEServiceDataToFrontend({
  name,
  description,
  technology,
  producerId,
}: EServiceReadType): EServiceCreateDataType {
  return { name, description, technology, producerId, pop: false }
}

export function remapBackendDocumentToFrontend(
  backendDocument: EServiceDocumentRead,
  kind: EServiceDocumentKind
): EServiceDocumentWrite | undefined {
  if (!backendDocument) {
    return
  }

  const { id, description, name } = backendDocument
  return { kind, description, doc: { name, id } }
}
