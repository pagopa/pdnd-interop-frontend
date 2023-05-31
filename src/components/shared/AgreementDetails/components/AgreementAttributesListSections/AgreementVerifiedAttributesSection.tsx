import React from 'react'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../AgreementDetailsContext'
import { AttributeMutations } from '@/api/attribute'
import {
  SectionContainer,
  AttributeGroupContainer,
  AttributeContainer,
} from '@/components/layout/containers'
import { Stack } from '@mui/material'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import {
  isAttributeOwned,
  isAttributeGroupFullfilled,
  isAttributeRevoked,
} from '@/utils/attribute.utils'
import type { ProviderOrConsumer } from '@/types/common.types'

export const AgreementVerifiedAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { t: tAttribute } = useTranslation('attribute')
  const { mode } = useCurrentRoute()
  const { isAdmin } = useJwt()

  const { agreement, eserviceAttributes, partyAttributes, isAgreementEServiceMine } =
    useAgreementDetailsContext()

  const { mutate: verifyAttribute } = AttributeMutations.useVerifyPartyAttribute()
  const { mutate: revokeAttibute } = AttributeMutations.useRevokeVerifiedPartyAttribute()

  const providerOrConsumer = mode as ProviderOrConsumer

  const verifiedAttributeGroups = eserviceAttributes?.verified ?? []
  const ownedVerifiedAttributes = partyAttributes?.verified ?? []

  const handleVerifyAttribute = (attributeId: string) => {
    if (!agreement?.consumer.id) return
    verifyAttribute({
      partyId: agreement.consumer.id,
      id: attributeId,
      renewal: 'AUTOMATIC_RENEWAL',
    })
  }

  const handleRevokeAttribute = (attributeId: string) => {
    if (!agreement?.consumer.id) return
    revokeAttibute({
      partyId: agreement.consumer.id,
      attributeId,
    })
  }

  const isVerifiedAttributeRevoked = (attributeId: string) => {
    const attribute = ownedVerifiedAttributes.find((a) => a.id === attributeId)
    return attribute && isAttributeRevoked('verified', attribute)
  }

  const getAttributeActions = (attributeId: string) => {
    // The user can certify verified attributes in this view only if it is a provider...
    if (!agreement || mode === 'consumer' || !isAdmin) return []
    // ... only if the e-service does not belong to itself
    if (isAgreementEServiceMine) return []
    // ... and only if the agreement is active, pending or suspended
    if (!['ACTIVE', 'PENDING', 'SUSPENDED'].includes(agreement.state)) return []

    const isOwned = isAttributeOwned('verified', attributeId, ownedVerifiedAttributes)
    const isRevoked = isVerifiedAttributeRevoked(attributeId)

    const attributeActions: React.ComponentProps<typeof AttributeContainer>['actions'] = [
      {
        label: isOwned ? t('verified.actions.update') : t('verified.actions.verify'),
        action: handleVerifyAttribute,
      },
    ]

    if (isOwned && !isRevoked) {
      attributeActions.push({
        label: t('verified.actions.revoke'),
        action: handleRevokeAttribute,
        color: 'error',
      })
    }

    return attributeActions
  }

  const getChipLabel = (attributeId: string) => {
    if (mode === 'consumer' && isVerifiedAttributeRevoked(attributeId))
      return tAttribute('group.manage.revokedByParty')
  }

  function getGroupContainerProps(
    group: RemappedEServiceAttribute
  ): React.ComponentProps<typeof AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled('verified', ownedVerifiedAttributes, group)

    if (isGroupFulfilled) {
      return {
        title: tAttribute(`group.manage.success.${providerOrConsumer}`),
        color: 'success',
      }
    }

    return {
      title: tAttribute(`group.manage.warning.verified.${providerOrConsumer}`),
      color: 'warning',
    }
  }

  return (
    <SectionContainer
      newDesign
      innerSection
      title={tAttribute('verified.label')}
      description={tAttribute('verified.description')}
    >
      <Stack spacing={2}>
        {verifiedAttributeGroups.map((group, i) => (
          <AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute) => (
                <AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  chipLabel={getChipLabel(attribute.id)}
                  checked={isAttributeOwned('verified', attribute.id, ownedVerifiedAttributes)}
                  actions={getAttributeActions(attribute.id)}
                />
              ))}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>
      {verifiedAttributeGroups.length === 0 && (
        <AttributeGroupContainer
          title={tAttribute(`noAttributesRequiredAlert.${providerOrConsumer}`, {
            attributeKey: tAttribute(`type.verified_other`),
          })}
          color="gray"
        />
      )}
    </SectionContainer>
  )
}
