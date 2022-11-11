import { DocumentRead } from '@/types/common.types'
import { EServiceReadType } from '@/types/eservice.types'

// Isolate activeDescriptor for easier access
export function decorateEServiceWithCurrentViewingDescriptor(
  descriptorId: string | undefined,
  eserviceData: EServiceReadType
): EServiceReadType | undefined {
  // Fails in case descriptorId is URL_FRAGMENTS.FIRST_DRAFT
  const viewingDescriptor = eserviceData?.descriptors.find(({ id }) => id === descriptorId)
  if (viewingDescriptor && eserviceData) {
    return { ...eserviceData, viewingDescriptor }
  }
  return { ...eserviceData }
}

export function getLatestActiveDescriptor(eserviceData: EServiceReadType | undefined) {
  if (!eserviceData) return undefined
  const sortedByVersionDescriptors = eserviceData.descriptors.sort(
    (a, b) => parseInt(b.version.replace('v', '')) - parseInt(a.version.replace('v', ''))
  )

  if (sortedByVersionDescriptors[0].state === 'DRAFT') {
    sortedByVersionDescriptors.shift()
  }

  return sortedByVersionDescriptors[0]?.state !== 'ARCHIVED'
    ? sortedByVersionDescriptors[0]
    : undefined
}

export function getDownloadDocumentName(document: DocumentRead) {
  const filename: string = document.name
  const filenameBits: Array<string> = filename.split('.').filter((b) => b)
  const fileExtension = filenameBits[filenameBits.length - 1]
  return `${document.prettyName}.${fileExtension}`
}
