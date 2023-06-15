import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../AgreementDetailsContext'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import {
  SectionContainer,
  AttributeGroupContainer,
  AttributeContainer,
} from '@/components/layout/containers'
import { Link, Stack } from '@mui/material'
import { useCurrentRoute } from '@/router'
import type { ProviderOrConsumer } from '@/types/common.types'
import { isAttributeOwned, isAttributeGroupFullfilled } from '@/utils/attribute.utils'
import { attributesHelpLink } from '@/config/constants'

export const AgreementCertifiedAttributesSection: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')
  const { mode } = useCurrentRoute()

  const providerOrConsumer = mode as ProviderOrConsumer

  const { eserviceAttributes, partyAttributes } = useAgreementDetailsContext()

  const certifiedAttributeGroups = eserviceAttributes?.certified ?? []
  const ownedCertifiedAttributes = partyAttributes?.certified ?? []

  function getGroupContainerProps(
    group: RemappedEServiceAttribute
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled(
      'certified',
      ownedCertifiedAttributes,
      group
    )

    const providerOrConsumer = mode as ProviderOrConsumer

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.${providerOrConsumer}`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.error.${providerOrConsumer}`),
      color: 'error',
    }
  }

  return (
    <SectionContainer
      newDesign
      innerSection
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
              {group.attributes.map((attribute) => (
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
          title={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
            attributeKey: tAttribute(`type.certified_other`),
          })}
          color="gray"
        />
      )}
    </SectionContainer>
  )
}
