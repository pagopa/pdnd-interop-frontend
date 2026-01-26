import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useConsumerAgreementDetailsContext } from '../ConsumerAgreementDetailsContext'
import { Drawer } from '@/components/shared/Drawer'
import { attributesHelpLink } from '@/config/constants'
import type { DescriptorAttribute } from '@/api/api.generatedTypes'
import { AttributeContainer, AttributeGroupContainer } from '@/components/layout/containers'
import { isAttributeGroupFullfilled, isAttributeOwned } from '@/utils/attribute.utils'
import { Stack, Link } from '@mui/material'

type ConsumerAgreementDetailsCertifiedAttributesDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
}

export const ConsumerAgreementDetailsCertifiedAttributesDrawer: React.FC<
  ConsumerAgreementDetailsCertifiedAttributesDrawerProps
> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'consumerRead.sections.generalInformations.attributesDrawer',
  })
  const { t: tAttribute } = useTranslation('attribute')

  const { agreement, descriptorAttributes } = useConsumerAgreementDetailsContext()

  const certifiedAttributeGroups = descriptorAttributes.certified
  const partyAttributes = agreement.consumer.attributes
  const ownedCertifiedAttributes = partyAttributes.certified

  const handleCloseDrawer = () => {
    onClose()
  }

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
        title: tAttribute(`group.manage.success.consumer`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.error.consumer`),
      color: 'error',
    }
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleCloseDrawer}
      title={t('title')}
      subtitle={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {t('subtitle')}
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
          title={tAttribute(`noAttributesRequiredAlert.consumer`, {
            attributeKey: tAttribute(`type.certified_other`),
          })}
          color="gray"
        />
      )}
    </Drawer>
  )
}
