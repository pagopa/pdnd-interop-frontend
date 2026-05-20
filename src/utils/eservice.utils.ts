import type { EServiceDoc, Document, CompactDescriptor } from '@/api/api.generatedTypes'

export function getDownloadDocumentName(document: EServiceDoc | Document) {
  const filename: string = document.name
  const filenameBits: Array<string> = filename.split('.').filter((b) => b)
  const fileExtension = filenameBits[filenameBits.length - 1]
  return `${document.prettyName}.${fileExtension}`
}

export function getLastDescriptor(descriptors: Array<CompactDescriptor> | undefined) {
  const descriptor = descriptors?.find((descriptor) =>
    descriptors.every((d) => descriptor.version >= d.version)
  )
  return descriptor
}

export function getViewLatestVersionTargetId(
  descriptors: Array<CompactDescriptor> | undefined,
  currentDescriptorId: string | undefined
) {
  const latestId = getLastDescriptor(
    descriptors?.filter((d) => d.state !== 'DRAFT' && d.state !== 'WAITING_FOR_APPROVAL')
  )?.id
  return latestId && latestId !== currentDescriptorId ? latestId : undefined
}
