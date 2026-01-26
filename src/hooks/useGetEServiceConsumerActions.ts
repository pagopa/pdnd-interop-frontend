import { AgreementMutations } from '@/api/agreement'
import type {
  CatalogEServiceDescriptor,
  CompactAgreement,
  DelegationTenant,
} from '@/api/api.generatedTypes'
import { useNavigate } from '@/router'
import type { ActionItemButton } from '@/types/common.types'
import { useTranslation } from 'react-i18next'
import {
  checkIfcanCreateAgreementDraft,
  checkIfhasAlreadyAgreementDraft,
} from '@/utils/agreement.utils'
import { AuthHooks } from '@/api/auth'
import SendIcon from '@mui/icons-material/Send'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ArticleIcon from '@mui/icons-material/Article'
import noop from 'lodash/noop'
import { useDialog } from '@/stores'
import { match } from 'ts-pattern'

function useGetEServiceConsumerActions(
  eservice?: CatalogEServiceDescriptor['eservice'],
  descriptor?: CatalogEServiceDescriptor,
  delegators?: Array<DelegationTenant>,
  isDelegator?: boolean
) {
  const { t } = useTranslation('eservice')
  const { isAdmin } = AuthHooks.useJwt()

  const navigate = useNavigate()

  const { openDialog } = useDialog()

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft()
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()

  const isMine = Boolean(eservice?.isMine)
  const isSubscribed = eservice?.isSubscribed
  const hasAgreementDraft = checkIfhasAlreadyAgreementDraft(eservice)
  const canCreateAgreementDraft = checkIfcanCreateAgreementDraft(eservice, descriptor)
  const isSuspended = descriptor?.state === 'SUSPENDED'

  const hasCertifiedAttributes = descriptor?.eservice.hasCertifiedAttributes

  const actions: Array<ActionItemButton> = []

  if (!eservice || !descriptor || !isAdmin) return { actions: [] satisfies Array<ActionItemButton> }

  const handleInspectAgreementAction = () => {
    match(eservice.agreements.length)
      .with(0, () => {})
      .with(1, () => {
        navigate('SUBSCRIBE_AGREEMENT_READ', {
          params: {
            agreementId: eservice.agreements[0].id,
          },
        })
      })
      .otherwise(() => {
        // TODO handle multiple agreements
      })
  }

  const handleEditAgreementAction = () => {
    match(eservice.agreements.length)
      .with(0, () => {})
      .with(1, () => {
        navigate('SUBSCRIBE_AGREEMENT_EDIT', {
          params: {
            agreementId: eservice.agreements[0].id,
          },
        })
      })
      .otherwise(() => {
        // TODO handle multiple agreements
      })
  }

  const handleCreateAgreementDraft = ({
    isOwnEService,
    delegationId,
  }: {
    isOwnEService: boolean
    delegationId?: string
  }) => {
    /**
     * If the subscriber is the owner of the e-service or delegated by the owner,
     * create and submit the agreement without passing through the draft
     * */
    if (isOwnEService) {
      submitToOwnEService(
        {
          eserviceId: eservice.id,
          descriptorId: descriptor.id,
          delegationId: delegationId,
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
     * If the subscriber is not the owner of the e-service or delegated by the owner
     * create the agreement draft
     * */
    createAgreementDraft(
      {
        eserviceName: eservice.name,
        eserviceId: eservice.id,
        eserviceVersion: descriptor.version,
        descriptorId: descriptor.id,
        delegationId: delegationId,
      },
      {
        onSuccess({ id }) {
          navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
        },
      }
    )
  }

  const handleCreateAgreementDraftAction = () => {
    handleCreateAgreementDraft({ isOwnEService: isMine })
  }

  const handleOpenCreateAgreementDraftDialog = () => {
    openDialog({
      type: 'createAgreementDraft',
      eservice: { id: eservice.id, name: eservice.name, producerId: eservice.producer.id },
      descriptor: {
        id: descriptor.id,
        version: descriptor.version,
      },
      existingAgreements: eservice.agreements as CompactAgreement[],
      onSubmit: handleCreateAgreementDraft,
    })
  }

  if (isSubscribed) {
    actions.push({
      action: handleInspectAgreementAction,
      label: t('tableEServiceCatalog.inspect'),
      icon: ArticleIcon,
    })
  }

  if (hasAgreementDraft && !isDelegator) {
    actions.push({
      action: handleEditAgreementAction,
      label: t('tableEServiceCatalog.editDraft'),
      icon: PendingActionsIcon,
    })
  }

  if (
    (canCreateAgreementDraft && !isDelegator && (delegators?.length === 0 || !delegators)) ||
    (delegators && delegators?.length > 0)
  ) {
    actions.push({
      action:
        delegators && delegators?.length > 0
          ? handleOpenCreateAgreementDraftDialog
          : handleCreateAgreementDraftAction,
      label: t('tableEServiceCatalog.subscribe'),
      icon: SendIcon,
      disabled: isSuspended,
      tooltip: isSuspended ? t('tableEServiceCatalog.eserviceSuspendedTooltip') : undefined,
    })
  }

  const shouldShowhasMissingAttributesTooltip =
    // ...the e-service is not owned by the active party...
    !isMine &&
    // ... the party doesn't own all the certified attributes required...
    !hasCertifiedAttributes &&
    // ... the e-service's latest active descriptor is the actual descriptor the user is viewing...
    eservice.activeDescriptor?.id === descriptor?.id &&
    /// ... and it is not archived.
    descriptor?.state !== 'ARCHIVED' &&
    /// ... and it is not delegator
    !isDelegator

  if (shouldShowhasMissingAttributesTooltip) {
    actions.push({
      action: noop,
      label: t('tableEServiceCatalog.subscribe'),
      icon: SendIcon,
      disabled: true,
      tooltip: t('tableEServiceCatalog.missingCertifiedAttributesTooltip'),
    })
  }

  return { actions }
}

export default useGetEServiceConsumerActions
