import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useConsumerAgreementDetailsContext } from '../ConsumerAgreementDetailsContext'
import type { DescriptorAttribute } from '@/api/api.generatedTypes'
import {
  AttributeContainer,
  AttributeGroupContainer,
  SectionContainer,
} from '@/components/layout/containers'
import { isAttributeGroupFullfilled, isAttributeOwned } from '@/utils/attribute.utils'
import { Link, Stack } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'

export const ConsumerAgreementDetailsCertifiedAttributesSection: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')

  const { agreement, descriptorAttributes } = useConsumerAgreementDetailsContext()

  const certifiedAttributeGroups = descriptorAttributes?.certified ?? []
  const partyAttributes = agreement?.consumer.attributes
  const ownedCertifiedAttributes = partyAttributes?.certified ?? []

  function getGroupContainerProps(
    group: Array<DescriptorAttribute>
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled(
      'certified',
      ownedCertifiedAttributes,
      group
    )

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.provider`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.error.provider`),
      color: 'error',
    }
  }

  return (
    <SectionContainer
      newDesign
      title={tAttribute('certified.label')}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tAttribute(`certified.description`)}
        </Trans>
      }
    >
      <Stack spacing={2}>
        {certifiedAttributeGroups.map((group, i) => (
          <AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.map((attribute) => (
                <AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  checked={isAttributeOwned('certified', attribute.id, ownedCertifiedAttributes)}
                />
              ))}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>
      {certifiedAttributeGroups.length === 0 && (
        <AttributeGroupContainer
          title={tAttribute(`noAttributesRequiredAlert.provider`, {
            attributeKey: tAttribute(`type.certified_other`),
          })}
          color="gray"
        />
      )}
    </SectionContainer>
  )
}
