import React from 'react'
import { useTranslation } from 'react-i18next'
import { useConsumerAgreementDetailsContext } from '../ConsumerAgreementDetailsContext'
import { Drawer } from '@/components/shared/Drawer'
import type { DescriptorAttribute } from '@/api/api.generatedTypes'
import { AttributeContainer, AttributeGroupContainer } from '@/components/layout/containers'
import { isAttributeGroupFullfilled, isAttributeOwned } from '@/utils/attribute.utils'
import { Stack } from '@mui/material'

type ConsumerAgreementDetailsCertifiedAttributesDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
}

export const ConsumerAgreementDetailsCertifiedAttributesDrawer: React.FC<
  ConsumerAgreementDetailsCertifiedAttributesDrawerProps
> = ({ isOpen, onClose }) => {
  // const { t } = useTranslation('agreement', {
  //   keyPrefix: 'providerRead.sections.generalInformations.attributesDrawer',
  // }) TODO stringhe
  const { t: tAttribute } = useTranslation('attribute')

  const { agreement, descriptorAttributes } = useConsumerAgreementDetailsContext()

  if (!agreement) return null

  const certifiedAttributeGroups = descriptorAttributes?.certified ?? []
  const partyAttributes = agreement?.consumer.attributes
  const ownedCertifiedAttributes = partyAttributes?.certified ?? []

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
      title={'TODO title'}
      subtitle={'TODO subtitle'}
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
