import React from 'react'
import { useCurrentRoute } from '@/router'
import { Trans, useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../AgreementDetailsContext'
import {
  SectionContainer,
  AttributeGroupContainer,
  AttributeContainer,
} from '@/components/layout/containers'
import { Link, Stack } from '@mui/material'
import type { RemappedDescriptorAttribute } from '@/types/attribute.types'
import {
  isAttributeOwned,
  isAttributeGroupFullfilled,
  isAttributeRevoked,
} from '@/utils/attribute.utils'
import type { ProviderOrConsumer } from '@/types/common.types'
import { useAgreementGetVerifiedAttributesActions } from '../../hooks/useAgreementGetVerifiedAttributesActions'
import { attributesHelpLink } from '@/config/constants'

export const AgreementVerifiedAttributesSection: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')
  const { mode } = useCurrentRoute()

  const { descriptorAttributes, partyAttributes } = useAgreementDetailsContext()

  const providerOrConsumer = mode as ProviderOrConsumer

  const verifiedAttributeGroups = descriptorAttributes?.verified ?? []
  const ownedVerifiedAttributes = partyAttributes?.verified ?? []

  const getAttributeActions = useAgreementGetVerifiedAttributesActions()

  const getChipLabel = (attributeId: string) => {
    const attribute = ownedVerifiedAttributes.find((a) => a.id === attributeId)
    if (!attribute) return

    if (isAttributeRevoked('verified', attribute))
      return tAttribute('group.manage.revokedByProducer')
  }

  function getGroupContainerProps(
    group: RemappedDescriptorAttribute
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled('verified', ownedVerifiedAttributes, group)

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.${providerOrConsumer}`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.warning.verified.${providerOrConsumer}`),
      color: 'warning',
    }
  }

  return (
    <SectionContainer
      newDesign
      innerSection
      title={tAttribute('verified.label')}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tAttribute(`verified.description`)}
        </Trans>
      }
    >
      <Stack spacing={2}>
        {verifiedAttributeGroups.map((group, i) => (
          <AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute) => (
                <AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  chipLabel={getChipLabel(attribute.id)}
                  checked={isAttributeOwned('verified', attribute.id, ownedVerifiedAttributes)}
                  actions={getAttributeActions(attribute.id)}
                />
              ))}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>
      {verifiedAttributeGroups.length === 0 && (
        <AttributeGroupContainer
          title={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
            attributeKey: tAttribute(`type.verified_other`),
          })}
          color="gray"
        />
      )}
    </SectionContainer>
  )
}
