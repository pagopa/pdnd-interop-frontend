import { isAttributeOwned } from '@/utils/attribute.utils'
import { useTranslation } from 'react-i18next'
import { useJwt } from '@/hooks/useJwt'
import { AttributeMutations } from '@/api/attribute'
import { useConsumerAgreementCreateContentContext } from '../ConsumerAgreementCreateContentContext'

export const useGetConsumerDeclaredAttributesActions = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { isAdmin } = useJwt()
  const { partyAttributes, agreement } = useConsumerAgreementCreateContentContext()

  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute()

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
