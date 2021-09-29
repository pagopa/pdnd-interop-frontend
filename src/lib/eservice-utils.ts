import {
  EServiceDocumentKind,
  EServiceDocumentRead,
  EServiceDocumentWrite,
  EServiceReadType,
} from '../../types'

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

// Isolate activeDescriptor for easier access
export function decorateEServiceWithActiveDescriptor(descriptorId: string | undefined) {
  return (eserviceData: EServiceReadType) => {
    // Fails in case descriptorId is EServiceNoDescriptorId
    const activeDescriptor = eserviceData.descriptors.find(({ id }) => id === descriptorId)
    return { ...eserviceData, activeDescriptor }
  }
}

export function getActiveDescriptor(data: EServiceReadType | undefined, descriptorId: string) {
  return data ? data.descriptors.find((d) => d.id === descriptorId) : undefined
}

export function getActiveInterface(data: EServiceReadType | undefined, descriptorId: string) {
  const activeDescriptor = getActiveDescriptor(data, descriptorId)
  return activeDescriptor ? activeDescriptor.interface : undefined
}

export function getActiveDocs(data: EServiceReadType | undefined, descriptorId: string) {
  const activeDescriptor = getActiveDescriptor(data, descriptorId)
  return activeDescriptor ? activeDescriptor.docs : []
}

export function mergeActions<T>(actionObjs: T[], status: keyof T) {
  const actionsArray = actionObjs.map((k) => k[status])
  return Array.prototype.concat.apply([], actionsArray)
}
