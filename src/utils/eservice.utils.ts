import type { EServiceDoc, Document } from '@/api/api.generatedTypes'

export function getDownloadDocumentName(document: EServiceDoc | Document) {
  const filename: string = document.name
  const filenameBits: Array<string> = filename.split('.').filter((b) => b)
  const fileExtension = filenameBits[filenameBits.length - 1]
  return `${document.prettyName}.${fileExtension}`
}
