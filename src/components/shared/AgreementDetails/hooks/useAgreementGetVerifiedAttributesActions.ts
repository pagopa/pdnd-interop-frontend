import { isAttributeOwned, isAttributeRevoked } from '@/utils/attribute.utils'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'
import { useTranslation } from 'react-i18next'
import { useCurrentRoute } from '@/router'
import { useJwt } from '@/hooks/useJwt'
import { AttributeMutations } from '@/api/attribute'
import type { AttributeContainer } from '@/components/layout/containers'

/**
 * Returns the actions for the verified attributes section inside the agreement details.
 * @returns A function that returns an array of actions for the given attribute.
 */
export const useAgreementGetVerifiedAttributesActions = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { mode } = useCurrentRoute()
  const { isAdmin } = useJwt()
  const { partyAttributes, isAgreementEServiceMine, agreement } = useAgreementDetailsContext()

  const { mutate: verifyAttribute } = AttributeMutations.useVerifyPartyAttribute()
  const { mutate: revokeAttibute } = AttributeMutations.useRevokeVerifiedPartyAttribute()

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

  return (attributeId: string) => {
    // The user can certify verified attributes in this view only if it is a provider...
    if (!agreement || mode === 'consumer' || !isAdmin) return []
    // ... only if the e-service does not belong to itself
    if (isAgreementEServiceMine) return []
    // ... and only if the agreement is active, pending or suspended
    if (!['ACTIVE', 'PENDING', 'SUSPENDED'].includes(agreement.state)) return []

    const attribute = ownedVerifiedAttributes.find((a) => a.id === attributeId)

    const isOwned = isAttributeOwned('verified', attributeId, ownedVerifiedAttributes)
    const isRevoked = attribute && isAttributeRevoked('verified', attribute)

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
}
