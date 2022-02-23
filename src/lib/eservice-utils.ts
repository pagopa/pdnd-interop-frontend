import { Location } from 'history'
import { EServiceReadType } from '../../types'
import { URL_FRAGMENTS } from './constants'
import { getBits } from './router-utils'

// Isolate activeDescriptor for easier access
export function decorateEServiceWithActiveDescriptor(descriptorId: string | undefined) {
  return (eserviceData: EServiceReadType) => {
    // Fails in case descriptorId is URL_FRAGMENTS.FIRST_DRAFT
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

  // If we are in edit mode, strip that path bit
  if (Object.values(URL_FRAGMENTS.EDIT).includes(bits[bits.length - 1])) {
    bits.pop()
  }

  // descriptorId might be URL_FRAGMENTS.FIRST_DRAFT
  const descriptorId: string | undefined = bits.pop() // last item in bits array
  const eserviceId = bits.pop() // last-but-two item in bits array

  return { eserviceId, descriptorId }
}
