import React from 'react'
import { useTranslation } from 'react-i18next'
import { useProviderAgreementDetailsContext } from '../ProviderAgreementDetailsContext'
import type { DescriptorAttribute } from '@/api/api.generatedTypes'
import { AttributeContainer, AttributeGroupContainer } from '@/components/layout/containers'
import { isAttributeGroupFullfilled, isAttributeOwned } from '@/utils/attribute.utils'
import { Stack } from '@mui/material'

export const ProviderAgreementDetailsAttributesDrawerCertifiedAttributesSection: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')

  const { agreement, descriptorAttributes } = useProviderAgreementDetailsContext()

  const certifiedAttributeGroups = descriptorAttributes?.certified ?? []
  const partyAttributes = agreement?.consumer.attributes
  const ownedCertifiedAttributes = partyAttributes?.certified ?? []

  function getGroupContainerProps(
    group: Array<DescriptorAttribute>
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled(
      'certified',
      ownedCertifiedAttributes,
      group
    )

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.provider`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.error.provider`),
      color: 'error',
    }
  }
  return (
    <>
      <Stack spacing={2}>
        {certifiedAttributeGroups.map((group, i) => (
          <AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.map((attribute) => (
                <li key={attribute.id}>
                  <AttributeContainer
                    attribute={attribute}
                    checked={isAttributeOwned('certified', attribute.id, ownedCertifiedAttributes)}
                  />
                </li>
              ))}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>
      {certifiedAttributeGroups.length === 0 && (
        <AttributeGroupContainer
          title={tAttribute(`noAttributesRequiredAlert.provider`, {
            attributeKey: tAttribute(`type.certified_other`),
          })}
          color="gray"
        />
      )}
    </>
  )
}
