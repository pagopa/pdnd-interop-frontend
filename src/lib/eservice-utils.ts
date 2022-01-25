import { Location } from 'history'
import { EServiceNoDescriptorId, EServiceReadType } from '../../types'
import { getBits } from './router-utils'

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

export function getEserviceAndDescriptorFromUrl(location: Location<unknown>) {
  const bits = getBits(location)
  // EServiceNoDescriptorId disappears in the typing
  // (cannot do better than this because of #6579 – https://github.com/Microsoft/TypeScript/issues/6579)
  // but it is important to realize descriptorId might have a value that identifies a not-yet-created descriptor
  const descriptorId: string | EServiceNoDescriptorId | undefined = bits.pop() // last item in bits array
  const eserviceId = bits.pop() // last-but-two item in bits array

  return { eserviceId, descriptorId }
}
