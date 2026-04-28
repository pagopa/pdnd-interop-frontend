import { type DescriptorAttributes } from '@/api/api.generatedTypes'
import React from 'react'
import { type TFunction } from 'i18next'

type UseAttributesCountersAlertArgs = {
  attributes: DescriptorAttributes
  t: TFunction<'eservice', 'create'>
}

export const useAttributesCountersAlert = ({
  attributes,
  t,
}: UseAttributesCountersAlertArgs): {
  totalRequirements: number
  attributeTypesWithRequirements: Array<string>
} => {
  const { certified, verified, declared } = attributes

  return React.useMemo(() => {
    const hasCertifiedRequirements = certified.some((group) => group.length > 0)
    const hasVerifiedRequirements = verified.some((group) => group.length > 0)
    const hasDeclaredRequirements = declared.some((group) => group.length > 0)

    const totalRequirements =
      certified.filter((group) => group.length > 0).length +
      verified.filter((group) => group.length > 0).length +
      declared.filter((group) => group.length > 0).length

    const attributeTypesWithRequirements: Array<string> = []
    if (hasCertifiedRequirements)
      attributeTypesWithRequirements.push(t('requirementsSummaryAlertAttributeTypes.certified'))
    if (hasVerifiedRequirements)
      attributeTypesWithRequirements.push(t('requirementsSummaryAlertAttributeTypes.verified'))
    if (hasDeclaredRequirements)
      attributeTypesWithRequirements.push(t('requirementsSummaryAlertAttributeTypes.declared'))

    return {
      totalRequirements,
      attributeTypesWithRequirements,
    }
  }, [certified, verified, declared, t])
}
