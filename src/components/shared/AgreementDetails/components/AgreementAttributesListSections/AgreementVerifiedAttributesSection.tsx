import React from 'react'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../AgreementDetailsContext'
import { AttributeMutations } from '@/api/attribute'
import {
  SectionContainer,
  _AttributeGroupContainer,
  _AttributeContainer,
} from '@/components/layout/containers'
import { Stack } from '@mui/material'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import { isAttributeOwned, isAttributeGroupFullfilled } from '@/utils/attribute.utils'

export const AgreementVerifiedAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'verified' })
  const { mode } = useCurrentRoute()
  const { isAdmin } = useJwt()

  const { agreement, eserviceAttributes, partyAttributes, isAgreementEServiceMine } =
    useAgreementDetailsContext()

  const { mutate: verifyAttribute } = AttributeMutations.useVerifyPartyAttribute()
  const { mutate: revokeAttibute } = AttributeMutations.useRevokeVerifiedPartyAttribute()

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

  const getAttributeActions = (attributeId: string) => {
    // The user can certify verified attributes in this view only if it is a provider...
    if (mode === 'consumer' || !isAdmin) return []
    // ... And only if the e-service does not belong to itself
    if (isAgreementEServiceMine) return []
    const isOwned = isAttributeOwned('verified', attributeId, ownedVerifiedAttributes)

    const attributeActions = [
      {
        label: isOwned ? t('verified.actions.update') : t('verified.actions.verify'),
        action: handleVerifyAttribute,
      },
      {
        label: t('verified.actions.revoke'),
        action: handleRevokeAttribute,
        color: 'error' as const,
      },
    ]

    return attributeActions
  }

  function getGroupContainerProps(
    group: RemappedEServiceAttribute
  ): React.ComponentProps<typeof _AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled('verified', ownedVerifiedAttributes, group)

    if (mode === 'provider') {
      const state = isGroupFulfilled ? 'fullfilled' : 'unfullfilled'
      return {
        title: t(`states.provider.${state}`),
        color: isGroupFulfilled ? 'success' : 'error',
      }
    }

    const state = isGroupFulfilled ? 'fullfilled' : 'waiting-for-verification'
    return {
      title: t(`states.consumer.${state}`),
      color: isGroupFulfilled ? 'success' : 'warning',
    }
  }

  return (
    <SectionContainer
      newDesign
      innerSection
      title={tAttribute('label')}
      description={tAttribute('description')}
    >
      <Stack spacing={2}>
        {verifiedAttributeGroups.map((group, i) => (
          <_AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute) => (
                <_AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  checked={isAttributeOwned('verified', attribute.id, ownedVerifiedAttributes)}
                  actions={getAttributeActions(attribute.id)}
                />
              ))}
            </Stack>
          </_AttributeGroupContainer>
        ))}
      </Stack>
      {verifiedAttributeGroups.length === 0 && (
        <_AttributeGroupContainer title={t('verified.emptyLabel')} color="gray" />
      )}
    </SectionContainer>
  )
}
