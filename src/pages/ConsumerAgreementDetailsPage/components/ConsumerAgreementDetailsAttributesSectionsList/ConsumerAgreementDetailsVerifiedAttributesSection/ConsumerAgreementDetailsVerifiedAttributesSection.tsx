import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useConsumerAgreementDetailsContext } from '../../ConsumerAgreementDetailsContext'
import { useDrawerState } from '@/hooks/useDrawerState'
import {
  isAttributeGroupFullfilled,
  isAttributeOwned,
  isAttributeRevoked,
} from '@/utils/attribute.utils'
import type { DescriptorAttribute } from '@/api/api.generatedTypes'
import {
  AttributeContainer,
  AttributeGroupContainer,
  SectionContainer,
} from '@/components/layout/containers'
import { Divider, Link, Stack } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { IconLink } from '@/components/shared/IconLink'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { ConsumerAgreementDetailsDocumentationDrawer } from './ConsumerAgreementDetailsDocumentationDrawer'

export const ConsumerAgreementDetailsVerifiedAttributesSection: React.FC = () => {
  const { t: tAttribute } = useTranslation('attribute')
  const { t } = useTranslation('agreement', {
    keyPrefix: 'consumerRead.sections.attributesSectionsList.verifiedSection',
  })

  const { agreement, descriptorAttributes } = useConsumerAgreementDetailsContext()

  const verifiedAttributeGroups = descriptorAttributes?.verified ?? []
  const partyAttributes = agreement?.consumer.attributes
  const ownedVerifiedAttributes = partyAttributes?.verified ?? []

  const {
    isOpen: isDocumentationDrawerOpen,
    openDrawer: openDocumentationDrawer,
    closeDrawer: closeDocumentationDrawer,
  } = useDrawerState()

  const handleOpenDocumentationDrawer = () => {
    openDocumentationDrawer()
  }

  const getChipLabel = (attributeId: string) => {
    const attribute = ownedVerifiedAttributes.find((a) => a.id === attributeId)
    if (!attribute) return

    if (isAttributeRevoked('verified', attribute, agreement?.producer.id))
      return tAttribute('group.manage.revokedByProducer')

    const verifier = attribute?.verifiedBy.find((b) => b.id === agreement?.producer.id)
    if (verifier && verifier.expirationDate) {
      const expirationDate = new Date(verifier.expirationDate).toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return tAttribute('group.manage.expirationDate', { expirationDate: expirationDate })
    }
  }

  function getGroupContainerProps(
    group: Array<DescriptorAttribute>
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled(
      'verified',
      ownedVerifiedAttributes,
      group,
      agreement?.producer.id
    )

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.consumer`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.warning.verified.consumer`),
      color: 'warning',
    }
  }

  return (
    <>
      <SectionContainer
        newDesign
        title={tAttribute('verified.label')}
        description={
          <Trans
            components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
          >
            {tAttribute(`verified.description`)}
          </Trans>
        }
      >
        <Stack spacing={2}>
          {verifiedAttributeGroups.map((group, i) => (
            <AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
              <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
                {group.map((attribute) => (
                  <AttributeContainer
                    key={attribute.id}
                    attribute={attribute}
                    chipLabel={getChipLabel(attribute.id)}
                    checked={isAttributeOwned(
                      'verified',
                      attribute.id,
                      ownedVerifiedAttributes,
                      agreement?.producer.id
                    )}
                  />
                ))}
              </Stack>
            </AttributeGroupContainer>
          ))}
          {verifiedAttributeGroups.length === 0 && (
            <AttributeGroupContainer
              title={tAttribute(`noAttributesRequiredAlert.consumer`, {
                attributeKey: tAttribute(`type.verified_other`),
              })}
              color="gray"
            />
          )}
          <Divider />
          <IconLink
            onClick={handleOpenDocumentationDrawer}
            component="button"
            startIcon={<AttachFileIcon />}
            alignSelf="start"
          >
            {t('documentationLink.label')}
          </IconLink>
        </Stack>
      </SectionContainer>
      <ConsumerAgreementDetailsDocumentationDrawer
        isOpen={isDocumentationDrawerOpen}
        onClose={closeDocumentationDrawer}
      />
    </>
  )
}
