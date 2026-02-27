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
import { Typography } from '@mui/material'
import { useCustomizeThresholdDrawer } from './CustomizeThresholdDrawer'

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
  withThreshold?: boolean
}

export const AttributeGroupsListSection: React.FC<AttributeGroupsListSectionProps> = ({
  descriptorAttributes,
  attributeKey,
  topSideActions,
  withThreshold,
}) => {
  const { t: tAttribute } = useTranslation('attribute')

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
            <AttributeGroup
              key={index}
              attributes={attributeGroup}
              index={index}
              attributeKey={attributeKey}
              withThreshold={withThreshold}
            />
          ))}
        </Stack>
      )}
      {attributeGroups.length === 0 && (
        <AttributeGroupContainer
          title={tAttribute(`noGenericAttributesRequiredAlert`, {
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
  attributeKey: AttributeKey
  withThreshold?: boolean
}

const AttributeGroup: React.FC<AttributeGroup> = ({
  attributes,
  index,
  attributeKey,
  withThreshold,
}) => {
  const { open } = useCustomizeThresholdDrawer()
  const { t } = useTranslation('attribute', { keyPrefix: 'group.read' })
  const { t: tAttribute } = useTranslation('attribute')
  const { mode } = useCurrentRoute()
  return (
    <AttributeGroupContainer
      title={tAttribute(`${attributeKey}.requirement`, { index: index + 1 })}
      color="gray"
    >
      <Typography>{t(mode as ProviderOrConsumer)}</Typography>
      <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
        {attributes.map((attribute, _index) => (
          <React.Fragment key={attribute.id}>
            <Box key={attribute.id} component="li">
              <AttributeContainer
                attribute={attribute}
                onCustomizeThreshold={
                  withThreshold && attribute.dailyCallsPerConsumer !== undefined
                    ? () => open(attribute, index)
                    : undefined
                }
              />
            </Box>
            {attributes.length > 1 && _index < attributes.length - 1 && (
              <Divider sx={{ py: 1 }}>
                <Typography color="text.secondary" fontWeight={700} textTransform={'uppercase'}>
                  {tAttribute('or')}
                </Typography>
              </Divider>
            )}
          </React.Fragment>
        ))}
      </Stack>
    </AttributeGroupContainer>
  )
}
