import { isAttributeOwned } from '@/utils/attribute.utils'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'
import { useTranslation } from 'react-i18next'
import { useCurrentRoute } from '@/router'
import { AttributeMutations } from '@/api/attribute'
import { AuthHooks } from '@/api/auth'

/**
 * Returns the actions for the declared attributes section inside the agreement details.
 * @returns A function that returns an array of actions for the given attribute.
 */
export const useAgreementGetDeclaredAttributesActions = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { routeKey } = useCurrentRoute()
  const { isAdmin } = AuthHooks.useJwt()
  const { partyAttributes, isAgreementEServiceMine, agreement } = useAgreementDetailsContext()

  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute()

  return (attributeId: string) => {
    // The user can declare his own attributes only in the agreement create/edit view...
    if (!agreement || routeKey !== 'SUBSCRIBE_AGREEMENT_EDIT' || !isAdmin) return []
    if (isAgreementEServiceMine) return []
    const isDeclared = isAttributeOwned('declared', attributeId, partyAttributes?.declared ?? [])
    // ... only if it is not alread declared
    if (isDeclared) return []
    // ... and only if the agreement is active, draft or suspended
    if (!['ACTIVE', 'DRAFT', 'SUSPENDED'].includes(agreement.state)) return []

    const handleDeclareAttribute = (attributeId: string) => {
      declareAttribute({
        id: attributeId,
      })
    }

    return [
      {
        label: t('declared.actions.declare'),
        action: handleDeclareAttribute,
      },
    ]
  }
}
