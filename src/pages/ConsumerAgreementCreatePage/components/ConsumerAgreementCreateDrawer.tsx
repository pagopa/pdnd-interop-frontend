import { AttributeContainer, AttributeGroupContainer } from '@/components/layout/containers'
import { useAgreementDetailsContext } from '@/components/shared/AgreementDetails/AgreementDetailsContext'
import { Drawer } from '@/components/shared/Drawer'
import { attributesHelpLink } from '@/config/constants'
import type { RemappedDescriptorAttribute } from '@/types/attribute.types'
import { isAttributeGroupFullfilled, isAttributeOwned } from '@/utils/attribute.utils'
import { Alert, Link, Stack, Typography } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

type ConsumerAgreementCreateDrawerProps = {
  isOpen: boolean
  onClose: VoidFunction
}

export const ConsumerAgreementCreateDrawer: React.FC<ConsumerAgreementCreateDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { t: tAttribute } = useTranslation('attribute')
  const { t: tAgreement } = useTranslation('agreement')

  const { descriptorAttributes, partyAttributes, agreement } = useAgreementDetailsContext()

  const certifiedAttributeGroups = descriptorAttributes?.certified ?? []
  const ownedCertifiedAttributes = partyAttributes?.certified ?? []

  function getGroupContainerProps(
    group: RemappedDescriptorAttribute
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
      onClose={onClose}
      title={tAgreement('drawers.certifiedAttributes.title')}
      subtitle={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tAgreement('drawers.certifiedAttributes.description')}
        </Trans>
      }
    >
      <Stack spacing={2}>
        {agreement?.state === 'MISSING_CERTIFIED_ATTRIBUTES' && (
          <Alert severity="info" color="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {tAgreement('drawers.certifiedAttributes.missingCertifiedAttributesAlert')}
            </Typography>
          </Alert>
        )}
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
          title={tAttribute(`noAttributesRequiredAlert.consumer`, {
            attributeKey: tAttribute(`type.certified_other`),
          })}
          color="gray"
        />
      )}
    </Drawer>
  )
}
