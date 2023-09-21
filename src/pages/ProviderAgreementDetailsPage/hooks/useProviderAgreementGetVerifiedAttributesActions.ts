import { isAttributeOwned } from '@/utils/attribute.utils'
import { useTranslation } from 'react-i18next'
import type { AttributeContainer } from '@/components/layout/containers'
import { AuthHooks } from '@/api/auth'
import { useProviderAgreementDetailsContext } from '../components/ProviderAgreementDetailsContext'

/**
 * Returns the actions for the verified attributes section inside the agreement details.
 * @returns A function that returns an array of actions for the given attribute.
 */
export const useProviderAgreementGetVerifiedAttributesActions = (
  openAgreementVerifiedAttributeDrawer: (
    attributeId: string,
    type: 'verify' | 'update' | 'revoke'
  ) => void
) => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'providerRead.sections.attributesSectionsList.verifiedSection.attributes.actions',
  })
  const { isAdmin } = AuthHooks.useJwt()
  const { agreement } = useProviderAgreementDetailsContext()

  const isAgreementEServiceMine = agreement?.consumer.id === agreement?.producer.id
  const partyAttributes = agreement?.consumer.attributes
  const ownedVerifiedAttributes = partyAttributes?.verified ?? []

  return (attributeId: string) => {
    // The user can certify verified attributes in this view only if it is a provider...
    if (!agreement || !isAdmin) return []
    // ... only if the e-service does not belong to itself
    if (isAgreementEServiceMine) return []
    // ... and only if the agreement is active, pending or suspended
    if (!['ACTIVE', 'PENDING', 'SUSPENDED'].includes(agreement.state)) return []

    const isOwned = isAttributeOwned(
      'verified',
      attributeId,
      ownedVerifiedAttributes,
      agreement.producer.id
    )

    const handleVerifyAttribute = (attributeId: string) => {
      openAgreementVerifiedAttributeDrawer(attributeId, isOwned ? 'update' : 'verify')
    }

    const handleRevokeAttribute = (attributeId: string) => {
      openAgreementVerifiedAttributeDrawer(attributeId, 'revoke')
    }

    const attributeActions: React.ComponentProps<typeof AttributeContainer>['actions'] = [
      {
        label: isOwned ? t('update') : t('verify'),
        action: handleVerifyAttribute,
      },
    ]

    if (isOwned) {
      attributeActions.push({
        label: t('revoke'),
        action: handleRevokeAttribute,
        color: 'error',
      })
    }

    return attributeActions
  }
}
