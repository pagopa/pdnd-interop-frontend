import { AgreementMutations } from '@/api/agreement'
import { useNavigateRouter } from '@/router'
import type { ActionItem } from '@/types/common.types'
import type {
  EServiceCatalog,
  EServiceDescriptorCatalog,
  EServiceState,
} from '@/types/eservice.types'
import { useTranslation } from 'react-i18next'
import { useJwt } from './useJwt'

function useGetEServiceConsumerActions<
  TDescriptor extends { id: string; state: EServiceState; version: string }
>(eservice?: EServiceCatalog | EServiceDescriptorCatalog['eservice'], descriptor?: TDescriptor) {
  const { isAdmin } = useJwt()
  const { navigate } = useNavigateRouter()
  const { t } = useTranslation('eservice')
  const { t: tCommon } = useTranslation('common')

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft()

  const hasValidAgreement =
    eservice?.agreement && !['REJECTED', 'DRAFT'].includes(eservice.agreement.state)
  const isMine = !!eservice?.isMine
  const isSubscribed = !!hasValidAgreement
  const hasAgreementDraft = !!(eservice?.agreement && eservice.agreement.state === 'DRAFT')

  const actions: Array<ActionItem> = []

  let canCreateAgreementDraft = false
  let createAgreementDraftAction: undefined | VoidFunction
  let goToAgreementAction: undefined | VoidFunction

  // I can subscribe to the eservice only if...
  if (eservice) {
    // ... I own all the certified attributes or...
    if (eservice.hasCertifiedAttributes) {
      canCreateAgreementDraft = true
    }

    // ... if it is mine...
    if (isMine) {
      canCreateAgreementDraft = true
    }

    // ... but only if I don't have an valid agreement with it yet...
    if (hasValidAgreement) {
      canCreateAgreementDraft = false
    }

    // ... and the actual viewing descriptor is published or suspended!
    if (descriptor && !['PUBLISHED', 'SUSPENDED'].includes(descriptor?.state)) {
      canCreateAgreementDraft = false
    }

    if ((hasValidAgreement || hasAgreementDraft) && isAdmin) {
      // Possible actions

      // If there is an valid agreement for this e-service add a "Go to Agreement" action
      goToAgreementAction = () => {
        const routeKey = hasAgreementDraft ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

        navigate(routeKey, {
          params: {
            agreementId: eservice.agreement?.id as string,
          },
        })
      }

      actions.push({
        action: goToAgreementAction,
        label: t('tableEServiceCatalog.goToRequestCta'),
      })
    }

    if (canCreateAgreementDraft && isAdmin) {
      createAgreementDraftAction = () => {
        if (!descriptor) return
        createAgreementDraft(
          {
            eserviceName: eservice.name,
            eserviceId: eservice.id,
            eserviceVersion: descriptor.version,
            descriptorId: descriptor.id,
          },
          {
            onSuccess({ id }) {
              navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
            },
          }
        )
      }
      actions.push({
        action: createAgreementDraftAction,
        label: tCommon('actions.subscribe'),
      })
    }
  }

  return {
    actions,
    canCreateAgreementDraft,
    isMine,
    isSubscribed,
    hasAgreementDraft,
    createAgreementDraftAction,
    goToAgreementAction,
  }
}

export default useGetEServiceConsumerActions
