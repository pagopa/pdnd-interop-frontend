import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Stack, Box, Divider, Link } from '@mui/material'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import type { AttributeKey, RemappedDescriptorAttribute } from '@/types/attribute.types'
import {
  SectionContainer,
  AttributeContainer,
  AttributeGroupContainer,
} from '@/components/layout/containers'
import type { CompactAttribute } from '@/api/api.generatedTypes'
import { useCurrentRoute } from '@/router'
import type { ProviderOrConsumer } from '@/types/common.types'
import { attributesHelpLink } from '@/config/constants'

export const EServiceDescriptorAttributesSections: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')
  const { mode } = useCurrentRoute()

  const providerOrConsumer = mode as ProviderOrConsumer

  const { descriptorAttributes } = useEServiceDetailsContext()

  const getSubtitle = (attributeKey: AttributeKey) => {
    return (
      <Trans
        components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
      >
        {tAttribute(`${attributeKey}.description`)}
      </Trans>
    )
  }

  return (
    <SectionContainer newDesign component="div">
      <AttributeGroupsListSection
        title={tAttribute('certified.label')}
        subtitle={getSubtitle('certified')}
        attributeGroups={descriptorAttributes.certified}
        emptyLabel={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
          attributeKey: tAttribute(`type.certified_other`),
        })}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        title={tAttribute('verified.label')}
        subtitle={getSubtitle('verified')}
        attributeGroups={descriptorAttributes.verified}
        emptyLabel={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
          attributeKey: tAttribute(`type.verified_other`),
        })}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        title={tAttribute('declared.label')}
        subtitle={getSubtitle('declared')}
        attributeGroups={descriptorAttributes.declared}
        emptyLabel={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
          attributeKey: tAttribute(`type.declared_other`),
        })}
      />
    </SectionContainer>
  )
}

type AttributeGroupsListSectionProps = {
  attributeGroups: Array<RemappedDescriptorAttribute>
  title: string
  subtitle: React.ReactNode
  emptyLabel: string
}

const AttributeGroupsListSection: React.FC<AttributeGroupsListSectionProps> = ({
  attributeGroups,
  title,
  subtitle,
  emptyLabel,
}) => {
  return (
    <SectionContainer newDesign innerSection title={title} description={subtitle}>
      {attributeGroups.length > 0 && (
        <Stack spacing={3}>
          {attributeGroups.map((attributeGroup, index) => (
            <AttributeGroup key={index} attributes={attributeGroup.attributes} index={index} />
          ))}
        </Stack>
      )}
      {attributeGroups.length === 0 && <AttributeGroupContainer title={emptyLabel} color="gray" />}
    </SectionContainer>
  )
}

type AttributeGroup = {
  attributes: Array<CompactAttribute>
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