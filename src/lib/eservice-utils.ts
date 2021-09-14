import {
  EServiceCreateDataType,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
  RequestConfig,
} from '../../types'
import isEmpty from 'lodash/isEmpty'

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

export function remapFrontendDocumentsToRequestConfig(
  documents: { [key: string]: EServiceDocumentWrite },
  eserviceId: string,
  descriptorId: string
): RequestConfig[] {
  const requests = Object.values(documents)
    // Remove broken entries, just in case...
    // WARNING: do not check for isEmpty(document.doc) because it's always true
    // See: https://stackoverflow.com/a/60689575
    // Check for typeof document.doc !== 'undefined' instead
    .filter(
      (document) =>
        !isEmpty(document) && typeof document.doc !== 'undefined' && document.doc.size > 0
    )
    // Map them to requests
    .map<RequestConfig>((document) => {
      // Append the file as form data since it's a multipart request
      const formData = new FormData()
      formData.append('kind', document.kind)
      formData.append('description', document.description)
      formData.append('doc', document.doc)

      // Return the request config object
      return {
        path: {
          endpoint: 'ESERVICE_POST_DESCRIPTOR_DOCUMENTS',
          endpointParams: { eserviceId, descriptorId },
        },
        config: {
          method: 'POST',
          headers: { 'Content-Type': 'multipart/form-data' },
          data: formData,
        },
      }
    })

  return requests
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
