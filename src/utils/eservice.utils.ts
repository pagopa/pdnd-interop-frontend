import type { EServiceDoc, Document, CompactDescriptor } from '@/api/api.generatedTypes'

export function getDownloadDocumentName(document: EServiceDoc | Document) {
  const filename: string = document.name
  const filenameBits: Array<string> = filename.split('.').filter((b) => b)
  const fileExtension = filenameBits[filenameBits.length - 1]
  return `${document.prettyName}.${fileExtension}`
}

export function getLastDescriptor(descriptors: Array<CompactDescriptor>) {
  const descriptor = descriptors.find((descriptor) =>
    descriptors.every((d) => descriptor.version >= d.version)
  )
  return descriptor
}
