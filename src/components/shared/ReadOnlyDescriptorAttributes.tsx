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
  DescriptorAttribute,
  DescriptorAttributes,
  EServiceAttributeCertifiedDiscreteConfig,
  TenantAttributes,
} from '@/api/api.generatedTypes'
import type { ActionItemButton } from '@/types/common.types'
import { attributesHelpLink } from '@/config/constants'
import { Typography } from '@mui/material'
import { useCustomizeThresholdDrawer } from './CustomizeThresholdDrawer'
import {
  hasAllDescriptorAttributes,
  isAttributeGroupFullfilled,
  isAttributeOwned,
} from '@/utils/attribute.utils'

export type AttributeOwnershipData = {
  certified: TenantAttributes['certified']
  verified: TenantAttributes['verified']
  declared: TenantAttributes['declared']
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
  const { t: tAttribute } = useTranslation('attribute')

  const hasNoAttributes =
    descriptorAttributes.certified.length === 0 &&
    descriptorAttributes.verified.length === 0 &&
    descriptorAttributes.declared.length === 0

  if (hasNoAttributes) {
    return (
      <SectionContainer innerSection title={tAttribute('attributesGenericLabel')}>
        <AttributeGroupContainer
          title={tAttribute('noAttributesRequiredGenericAlert')}
          color="gray"
        />
      </SectionContainer>
    )
  }

  const hasBlockingAttribute =
    !!ownershipData &&
    !hasAllDescriptorAttributes(
      'certified',
      ownershipData.certified,
      descriptorAttributes.certified
    )

  return (
    <>
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="certified"
        ownershipData={ownershipData}
        hasBlockingAttribute={hasBlockingAttribute}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="verified"
        ownershipData={ownershipData}
        hasBlockingAttribute={hasBlockingAttribute}
      />
      <Divider sx={{ my: 3 }} />
      <AttributeGroupsListSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="declared"
        ownershipData={ownershipData}
        hasBlockingAttribute={hasBlockingAttribute}
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
  hasBlockingAttribute?: boolean
}

export const AttributeGroupsListSection: React.FC<AttributeGroupsListSectionProps> = ({
  descriptorAttributes,
  attributeKey,
  topSideActions,
  withThreshold,
  ownershipData,
  hasBlockingAttribute = false,
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
              hasBlockingAttribute={hasBlockingAttribute}
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
  hasBlockingAttribute?: boolean
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
  ownershipData: AttributeOwnershipData,
  discreteConfig?: EServiceAttributeCertifiedDiscreteConfig
): boolean {
  switch (attributeKey) {
    case 'certified':
      return isAttributeOwned('certified', attributeId, ownershipData.certified, {
        discreteConfig: discreteConfig,
      })
    case 'verified':
      return isAttributeOwned('verified', attributeId, ownershipData.verified, {
        verifierId: ownershipData.producerId,
      })
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
  hasBlockingAttribute = false,
}) => {
  const { open } = useCustomizeThresholdDrawer()
  const { t: tAttribute } = useTranslation('attribute')
  /* PIN-9567 - sort attributes by name */
  const sortedAttributes = React.useMemo(
    () => [...attributes].sort((a, b) => a.name.localeCompare(b.name)),
    [attributes]
  )

  const rawGroupColorAndText = ownershipData
    ? getGroupColorAndText(attributeKey, attributes, ownershipData)
    : undefined

  const shouldHideFulfillmentStatus =
    hasBlockingAttribute && rawGroupColorAndText?.color !== 'error'
  const groupColor = shouldHideFulfillmentStatus ? undefined : rawGroupColorAndText?.color
  const groupText = rawGroupColorAndText?.textKey

  return (
    <AttributeGroupContainer
      title={(() => {
        const text = tAttribute(`${attributeKey}.requirement`, { index: index + 1 })
        const [boldPart, ...rest] = text.split(' | ')
        const normalPart = rest.join(' | ')
        return normalPart ? (
          <>
            {boldPart}
            <span style={{ fontWeight: 400 }}>{` | ${normalPart}`}</span>
          </>
        ) : (
          text
        )
      })()}
      color={groupColor ?? 'gray'}
      subheader={
        <Typography variant="body2" color="text.primary" sx={{ px: 2, pt: 1.5 }}>
          {groupText ? tAttribute(groupText) : tAttribute('group.subtitle')}
        </Typography>
      }
    >
      <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
        {sortedAttributes.map((attribute, _index) => (
          <React.Fragment key={attribute.id}>
            <Box component="li">
              <AttributeContainer
                attribute={attribute}
                checked={
                  ownershipData && !shouldHideFulfillmentStatus
                    ? getAttributeChecked(
                        attributeKey,
                        attribute.id,
                        ownershipData,
                        attribute.discreteConfig
                      )
                    : undefined
                }
                onCustomizeThreshold={withThreshold ? () => open(attribute, index) : undefined}
                hideThreshold={!withThreshold}
              />
            </Box>
            {sortedAttributes.length > 1 && _index < sortedAttributes.length - 1 && (
              <Divider sx={{ py: 1 }}>
                <Typography color="text.primary" fontWeight={700} textTransform={'uppercase'}>
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
