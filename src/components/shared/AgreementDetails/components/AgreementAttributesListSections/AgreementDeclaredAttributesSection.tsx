import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../AgreementDetailsContext'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import {
  SectionContainer,
  AttributeGroupContainer,
  AttributeContainer,
} from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { useCurrentRoute } from '@/router'
import type { ProviderOrConsumer } from '@/types/common.types'
import { isAttributeOwned, isAttributeGroupFullfilled } from '@/utils/attribute.utils'
import { useAgreementGetDeclaredAttributesActions } from '../../hooks/useAgreementGetDeclaredAttributesActions'

export const AgreementDeclaredAttributesSection: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')
  const { mode } = useCurrentRoute()

  const { eserviceAttributes, partyAttributes } = useAgreementDetailsContext()

  const declaredAttributeGroups = eserviceAttributes?.declared ?? []
  const ownedDeclaredAttributes = partyAttributes?.declared ?? []

  const providerOrConsumer = mode as ProviderOrConsumer

  const getDeclaredAttributeActions = useAgreementGetDeclaredAttributesActions()

  function getGroupContainerProps(
    group: RemappedEServiceAttribute
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled('declared', ownedDeclaredAttributes, group)

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.${providerOrConsumer}`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.warning.declared.${providerOrConsumer}`),
      color: 'warning',
    }
  }

  return (
    <SectionContainer
      newDesign
      innerSection
      title={tAttribute('declared.label')}
      description={tAttribute('declared.description')}
    >
      <Stack spacing={2}>
        {declaredAttributeGroups.map((group, i) => (
          <AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute) => (
                <AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  checked={isAttributeOwned('declared', attribute.id, ownedDeclaredAttributes)}
                  actions={getDeclaredAttributeActions(attribute.id)}
                />
              ))}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>
      {declaredAttributeGroups.length === 0 && (
        <AttributeGroupContainer
          title={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
            attributeKey: tAttribute(`type.declared_other`),
          })}
          color="gray"
        />
      )}
    </SectionContainer>
  )
}
