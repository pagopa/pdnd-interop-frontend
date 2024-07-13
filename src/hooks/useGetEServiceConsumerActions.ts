import { AgreementMutations } from '@/api/agreement'
import type {
  CatalogEService,
  CatalogEServiceDescriptor,
  EServiceDescriptorState,
} from '@/api/api.generatedTypes'
import { useNavigate } from '@tanstack/react-router'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import {
  checkIfAlreadySubscribed,
  checkIfcanCreateAgreementDraft,
  checkIfhasAlreadyAgreementDraft,
} from '@/utils/agreement.utils'
import SendIcon from '@mui/icons-material/Send'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ArticleIcon from '@mui/icons-material/Article'
import noop from 'lodash/noop'
import { useAuthenticatedUser } from './useAuthenticatedUser'

function useGetEServiceConsumerActions(
  eservice?: CatalogEService | CatalogEServiceDescriptor['eservice'],
  descriptor?: { id: string; state: EServiceDescriptorState; version: string }
) {
  const { t } = useTranslation('eservice')
  const { isAdmin } = useAuthenticatedUser()

  const navigate = useNavigate()

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft()
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()

  const isMine = Boolean(eservice?.isMine)
  const isSubscribed = checkIfAlreadySubscribed(eservice)
  const hasAgreementDraft = checkIfhasAlreadyAgreementDraft(eservice)
  const canCreateAgreementDraft = checkIfcanCreateAgreementDraft(eservice, descriptor?.state)
  const isSuspended = descriptor?.state === 'SUSPENDED'

  const actions: Array<ActionItemButton> = []

  if (!eservice || !descriptor || !isAdmin) return { actions: [] satisfies Array<ActionItemButton> }

  const handleInspectAgreementAction = () => {
    if (!eservice.agreement) return
    navigate({
      to: '/fruizione/richieste/$agreementId',
      params: { agreementId: eservice.agreement.id },
    })
  }

  const handleEditAgreementAction = () => {
    if (!eservice.agreement) return
    navigate({
      to: '/fruizione/richieste/$agreementId/modifica',
      params: { agreementId: eservice.agreement.id },
    })
  }

  const handleCreateAgreementDraftAction = () => {
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
            navigate({
              to: '/fruizione/richieste/$agreementId',
              params: { agreementId: id },
            })
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
          navigate({
            to: '/fruizione/richieste/$agreementId/modifica',
            params: { agreementId: id },
          })
        },
      }
    )
  }

  if (isSubscribed) {
    return {
      actions: [
        {
          action: handleInspectAgreementAction,
          label: t('tableEServiceCatalog.inspect'),
          icon: ArticleIcon,
        },
      ],
    }
  }

  if (hasAgreementDraft) {
    return {
      actions: [
        {
          action: handleEditAgreementAction,
          label: t('tableEServiceCatalog.editDraft'),
          icon: PendingActionsIcon,
        },
      ],
    }
  }

  if (canCreateAgreementDraft) {
    return {
      actions: [
        {
          action: handleCreateAgreementDraftAction,
          label: t('tableEServiceCatalog.subscribe'),
          icon: SendIcon,
          disabled: isSuspended,
          tooltip: isSuspended ? t('tableEServiceCatalog.eserviceSuspendedTooltip') : undefined,
        },
      ],
    }
  }

  const shouldShowhasMissingAttributesTooltip =
    // ...the e-service is not owned by the active party...
    !isMine &&
    // ... the party doesn't own all the certified attributes required...
    !eservice.hasCertifiedAttributes &&
    // ... the e-service's latest active descriptor is the actual descriptor the user is viewing...
    eservice.activeDescriptor?.id === descriptor?.id &&
    /// ... and it is not archived.
    descriptor?.state !== 'ARCHIVED'

  if (shouldShowhasMissingAttributesTooltip) {
    return {
      actions: [
        {
          action: noop,
          label: t('tableEServiceCatalog.subscribe'),
          icon: SendIcon,
          disabled: true,
          tooltip: t('tableEServiceCatalog.missingCertifiedAttributesTooltip'),
        },
      ],
    }
  }

  return { actions }
}

export default useGetEServiceConsumerActions
