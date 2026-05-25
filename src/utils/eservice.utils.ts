import type {
  AsyncExchangeProperties,
  EServiceDoc,
  Document,
  CompactDescriptor,
} from '@/api/api.generatedTypes'

export const defaultAsyncExchangeProperties: AsyncExchangeProperties = {
  responseTime: 60,
  resourceAvailableTime: 60,
  maxResultSet: 1,
  confirmation: false,
  bulk: true,
}

export function getAsyncExchangePropertiesWithDefaults(
  asyncExchangeProperties: Partial<AsyncExchangeProperties> | undefined
): AsyncExchangeProperties {
  return {
    responseTime:
      asyncExchangeProperties?.responseTime ?? defaultAsyncExchangeProperties.responseTime,
    resourceAvailableTime:
      asyncExchangeProperties?.resourceAvailableTime ??
      defaultAsyncExchangeProperties.resourceAvailableTime,
    maxResultSet:
      asyncExchangeProperties?.maxResultSet ?? defaultAsyncExchangeProperties.maxResultSet,
    confirmation:
      asyncExchangeProperties?.confirmation ?? defaultAsyncExchangeProperties.confirmation,
    bulk: asyncExchangeProperties?.bulk ?? defaultAsyncExchangeProperties.bulk,
  }
}

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
