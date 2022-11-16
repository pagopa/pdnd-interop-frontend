import { AgreementMutations } from '@/api/agreement'
import { AttributeQueries } from '@/api/attribute'
import { EServiceQueries } from '@/api/eservice'
import { useNavigateRouter } from '@/router'
import { ActionItem } from '@/types/common.types'
import { checkEServiceAttributesOwnership } from '@/utils/attribute.utils'
import { useTranslation } from 'react-i18next'
import { useJwt } from './useJwt'

function useGetEServiceConsumerActions(eserviceId: string, descriptorId: string | undefined) {
  const { jwt, isAdmin } = useJwt()
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common')

  const { data: certifiedAttributes = [] } = AttributeQueries.useGetPartyCertifiedList(
    jwt?.organizationId
  )
  const eservice = EServiceQueries.useGetSingleFlat(eserviceId, descriptorId)

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft()

  const hasValidAgreement = eservice?.agreement && !['REJECTED'].includes(eservice?.agreement.state)
  const isMine = eservice?.producerId === jwt?.organizationId
  const isSubscribed = eservice && hasValidAgreement && isAdmin
  const hasDraft =
    eservice && eservice.agreement && eservice?.agreement.state === 'DRAFT' && isAdmin

  const actions: Array<ActionItem> = []
  let canCreateAgreementDraft = false

  // I can subscribe to the eservice only if...
  if (eservice) {
    // ... I am an admin and I own all the certified attributes or...
    if (
      isAdmin &&
      checkEServiceAttributesOwnership(certifiedAttributes, eservice.certifiedAttributes)
    ) {
      canCreateAgreementDraft = true
    }

    // ... if it is mine...
    if (isMine) {
      canCreateAgreementDraft = true
    }

    // ... but only if I don't have an valid agreement with it yet.
    if (hasValidAgreement) {
      canCreateAgreementDraft = false
    }

    // Possible actions

    // If there is an valid agreement for this e-service add a "Go to Agreement" action
    if (isAdmin && hasValidAgreement) {
      const handleGoToAgreementRequest = () => {
        console.log(hasDraft)
        const routeKey = hasDraft ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

        navigate(routeKey, {
          params: {
            agreementId: eservice.agreement?.id as string,
          },
        })
      }

      actions.push({
        action: handleGoToAgreementRequest,
        label: t('tableEServiceCatalog.goToRequestCta'),
      })
    }

    if (canCreateAgreementDraft) {
      const handleCreateAgreementDraft = () => {
        if (!eservice?.descriptorId) return
        createAgreementDraft(
          {
            eserviceName: eservice.name,
            eserviceId: eservice.id,
            eserviceVersion: eservice.version,
            descriptorId: eservice.descriptorId,
          },
          {
            onSuccess({ id }) {
              navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
            },
          }
        )
      }
      actions.push({
        action: handleCreateAgreementDraft,
        label: tCommon('actions.subscribe'),
      })
    }
  }

  return { actions, canCreateAgreementDraft, isMine, isSubscribed, hasDraft }
}

export default useGetEServiceConsumerActions
