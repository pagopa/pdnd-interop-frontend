import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, Box, Divider } from '@mui/material'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import {
  SectionContainer,
  AttributeContainer,
  AttributeGroupContainer,
} from '@/components/layout/containers'
import type { CompactAttribute } from '@/api/api.generatedTypes'
import { useCurrentRoute } from '@/router'
import type { ProviderOrConsumer } from '@/types/common.types'

export const EServiceAttributesSections: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')
  const { mode } = useCurrentRoute()

  const providerOrConsumer = mode as ProviderOrConsumer

  const { eserviceAttributes } = useEServiceDetailsContext()

  return (
    <SectionContainer newDesign component="div">
      <AttributeGroupsListSection
        title={tAttribute('certified.label')}
        subtitle={tAttribute('certified.description')}
        attributeGroups={eserviceAttributes.certified}
        emptyLabel={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
          attributeKey: tAttribute(`type.certified_other`),
        })}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        title={tAttribute('verified.label')}
        subtitle={tAttribute('verified.description')}
        attributeGroups={eserviceAttributes.verified}
        emptyLabel={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
          attributeKey: tAttribute(`type.verified_other`),
        })}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        title={tAttribute('declared.label')}
        subtitle={tAttribute('declared.description')}
        attributeGroups={eserviceAttributes.declared}
        emptyLabel={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
          attributeKey: tAttribute(`type.declared_other`),
        })}
      />
    </SectionContainer>
  )
}

type AttributeGroupsListSectionProps = {
  attributeGroups: Array<RemappedEServiceAttribute>
  title: string
  subtitle: string
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
