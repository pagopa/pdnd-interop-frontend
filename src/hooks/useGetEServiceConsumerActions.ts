import { AgreementMutations } from '@/api/agreement'
import type {
  CatalogEService,
  CatalogEServiceDescriptor,
  EServiceDescriptorState,
} from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import type { ActionItem } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import { useJwt } from './useJwt'
import {
  checkIfAlreadySubscribed,
  checkIfcanCreateAgreementDraft,
  checkIfhasAlreadyAgreementDraft,
} from '@/utils/agreement.utils'

function useGetEServiceConsumerActions(
  eservice?: CatalogEService | CatalogEServiceDescriptor['eservice'],
  descriptor?: { id: string; state: EServiceDescriptorState; version: string }
) {
  const { isAdmin } = useJwt()
  const navigate = useNavigate()
  const { t } = useTranslation('eservice')

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft()
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()

  const isMine = Boolean(eservice?.isMine)
  const isSubscribed = checkIfAlreadySubscribed(eservice)
  const hasAgreementDraft = checkIfhasAlreadyAgreementDraft(eservice)
  const canCreateAgreementDraft = checkIfcanCreateAgreementDraft(eservice, descriptor?.state)

  const actions: Array<ActionItem> = []

  let createAgreementDraftAction: undefined | VoidFunction
  let goToAgreementAction: undefined | VoidFunction

  if (!eservice || !descriptor) {
    return { actions: [] }
  }

  if (isAdmin && (isSubscribed || hasAgreementDraft)) {
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
      /**
       * If the subscriber is the owner of the e-service
       * create and submit the agreement without passing through the draft
       * */
      if (isMine) {
        submitToOwnEService(
          {
            eserviceId: eservice.id,
            descriptorId: descriptor.id,
          },
          {
            onSuccess({ id }) {
              navigate('SUBSCRIBE_AGREEMENT_READ', { params: { agreementId: id } })
            },
          }
        )
        return
      }
      /**
       * If the subscriber is not the owner of the e-service
       * create the agreement draft
       * */
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
      label: t('tableEServiceCatalog.subscribe'),
    })
  }

  return {
    actions,
    createAgreementDraftAction,
    goToAgreementAction,
  }
}

export default useGetEServiceConsumerActions
