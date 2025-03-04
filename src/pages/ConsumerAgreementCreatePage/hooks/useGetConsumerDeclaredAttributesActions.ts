import { isAttributeOwned } from '@/utils/attribute.utils'
import { useTranslation } from 'react-i18next'
import { AttributeMutations } from '@/api/attribute'
import { useConsumerAgreementCreateContentContext } from '../ConsumerAgreementCreateContentContext'
import { AuthHooks } from '@/api/auth'

export const useGetConsumerDeclaredAttributesActions = () => {
  const { t } = useTranslation('agreement', {
    keyPrefix: 'consumerRead.sections.attributesSectionsList.declaredSection.actions',
  })
  const { isAdmin } = AuthHooks.useJwt()
  const { partyAttributes, agreement } = useConsumerAgreementCreateContentContext()

  const isDelegated = Boolean(agreement?.delegation)

  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute(isDelegated)

  return (attributeId: string) => {
    // The user can declare his own attributes only in the agreement create/edit view...
    if (!agreement || !isAdmin) return []
    const isDeclared = isAttributeOwned('declared', attributeId, partyAttributes?.declared ?? [])
    // ... only if it is not alread declared
    if (isDeclared) return []
    // ... and only if the agreement is active, draft or suspended
    if (!['DRAFT'].includes(agreement.state)) return []

    const handleDeclareAttribute = (attributeId: string) => {
      declareAttribute({
        id: attributeId,
        delegationId: agreement.delegation?.id,
        delegatorName: agreement.consumer.name,
      })
    }

    return [
      {
        label: t('declare'),
        action: handleDeclareAttribute,
      },
    ]
  }
}
