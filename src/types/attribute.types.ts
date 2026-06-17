import type {
  AttributeKind,
  DescriptorAttributes,
  EServiceAttributeCertifiedDiscreteConfig,
} from '@/api/api.generatedTypes'

// export type AttributeKey = Lowercase<AttributeKind>
// the AttributeKey type is defined as the keys of DescriptorAttributes
// which were the same as the lowercase version of AttributeKind but now,
// with the addition of the "CERTIFIED_DISCRETE" kind in AttributeKind which doesn't have a corresponding key in DescriptorAttributes, it is not the same anymore.
// "CERTIFIED_DISCRETE" is a sub-kind of "CERTIFIED" and it is under the same key of "certified" in DescriptorAttributes,
// so we can't use the Lowercase<AttributeKind> approach to define the AttributeKey type
export type AttributeKey = keyof DescriptorAttributes

export type FormDescriptorAttribute = {
  id: string
  name: string
  kind: AttributeKind
  dailyCallsPerConsumer?: number
  discreteConfig?: EServiceAttributeCertifiedDiscreteConfig
}

export type FormDescriptorAttributes = {
  certified: FormDescriptorAttribute[][]
  declared: FormDescriptorAttribute[][]
  verified: FormDescriptorAttribute[][]
}
