import type {
  AgreementApprovalPolicy,
  DescriptorAttributes,
  ProducerEServiceDescriptor,
} from '@/api/api.generatedTypes'
import type { RemappedEServiceAttributes } from '@/types/attribute.types'
import { getKeys } from '@/utils/array.utils'
import { remapEServiceAttributes } from '@/utils/attribute.utils'
import isEqual from 'lodash/isEqual'

type DescriptorDataStep2ToCompare = {
  voucherLifespan: number
  audience: string[]
  agreementApprovalPolicy: AgreementApprovalPolicy
  version: string
  description: string
  dailyCallsPerConsumer: number
  dailyCallsTotal: number
}

export function compareDescriptorsStep2DataIfEquals(
  newDescriptorData: DescriptorDataStep2ToCompare,
  descriptorToCompare: ProducerEServiceDescriptor
) {
  const descriptorDataToCompare: DescriptorDataStep2ToCompare = {
    voucherLifespan: descriptorToCompare.voucherLifespan,
    audience: descriptorToCompare.audience,
    agreementApprovalPolicy: descriptorToCompare.agreementApprovalPolicy,
    version: descriptorToCompare.version,
    description: descriptorToCompare.description ?? '',
    dailyCallsPerConsumer: descriptorToCompare.dailyCallsPerConsumer,
    dailyCallsTotal: descriptorToCompare.dailyCallsTotal,
  }

  return getKeys(newDescriptorData).every((key) =>
    isEqual(newDescriptorData[key], descriptorDataToCompare[key])
  )
}

export function compareAttributesStep3IfEquals(
  newAttributes: RemappedEServiceAttributes,
  attributesToCompare: DescriptorAttributes
) {
  const remappedAttributesToCompare = remapEServiceAttributes(attributesToCompare)

  const newAttributesToCompare = {
    certified: newAttributes.certified.filter((group) => group.attributes.length > 0),
    verified: newAttributes.verified.filter((group) => group.attributes.length > 0),
    declared: newAttributes.declared.filter((group) => group.attributes.length > 0),
  }

  return getKeys(newAttributes).every((key) =>
    isEqual(newAttributesToCompare[key], remappedAttributesToCompare[key])
  )
}
