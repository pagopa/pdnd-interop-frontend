import React from 'react'
import { useTranslation } from 'react-i18next'
import { useProviderAgreementDetailsContext } from '../ProviderAgreementDetailsContext'
import { AttributeContainer, AttributeGroupContainer } from '@/components/layout/containers'
import { isAttributeGroupFullfilled, isAttributeOwned } from '@/utils/attribute.utils'
import type { DescriptorAttribute } from '@/api/api.generatedTypes'
import { Stack } from '@mui/material'

export const ProviderAgreementDetailsAttributesDrawerDeclaredAttributesSection: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')

  const { agreement, descriptorAttributes } = useProviderAgreementDetailsContext()

  const declaredAttributeGroups = descriptorAttributes?.declared ?? []
  const partyAttributes = agreement?.consumer.attributes
  const ownedDeclaredAttributes = partyAttributes?.declared ?? []

  function getGroupContainerProps(
    group: Array<DescriptorAttribute>
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled('declared', ownedDeclaredAttributes, group)

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.provider`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.warning.declared.provider`),
      color: 'warning',
    }
  }
  return (
    <>
      <Stack spacing={2}>
        {declaredAttributeGroups.map((group, i) => (
          <AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.map((attribute) => (
                <li key={attribute.id}>
                  <AttributeContainer
                    attribute={attribute}
                    checked={isAttributeOwned('declared', attribute.id, ownedDeclaredAttributes)}
                  />
                </li>
              ))}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>
      {declaredAttributeGroups.length === 0 && (
        <AttributeGroupContainer
          title={tAttribute(`noAttributesRequiredAlert.provider`, {
            attributeKey: tAttribute(`type.declared_other`),
          })}
          color="gray"
        />
      )}
    </>
  )
}
