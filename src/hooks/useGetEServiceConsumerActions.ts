import { AgreementMutations } from '@/api/agreement'
import type {
  AgreementState,
  CatalogEServiceDescriptor,
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
  descriptor?: CatalogEServiceDescriptor,
  delegators?: Array<DelegationTenant>,
  isDelegator?: boolean
) {
  const { t } = useTranslation('eservice')
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const navigate = useNavigate()

  const { openDialog } = useDialog()

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft()
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()

  const actions: Array<ActionItemButton> = []

  if (!descriptor || !isAdmin) return { actions: [] satisfies Array<ActionItemButton> }

  const isMine = Boolean(descriptor.eservice.isMine)
  const isSubscribed = descriptor.eservice.isSubscribed
  const hasAgreementDraft = checkIfhasAlreadyAgreementDraft(descriptor.eservice)
  const canCreateAgreementDraft = checkIfcanCreateAgreementDraft(jwt?.organizationId, descriptor)
  const isSuspended = descriptor?.state === 'SUSPENDED'

  const hasCertifiedAttributes = descriptor.eservice.hasCertifiedAttributes

  const inspectableAgreementsStates: AgreementState[] = ['ACTIVE', 'SUSPENDED', 'PENDING']
  const inspectableAgreements = descriptor.eservice.agreements.filter((agreement) =>
    inspectableAgreementsStates.includes(agreement.state)
  )

  const handleInspectAgreementAction = () => {
    match(inspectableAgreements.length)
      .with(0, () => {})
      .with(1, () => {
        navigate('SUBSCRIBE_AGREEMENT_READ', {
          params: {
            agreementId: inspectableAgreements[0].id,
          },
        })
      })
      .otherwise(() => {
        openDialog({
          type: 'selectAgreementConsumer',
          eservice: {
            id: descriptor.eservice.id,
            name: descriptor.eservice.name,
            producerId: descriptor.eservice.producer.id,
          },
          descriptor: {
            id: descriptor.id,
            version: descriptor.version,
          },
          agreements: descriptor.eservice.agreements,
          action: 'inspect',
        })
      })
  }

  const editableAgreements = descriptor.eservice.agreements.filter(
    (agreement) => agreement.state === 'DRAFT'
  )

  const handleEditAgreementAction = () => {
    match(editableAgreements.length)
      .with(0, () => {})
      .with(1, () => {
        navigate('SUBSCRIBE_AGREEMENT_EDIT', {
          params: {
            agreementId: editableAgreements[0].id,
          },
        })
      })
      .otherwise(() => {
        openDialog({
          type: 'selectAgreementConsumer',
          eservice: {
            id: descriptor.eservice.id,
            name: descriptor.eservice.name,
            producerId: descriptor.eservice.producer.id,
          },
          descriptor: {
            id: descriptor.id,
            version: descriptor.version,
          },
          agreements: descriptor.eservice.agreements,
          action: 'edit',
        })
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
          eserviceId: descriptor.eservice.id,
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
        eserviceName: descriptor.eservice.name,
        eserviceId: descriptor.eservice.id,
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
      type: 'selectAgreementConsumer',
      eservice: {
        id: descriptor.eservice.id,
        name: descriptor.eservice.name,
        producerId: descriptor.eservice.producer.id,
      },
      descriptor: {
        id: descriptor.id,
        version: descriptor.version,
      },
      agreements: descriptor.eservice.agreements,
      action: 'create',
      onSubmitCreate: handleCreateAgreementDraft,
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

  const existingAgreements = descriptor.eservice.agreements.filter(
    (agreement) => agreement.state !== 'ARCHIVED' && agreement.state !== 'REJECTED'
  )

  const tenants: DelegationTenant[] = jwt
    ? [{ id: jwt.organizationId as string, name: jwt.organization.name }, ...(delegators ?? [])]
    : delegators ?? []

  const tenantsWithoutAgreement = tenants.filter(
    (tenant) => !existingAgreements.some((agreement) => agreement.consumerId === tenant.id)
  )

  if (
    // If there are more than one tenant without an agreement...
    tenantsWithoutAgreement.length > 1 ||
    // ...or there is exactly one tenant without an agreement and it is not the active party...
    (tenantsWithoutAgreement.length === 1 &&
      tenantsWithoutAgreement[0].id !== jwt?.organizationId) ||
    // ...or there is exactly one tenant without an agreement, it is the active party, the user is not a delegator for this eservice and can create the agreement draft
    (tenantsWithoutAgreement.length === 1 &&
      tenantsWithoutAgreement[0].id === jwt?.organizationId &&
      !isDelegator &&
      canCreateAgreementDraft)
  ) {
    actions.push({
      action:
        tenantsWithoutAgreement.length === 1 &&
        tenantsWithoutAgreement[0].id === jwt?.organizationId
          ? handleCreateAgreementDraftAction
          : handleOpenCreateAgreementDraftDialog,
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
    descriptor.eservice.activeDescriptor?.id === descriptor?.id &&
    /// ... and it is not archived.
    descriptor?.state !== 'ARCHIVED' &&
    /// ... and it is not delegator
    !isDelegator &&
    // ... and is not subscribed yet
    !isSubscribed &&
    // ... there are no delegators that can subscribe
    !(delegators && delegators.length > 0) &&
    // ... and there is no agreement draft yet
    !hasAgreementDraft

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
