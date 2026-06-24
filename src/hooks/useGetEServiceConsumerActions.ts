import { AgreementMutations } from '@/api/agreement'
import type {
  Agreement,
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
import { isDescriptorPendingArchiving } from '@/utils/eservice.utils'
import { AuthHooks } from '@/api/auth'
import SendIcon from '@mui/icons-material/Send'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import ArticleIcon from '@mui/icons-material/Article'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled'
import UpdateIcon from '@mui/icons-material/Update'
import noop from 'lodash/noop'
import { useDialog } from '@/stores'
import { match } from 'ts-pattern'

export type RequesterEserviceAgreement = {
  blocksSubscribe: boolean
  upgrade?: {
    agreement: Agreement
    hasMissingAttributes: boolean
    hasAllCertifiedAttributes: boolean
  }
}

function useGetEServiceConsumerActions(
  descriptor?: CatalogEServiceDescriptor,
  delegators?: Array<DelegationTenant>,
  isDelegator?: boolean,
  viewLatestVersionTargetId?: string,
  requesterEserviceAgreement?: RequesterEserviceAgreement
): {
  primaryAction: ActionItemButton | undefined
  secondaryAction: ActionItemButton | undefined
  menuActions: Array<ActionItemButton>
  headerInfoActions: Array<ActionItemButton>
} {
  const { t } = useTranslation('eservice')
  const { t: tEserviceActions } = useTranslation('eservice', { keyPrefix: 'read.actions' })
  const { t: tAgreement } = useTranslation('agreement')
  const { jwt, isAdmin } = AuthHooks.useJwt()

  const navigate = useNavigate()

  const { openDialog } = useDialog()

  const isAsyncExchange = descriptor?.eservice.asyncExchange === true

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft(true, isAsyncExchange)
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()

  const emptyResult = {
    primaryAction: undefined,
    secondaryAction: undefined,
    menuActions: [],
    headerInfoActions: [],
  }

  if (!descriptor || !isAdmin) return emptyResult

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

  const inspectAction: ActionItemButton | undefined = isSubscribed
    ? {
        action: handleInspectAgreementAction,
        label: t('tableEServiceCatalog.inspect'),
        icon: ArticleIcon,
        variant: 'contained',
      }
    : undefined

  const editDraftAction: ActionItemButton | undefined =
    hasAgreementDraft && !isDelegator
      ? {
          action: handleEditAgreementAction,
          label: t('tableEServiceCatalog.editDraft'),
          icon: PendingActionsIcon,
          variant: 'contained',
        }
      : undefined

  const existingAgreements = descriptor.eservice.agreements.filter(
    (agreement) => agreement.state !== 'ARCHIVED' && agreement.state !== 'REJECTED'
  )

  const tenants: DelegationTenant[] = jwt
    ? [{ id: jwt.organizationId as string, name: jwt.organization.name }, ...(delegators ?? [])]
    : (delegators ?? [])

  const tenantsWithoutAgreement = tenants.filter(
    (tenant) =>
      !existingAgreements.some((agreement) => agreement.consumerId === tenant.id) &&
      !(requesterEserviceAgreement?.blocksSubscribe && tenant.id === jwt?.organizationId)
  )

  const canShowSubscribe =
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

  const subscribeAction: ActionItemButton | undefined = canShowSubscribe
    ? {
        action:
          tenantsWithoutAgreement.length === 1 &&
          tenantsWithoutAgreement[0].id === jwt?.organizationId
            ? handleCreateAgreementDraftAction
            : handleOpenCreateAgreementDraftDialog,
        label: t('tableEServiceCatalog.subscribe'),
        icon: SendIcon,
        variant: 'contained',
        disabled: isSuspended,
        tooltip: isSuspended ? t('tableEServiceCatalog.eserviceSuspendedTooltip') : undefined,
      }
    : undefined

  const upgradeAgreement = requesterEserviceAgreement?.upgrade
  const upgradeAction: ActionItemButton | undefined = upgradeAgreement
    ? {
        action: () =>
          openDialog({
            type: 'upgradeAgreementVersion',
            agreement: upgradeAgreement.agreement,
            hasMissingAttributes: upgradeAgreement.hasMissingAttributes,
          }),
        label: t('tableEServiceCatalog.upgradeToNewVersion'),
        icon: UpdateIcon,
        variant: 'contained',
        disabled: !upgradeAgreement.hasAllCertifiedAttributes,
        tooltip: !upgradeAgreement.hasAllCertifiedAttributes
          ? tAgreement('consumerRead.noCertifiedAttributesForUpgradeTooltip')
          : undefined,
      }
    : undefined

  const shouldShowhasMissingAttributesTooltip =
    // ...the e-service is not owned by the active party...
    !isMine &&
    // ... the requester has no blocking agreement for this e-service...
    !requesterEserviceAgreement?.blocksSubscribe &&
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

  const subscribeDisabledMissingAttributesAction: ActionItemButton | undefined =
    shouldShowhasMissingAttributesTooltip
      ? {
          action: noop,
          label: t('tableEServiceCatalog.subscribe'),
          icon: SendIcon,
          variant: 'contained',
          disabled: true,
          tooltip: t('tableEServiceCatalog.missingCertifiedAttributesTooltip'),
        }
      : undefined

  const shouldShowDisabledArchivingSubscribe =
    isDescriptorPendingArchiving(descriptor.state) &&
    Boolean(viewLatestVersionTargetId) &&
    !isMine &&
    !isSubscribed &&
    !hasAgreementDraft &&
    !isDelegator &&
    !(delegators && delegators.length > 0)

  const subscribeDisabledArchivingAction: ActionItemButton | undefined =
    shouldShowDisabledArchivingSubscribe
      ? {
          action: noop,
          label: t('tableEServiceCatalog.subscribe'),
          icon: SendIcon,
          variant: 'contained',
          disabled: true,
        }
      : undefined

  const handleViewLatestVersion = () => {
    if (viewLatestVersionTargetId) {
      navigate('SUBSCRIBE_CATALOG_VIEW', {
        params: { eserviceId: descriptor.eservice.id, descriptorId: viewLatestVersionTargetId },
      })
    }
  }

  const viewLatestVersionAction: ActionItemButton | undefined = viewLatestVersionTargetId
    ? {
        action: handleViewLatestVersion,
        label: tEserviceActions('viewLatestVersion'),
        icon: ReplayCircleFilledIcon,
      }
    : undefined

  const primaryAction: ActionItemButton | undefined =
    upgradeAction ??
    inspectAction ??
    editDraftAction ??
    subscribeAction ??
    subscribeDisabledMissingAttributesAction ??
    subscribeDisabledArchivingAction

  const hasPrimaryAgreementAction = Boolean(inspectAction ?? editDraftAction ?? upgradeAction)
  const secondaryAction: ActionItemButton | undefined =
    upgradeAction && inspectAction
      ? { ...inspectAction, variant: 'outlined' }
      : hasPrimaryAgreementAction && subscribeAction
        ? { ...subscribeAction, variant: 'outlined' }
        : undefined

  return {
    primaryAction,
    secondaryAction,
    menuActions: [],
    headerInfoActions: viewLatestVersionAction ? [viewLatestVersionAction] : [],
  }
}

export default useGetEServiceConsumerActions
