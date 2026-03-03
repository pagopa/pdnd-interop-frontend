import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Stack, Box, Divider, Link } from '@mui/material'
import type { AttributeKey } from '@/types/attribute.types'
import {
  SectionContainer,
  AttributeContainer,
  AttributeGroupContainer,
} from '@/components/layout/containers'
import type {
  CertifiedTenantAttribute,
  DeclaredTenantAttribute,
  DescriptorAttribute,
  DescriptorAttributes,
  VerifiedTenantAttribute,
} from '@/api/api.generatedTypes'
import { useCurrentRoute } from '@/router'
import type { ActionItemButton, ProviderOrConsumer } from '@/types/common.types'
import { attributesHelpLink } from '@/config/constants'
import { Typography } from '@mui/material'
import { useCustomizeThresholdDrawer } from './CustomizeThresholdDrawer'
import { isAttributeGroupFullfilled, isAttributeOwned } from '@/utils/attribute.utils'

export type AttributeOwnershipData = {
  certified: CertifiedTenantAttribute[]
  verified: VerifiedTenantAttribute[]
  declared: DeclaredTenantAttribute[]
  producerId?: string
}

type ReadOnlyDescriptorAttributesProps = {
  descriptorAttributes: DescriptorAttributes
  ownershipData?: AttributeOwnershipData
}

export const ReadOnlyDescriptorAttributes: React.FC<ReadOnlyDescriptorAttributesProps> = ({
  descriptorAttributes,
  ownershipData,
}) => {
  return (
    <>
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="certified"
        ownershipData={ownershipData}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="verified"
        ownershipData={ownershipData}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="declared"
        ownershipData={ownershipData}
      />
    </>
  )
}

type AttributeGroupsListSectionProps = {
  descriptorAttributes: DescriptorAttributes
  attributeKey: AttributeKey
  topSideActions?: Array<ActionItemButton>
  withThreshold?: boolean
  ownershipData?: AttributeOwnershipData
}

export const AttributeGroupsListSection: React.FC<AttributeGroupsListSectionProps> = ({
  descriptorAttributes,
  attributeKey,
  topSideActions,
  withThreshold,
  ownershipData,
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
              ownershipData={ownershipData}
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

type AttributeGroupProps = {
  attributes: Array<DescriptorAttribute>
  index: number
  attributeKey: AttributeKey
  withThreshold?: boolean
  ownershipData?: AttributeOwnershipData
}

function getGroupColorAndText(
  attributeKey: AttributeKey,
  attributes: Array<DescriptorAttribute>,
  ownershipData: AttributeOwnershipData
) {
  const isFulfilled = (() => {
    switch (attributeKey) {
      case 'certified':
        return isAttributeGroupFullfilled('certified', ownershipData.certified, attributes)
      case 'verified':
        return isAttributeGroupFullfilled(
          'verified',
          ownershipData.verified,
          attributes,
          ownershipData.producerId
        )
      case 'declared':
        return isAttributeGroupFullfilled('declared', ownershipData.declared, attributes)
    }
  })()

  if (isFulfilled) {
    return { color: 'success' as const, textKey: 'group.manage.success.consumer' as const }
  }

  if (attributeKey === 'certified') {
    return { color: 'error' as const, textKey: 'group.manage.error.consumer' as const }
  }

  if (attributeKey === 'verified') {
    return {
      color: 'warning' as const,
      textKey: 'group.manage.warning.verified.consumer' as const,
    }
  }

  return {
    color: 'warning' as const,
    textKey: 'group.manage.warning.declared.consumer' as const,
  }
}

function getAttributeChecked(
  attributeKey: AttributeKey,
  attributeId: string,
  ownershipData: AttributeOwnershipData
): boolean {
  switch (attributeKey) {
    case 'certified':
      return isAttributeOwned('certified', attributeId, ownershipData.certified)
    case 'verified':
      return isAttributeOwned(
        'verified',
        attributeId,
        ownershipData.verified,
        ownershipData.producerId
      )
    case 'declared':
      return isAttributeOwned('declared', attributeId, ownershipData.declared)
  }
}

const AttributeGroup: React.FC<AttributeGroupProps> = ({
  attributes,
  index,
  attributeKey,
  withThreshold,
  ownershipData,
}) => {
  const { open } = useCustomizeThresholdDrawer()
  const { t } = useTranslation('attribute', { keyPrefix: 'group.read' })
  const { t: tAttribute } = useTranslation('attribute')
  const { mode } = useCurrentRoute()

  const groupColorAndText = ownershipData
    ? getGroupColorAndText(attributeKey, attributes, ownershipData)
    : undefined

  return (
    <AttributeGroupContainer
      title={tAttribute(`${attributeKey}.requirement`, { index: index + 1 })}
      color={groupColorAndText?.color ?? 'gray'}
    >
      <Typography>
        {groupColorAndText ? tAttribute(groupColorAndText.textKey) : t(mode as ProviderOrConsumer)}
      </Typography>
      <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
        {attributes.map((attribute, _index) => (
          <React.Fragment key={attribute.id}>
            <Box key={attribute.id} component="li">
              <AttributeContainer
                attribute={attribute}
                checked={
                  ownershipData
                    ? getAttributeChecked(attributeKey, attribute.id, ownershipData)
                    : undefined
                }
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
