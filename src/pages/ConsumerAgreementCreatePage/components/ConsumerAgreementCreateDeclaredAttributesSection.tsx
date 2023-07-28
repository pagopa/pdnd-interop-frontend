import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useConsumerAgreementCreateContentContext } from '../ConsumerAgreementCreateContentContext'
import type { RemappedDescriptorAttribute } from '@/types/attribute.types'
import {
  AttributeContainer,
  AttributeGroupContainer,
  SectionContainer,
} from '@/components/layout/containers'
import {
  isAttributeGroupFullfilled,
  isAttributeOwned,
  isAttributeRevoked,
} from '@/utils/attribute.utils'
import { Link, Stack } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { useGetConsumerDeclaredAttributesActions } from '../hooks/useGetConsumerDeclaredAttributesActions'

const ConsumerAgreementCreateDeclaredAttributesSection: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')

  const { descriptorAttributes, partyAttributes } = useConsumerAgreementCreateContentContext()

  const declaredAttributeGroups = descriptorAttributes?.declared ?? []
  const ownedDeclaredAttributes = partyAttributes?.declared ?? []

  const getDeclaredAttributeActions = useGetConsumerDeclaredAttributesActions()
  function getGroupContainerProps(
    group: RemappedDescriptorAttribute
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled('declared', ownedDeclaredAttributes, group)

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.consumer`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.warning.declared.consumer`),
      color: 'warning',
    }
  }

  const getChipLabel = (attributeId: string) => {
    const attribute = ownedDeclaredAttributes.find((a) => a.id === attributeId)
    if (!attribute) return

    if (isAttributeRevoked('declared', attribute))
      return tAttribute('group.manage.revokedByOwnParty')
  }

  return (
    <SectionContainer
      newDesign
      title={tAttribute('declared.label')}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tAttribute(`declared.description`)}
        </Trans>
      }
      sx={{ borderRadius: 2 }}
    >
      <Stack spacing={2}>
        {declaredAttributeGroups.map((group, i) => (
          <AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute) => (
                <AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  chipLabel={getChipLabel(attribute.id)}
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
          title={tAttribute(`noAttributesRequiredAlert.consumer`, {
            attributeKey: tAttribute(`type.declared_other`),
          })}
          color="gray"
        />
      )}
    </SectionContainer>
  )
}

export default ConsumerAgreementCreateDeclaredAttributesSection
