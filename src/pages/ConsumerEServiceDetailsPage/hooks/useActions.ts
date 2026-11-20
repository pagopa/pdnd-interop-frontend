import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import { AttributeQueries } from '@/api/attribute'
import { AuthHooks } from '@/api/auth'
import { DelegationQueries } from '@/api/delegation'
import { EServiceQueries } from '@/api/eservice'
import { useNavigate, useParams } from '@/router'
import { useDialog } from '@/stores'
import type { ActionItem, ActionItemButton } from '@/types/common.types'
import { hasAllDescriptorAttributes } from '@/utils/attribute.utils'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import SendIcon from '@mui/icons-material/Send'
import FeedIcon from '@mui/icons-material/Feed'
import UpdateIcon from '@mui/icons-material/Update'
import PendingActionsIcon from '@mui/icons-material/PendingActions'

export type EServiceConsumer = {
  id: string
  name: string
}

export type EServiceAgreement = {
  id: string
  consumerId: string
  descriptorId: string
}

export const useActions = (): {
  primary: ActionItemButton | undefined
  secondary?: ActionItemButton | undefined
  menu?: ActionItemButton[] | undefined
} => {
  const { t } = useTranslation('eservice', { keyPrefix: 'consumer.detail.actions.agreements' })
  const navigate = useNavigate()

  const { openDialog } = useDialog()
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { jwt, isReviewer, isAdmin } = AuthHooks.useJwt()

  const tenant = jwt?.organization
  const tenantId = jwt?.organizationId

  /*
   * TENANT ATTRIBUTES DATA: Attributes that the current user organization owns
   * */

  const [
    { data: certified, isLoading: isLoadingCertified },
    { data: verified, isLoading: isLoadingVerified },
    { data: declared, isLoading: isLoadingDeclared },
  ] = useQueries({
    queries: [
      AttributeQueries.getPartyCertifiedList(tenantId),
      AttributeQueries.getPartyVerifiedList(tenantId),
      AttributeQueries.getPartyDeclaredList(tenantId),
    ],
  })

  /*
   * ESERVICE DESCRIPTOR DATA
   * */

  const { data: descriptor, isLoading: isLoadingCurrentDescriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  /*
   * ESERVICE ACTIVE DESCRIPTOR DATA
   * */

  const { data: activeDescriptor, isLoading: isLoadingActiveDescriptor } = useQuery({
    ...EServiceQueries.getDescriptorCatalog(
      eserviceId,
      descriptor?.eservice.activeDescriptor?.id as string
    ),
    enabled: !!descriptor?.eservice.activeDescriptor?.id,
  })

  /*
   * MUTATIONS
   * */

  const isAsyncExchange = descriptor?.eservice.asyncExchange ?? false

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft(true, isAsyncExchange)
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()
  const { mutate: upgradeAgreement } = AgreementMutations.useUpgrade()

  /*
   * ESERVICE AGREEMENTS (OWN/ DELEGATED) DATA
   * */

  // The main problem is that the agreements are limited to 50 in this case
  const { data: agreements, isLoading: isLoadingAgreements } = useQuery({
    ...AgreementQueries.getConsumerAgreementsList({
      limit: 50,
      offset: 0,
      states: [],
      eservicesIds: [eserviceId],
    }),
    enabled: Boolean(jwt?.organizationId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  /*
   * DELEGATORS DATA: Delegators that have delegated to the current user organization for the current eService
   * */

  const { data: delegators, isLoading: isLoadingDelegators } = useQuery({
    ...DelegationQueries.getConsumerDelegators({
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
    }),
    enabled: Boolean(jwt?.organizationId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  /*
   * DELEGATIONS DATA: Delegations that the current user organization has given to other organizations for the current eService
   * */
  const { data: delegations, isLoading: isLoadingDelegations } = useQuery({
    ...DelegationQueries.getList({
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
      kind: 'DELEGATED_CONSUMER',
      states: ['ACTIVE'],
      delegatorIds: [jwt?.organizationId as string],
    }),
    enabled: Boolean(jwt?.organizationId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  const upgrade = useCallback(
    (agreements: EServiceAgreement[], consumers: EServiceConsumer[]) => {
      if (
        consumers.length === 1 &&
        agreements.length === 1 &&
        agreements[0].consumerId === tenantId
      ) {
        // UPDATE DIRECTLY IF THERE IS ONLY ONE POSSIBLE CONSUMER
        // This case implies that the agreements length is 1 and the only agreement is for the current user organization,
        // so the user can update directly without passing through the dialog
        // NOTE: The first condition will imply that the others are true, they are just for clarity and to avoid mistakes in the future if the code is modified
        const agreement = agreements[0]

        upgradeAgreement(
          { agreementId: agreement.id },
          {
            onSuccess(data) {
              /**
               * When the subscriber is missing one or more verified/declared attributes,
               * the new agreement is created as a DRAFT instead of being submitted to
               * the provider. When this happens, the subscriber should be presented with
               * the "draft edit" view of the agreement.
               */
              const agreementView =
                data.state === 'DRAFT' ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'

              navigate(agreementView, {
                params: {
                  agreementId: data.id,
                },
              })
            },
          }
        )
        return
      }

      const subscribers: Record<string, true> = {}

      agreements.forEach((agreement) => {
        subscribers[agreement.consumerId] = true
      })

      openDialog({
        type: 'updateAgreement',
        agreements,
        consumers: consumers.filter((consumer) => subscribers[consumer.id]),
      })
    },
    [tenantId, navigate, openDialog, upgradeAgreement]
  )
  const inspect = useCallback(
    (agreements: EServiceAgreement[], consumers: EServiceConsumer[]) => {
      if (
        consumers.length === 1 &&
        agreements.length === 1 &&
        agreements[0].consumerId === tenantId
      ) {
        // INSPECT DIRECTLY IF THERE IS ONLY ONE POSSIBLE CONSUMER
        // This case implies that the agreements length is 1 and the only agreement is for the current user organization,
        // so the user can inspect directly without passing through the dialog
        // NOTE: The first condition will imply that the others are true, they are just for clarity and to avoid mistakes in the future if the code is modified
        navigate('SUBSCRIBE_AGREEMENT_READ', {
          params: {
            agreementId: agreements[0].id,
          },
        })
        return
      }

      const subscribers: Record<string, true> = {}

      agreements.forEach((agreement) => {
        subscribers[agreement.consumerId] = true
      })

      openDialog({
        type: 'inspectAgreement',
        agreements,
        consumers: consumers.filter((consumer) => subscribers[consumer.id]),
      })
    },
    [tenantId, navigate, openDialog]
  )
  const edit = useCallback(
    (agreements: EServiceAgreement[], consumers: EServiceConsumer[]) => {
      if (
        consumers.length === 1 &&
        agreements.length === 1 &&
        agreements[0].consumerId === tenantId
      ) {
        // EDIT DIRECTLY IF THERE IS ONLY ONE POSSIBLE CONSUMER
        // This case implies that the agreements length is 1 and the only agreement is for the current user organization,
        // so the user can edit directly without passing through the dialog
        // NOTE: The first condition will imply that the others are true, they are just for clarity and to avoid mistakes in the future if the code is modified

        navigate('SUBSCRIBE_AGREEMENT_EDIT', {
          params: {
            agreementId: agreements[0].id,
          },
        })
        return
      }

      const subscribers: Record<string, true> = {}

      agreements.forEach((agreement) => {
        subscribers[agreement.consumerId] = true
      })

      openDialog({
        type: 'editAgreement',
        agreements,
        consumers: consumers.filter((consumer) => subscribers[consumer.id]),
      })
    },
    [tenantId, navigate, openDialog]
  )
  const subscribe = useCallback(
    (agreements: EServiceAgreement[], consumers: EServiceConsumer[]) => {
      if (!descriptor) return

      if (consumers.length === 1 && consumers[0].id === tenantId) {
        // EDIT DIRECTLY IF THERE IS ONLY ONE POSSIBLE CONSUMER
        // This case implies that the consumers length is 1 and the only consumer is the current user organization

        if (descriptor.eservice.producer.id === tenantId) {
          // If the subscriber is the owner of the e-service, create and submit the agreement without passing through the draft
          submitToOwnEService(
            {
              eserviceId: descriptor.eservice.id,
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

        createAgreementDraft(
          {
            eserviceName: descriptor.eservice.name,
            eserviceId: descriptor.eservice.id,
            eserviceVersion: descriptor.version,
            descriptorId: descriptor.id,
          },
          {
            onSuccess({ id }) {
              navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
            },
          }
        )
        return
      }

      const subscribers: Record<string, true> = {}

      agreements.forEach((agreement) => {
        subscribers[agreement.consumerId] = true
      })

      openDialog({
        type: 'createAgreement',
        consumers: consumers.filter((consumer) => !subscribers[consumer.id]),
      })
    },
    [descriptor, tenantId, openDialog, submitToOwnEService, createAgreementDraft, navigate]
  )

  if (
    isLoadingCertified ||
    isLoadingVerified ||
    isLoadingDeclared ||
    isLoadingCurrentDescriptor ||
    isLoadingActiveDescriptor ||
    isLoadingAgreements ||
    isLoadingDelegators ||
    isLoadingDelegations ||
    !tenant ||
    !tenantId ||
    !certified ||
    !verified ||
    !declared ||
    !descriptor ||
    !agreements ||
    !delegators ||
    !delegations ||
    !isAdmin
  ) {
    return {
      primary: undefined,
      secondary: undefined,
    }
  }

  // Every checks is done on the active descriptor, because the user can only subscribe to the active descriptor of an eService

  const isMine = descriptor.eservice.producer.id === tenantId
  const isDelegator = delegations.length > 0
  /*
   * ATTRIBUTES OWNERSHIP DATA: Check if the current user organization owns all the attributes required by the active eService descriptor
   * */

  let hasAllCertifiedAttributes = false

  if (activeDescriptor) {
    // Check if the current user organization is the producer of the current eService, in that case it owns all the attributes required by the descriptor
    if (isMine) {
      hasAllCertifiedAttributes = true
    } else {
      hasAllCertifiedAttributes = hasAllDescriptorAttributes(
        'certified',
        certified.attributes,
        activeDescriptor.attributes.certified
      )
    }
  }

  /*
   * ACTIONS:
   *
   *   - INSPECT: Action to inspect existing inspectable (ACTIVE/SUSPENDED/PENDING) agreements for the current e-service descriptor
   *   - EDIT: Action to edit existing editable (DRAFT) agreements for the current e-service descriptor,
   *     this action is available only if the current e-service descriptor is the active one (PUBLISHED)
   *     and the user is not a delegator of the current e-service (delegators can not edit agreements)
   *   - UPDATE: Action to update existing update (ACTIVE/SUSPENDED) agreements for the e-service,
   *     this action is available only if the active descriptor of the current e-service is in the state "PUBLISHED",
   *     the upgradable agreements are picked from the agreements of the whole e-service, not only the agreements of the current descriptor,
   *     the user in not a delegator of the current e-service (delegators can not update agreements),
   *     the active descriptor version is higher than the agreement descriptor version
   *   - SUBSCRIBE: Action to subscribe to the current e-service descriptor, this action is available only if
   *     there are consumers without an existing agreement for the current e-service,
   *     the user is not a delegator of the current e-service (delegators can not subscribe to agreements),
   *     the current e-service is the active one (PUBLISHED)
   *
   *     NOTE: If the user is not delegated by any other organization he can operate without passing via dialog for consumer selection,
   *     if the consumer selected is the owner of the e-service NO check on ATTRIBUTES is required and the agreement draft is created and submitted directly,
   *     if the consumer selected is not the owner of the e-service, the user must have all the attributes required by the active descriptor to create the agreement draft,
   *     if the user is not delegated by any other organization and the consumer selected is not the owner of the e-service and the user does not have all the attributes required by the active descriptor,
   *     the user can not operate any action different from the INSPECT and an alert is shown to the user to inform him that he can not operate
   * */

  const inspectables: EServiceAgreement[] = []
  const editables: EServiceAgreement[] = []
  const subscribed: EServiceAgreement[] = []
  const upgradables: EServiceAgreement[] = []

  agreements.forEach((agreement) => {
    if (agreement.descriptor.id === descriptor.id) {
      // INSPECTABLES
      if (['ACTIVE', 'SUSPENDED', 'PENDING'].includes(agreement.state)) {
        inspectables.push({
          id: agreement.id,
          consumerId: agreement.consumer.id,
          descriptorId: agreement.descriptor.id,
        })
      }

      // EDITABLES
      if (agreement.state === 'DRAFT') {
        editables.push({
          id: agreement.id,
          consumerId: agreement.consumer.id,
          descriptorId: agreement.descriptor.id,
        })
      }
    }

    if (!['REJECTED', 'ARCHIVED'].includes(agreement.state)) {
      subscribed.push({
        id: agreement.id,
        consumerId: agreement.consumer.id,
        descriptorId: agreement.descriptor.id,
      })
    }

    if (
      activeDescriptor &&
      activeDescriptor.state === 'PUBLISHED' &&
      ['ACTIVE', 'SUSPENDED'].includes(agreement.state) &&
      parseInt(activeDescriptor.version, 10) > parseInt(agreement.descriptor.version, 10)
    ) {
      // Agreement upgradable if the consumer is not the current user organization
      if (agreement.consumer.id !== tenantId) {
        upgradables.push({
          id: agreement.id,
          consumerId: agreement.consumer.id,
          descriptorId: agreement.descriptor.id,
        })
        // If the consumer is the current user organization, the agreement is upgradable only if the user has all the attributes required by the active descriptor or the user is the owner of the e-service
      } else if (hasAllCertifiedAttributes || isMine) {
        upgradables.push({
          id: agreement.id,
          consumerId: agreement.consumer.id,
          descriptorId: agreement.descriptor.id,
        })
      }
    }
  })

  // The possible consumers are the delegators and the current user organization
  const consumers: EServiceConsumer[] = []

  consumers.push({
    id: tenantId,
    name: tenant.name,
  })

  delegators.forEach((delegator) => {
    consumers.push({
      id: delegator.id,
      name: delegator.name,
    })
  })

  const actions: ActionItem[] = []

  /*
   * CASE I: Current DESCRIPTOR is the active one (PUBLISHED)
   * In this case the user can perform the following actions based on some conditions: INSPECT, EDIT, UPGRADE, SUBSCRIBE
   * */

  if (descriptor.state === 'PUBLISHED') {
    // The user is on the active descriptor view of the e-service
    // UPGRADE ACTION
    if (!isDelegator && upgradables.length > 0) {
      if (consumers.length > 1 || (consumers.length === 1 && hasAllCertifiedAttributes)) {
        // The action is available consumers are more than one or the only consumer is the current user organization and he has all the attributes required by the active descriptor
        actions.push({
          action: () => upgrade(upgradables, consumers),
          label: t('update'),
          icon: UpdateIcon,
        })
      }
    }

    // INSPECT ACTION
    if (inspectables.length > 0) {
      actions.push({
        action: () => inspect(inspectables, consumers),
        label: t('inspect'),
        icon: FeedIcon,
      })
    }

    // EDIT ACTION
    if (!isDelegator && editables.length > 0) {
      actions.push({
        action: () => edit(editables, consumers),
        label: t('edit'),
        icon: PendingActionsIcon,
      })
    }

    // SUBSCRIBE ACTION
    if (!isDelegator && subscribed.length < consumers.length) {
      if (consumers.length > 1 || (consumers.length === 1 && hasAllCertifiedAttributes)) {
        // The action is available consumers are more than one or the only consumer is the current user organization and he has all the attributes required by the active descriptor
        actions.push({
          action: () => subscribe(subscribed, consumers),
          label: t('subscribe'),
          icon: SendIcon,
        })
      }
    }
  }

  /*
   * CASE II: Current DESCRIPTOR is SUSPENDED
   * */

  if (['SUSPENDED', 'ARCHIVING_SUSPENDED'].includes(descriptor.state)) {
    // INSPECT ACTION
    if (inspectables.length > 0) {
      actions.push({
        action: () => inspect(inspectables, consumers),
        label: t('inspect'),
        icon: FeedIcon,
      })
    }
  }

  /*
   * CASE III: Current DESCRIPTOR is not the active one (DEPRECATED/ARCHIVING)
   * In this case the user can perform the following actions based on some conditions: INSPECT, UPGRADE
   * He cannot perform actions that create new agreements (SUBSCRIBE) or edit existing ones (EDIT) because the descriptor is not the active one
   * */

  if (['DEPRECATED', 'ARCHIVING'].includes(descriptor.state)) {
    // UPGRADE ACTION
    const currentDescriptorUpgradables = upgradables.filter(
      (agreement) => agreement.descriptorId === descriptor.id
    )
    if (!isDelegator && currentDescriptorUpgradables.length > 0) {
      if (consumers.length > 1 || (consumers.length === 1 && hasAllCertifiedAttributes)) {
        // The action is available consumers are more than one or the only consumer is the current user organization and he has all the attributes required by the active descriptor
        actions.push({
          action: () => upgrade(currentDescriptorUpgradables, consumers),
          label: t('update'),
          icon: UpdateIcon,
        })
      }
    }

    // INSPECT ACTION
    if (inspectables.length > 0) {
      actions.push({
        action: () => inspect(inspectables, consumers),
        label: t('inspect'),
        icon: FeedIcon,
      })
    }
  }

  // This is the logic to determine the primary, scondary and menu actions based on the number of available actions

  if (actions.length === 0) {
    return {
      primary: undefined,
      secondary: undefined,
    }
  }

  if (actions.length === 1) {
    return {
      primary: {
        ...actions[0],
        variant: 'contained',
      },
      secondary: undefined,
    }
  }

  if (actions.length === 2) {
    return {
      primary: {
        ...actions[0],
        variant: 'contained',
      },
      secondary: {
        ...actions[1],
        variant: 'outlined',
      },
    }
  }

  return {
    primary: {
      ...actions[0],
      variant: 'contained',
    },
    menu: actions.slice(1),
  }
}
