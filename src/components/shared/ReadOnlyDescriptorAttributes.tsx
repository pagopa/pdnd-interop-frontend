import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Stack, Box, Divider, Link } from '@mui/material'
import type { AttributeKey } from '@/types/attribute.types'
import {
  SectionContainer,
  AttributeContainer,
  AttributeGroupContainer,
} from '@/components/layout/containers'
import type { DescriptorAttribute, DescriptorAttributes } from '@/api/api.generatedTypes'
import { useCurrentRoute } from '@/router'
import type { ActionItemButton, ProviderOrConsumer } from '@/types/common.types'
import { attributesHelpLink } from '@/config/constants'

type ReadOnlyDescriptorAttributesProps = {
  descriptorAttributes: DescriptorAttributes
}

export const ReadOnlyDescriptorAttributes: React.FC<ReadOnlyDescriptorAttributesProps> = ({
  descriptorAttributes,
}) => {
  return (
    <>
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="certified"
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="verified"
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="declared"
      />
    </>
  )
}

type AttributeGroupsListSectionProps = {
  descriptorAttributes: DescriptorAttributes
  attributeKey: AttributeKey
  topSideActions?: Array<ActionItemButton>
}

export const AttributeGroupsListSection: React.FC<AttributeGroupsListSectionProps> = ({
  descriptorAttributes,
  attributeKey,
  topSideActions,
}) => {
  const { t: tAttribute } = useTranslation('attribute')

  const { mode } = useCurrentRoute()

  const providerOrConsumer = mode as ProviderOrConsumer

  const attributeGroups = descriptorAttributes[attributeKey]

  return (
    <SectionContainer
      innerSection
      title={tAttribute(`${attributeKey}.label`)}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tAttribute(`${attributeKey}.description`)}
        </Trans>
      }
      topSideActions={topSideActions}
    >
      {attributeGroups.length > 0 && (
        <Stack spacing={3}>
          {attributeGroups.map((attributeGroup, index) => (
            <AttributeGroup key={index} attributes={attributeGroup} index={index} />
          ))}
        </Stack>
      )}
      {attributeGroups.length === 0 && (
        <AttributeGroupContainer
          title={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
            attributeKey: tAttribute(`type.${attributeKey}_other`),
          })}
          color="gray"
        />
      )}
    </SectionContainer>
  )
}

type AttributeGroup = {
  attributes: Array<DescriptorAttribute>
  index: number
}

const AttributeGroup: React.FC<AttributeGroup> = ({ attributes }) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group.read' })
  const { mode } = useCurrentRoute()

  return (
    <AttributeGroupContainer title={t(mode as ProviderOrConsumer)} color="gray">
      <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
        {attributes.map((attribute) => (
          <Box key={attribute.id} component="li">
            <AttributeContainer attribute={attribute} />
          </Box>
        ))}
      </Stack>
    </AttributeGroupContainer>
  )
}
