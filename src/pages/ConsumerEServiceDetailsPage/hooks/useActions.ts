import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import type { CatalogEServiceDescriptor } from '@/api/api.generatedTypes'
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
import { match } from 'ts-pattern'
import SendIcon from '@mui/icons-material/Send'
import ArticleIcon from '@mui/icons-material/Article'
import UpdateIcon from '@mui/icons-material/Update'
import noop from 'lodash/noop'

type Consumer = {
  id: string
  name: string
}

type Agreement = {
  id: string
  consumerId: string
  descriptorId: string
}

export const useActions = (): {
  primary: ActionItemButton | undefined
  secondary?: ActionItemButton | undefined
  menu?: ActionItemButton[] | undefined
} => {
  const { t } = useTranslation('eservice')
  const { t: tAgreement } = useTranslation('agreement')
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
    { data: certified, isFetching: isFetchingCertified },
    { data: verified, isFetching: isFetchingVerified },
    { data: declared, isFetching: isFetchingDeclared },
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

  const { data: descriptor, isFetching: isFetchingCurrentDescriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  /*
   * ESERVICE ACTIVE DESCRIPTOR DATA
   * */

  const { data: activeDescriptor, isFetching: isFetchingActiveDescriptor } = useQuery({
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

  /*
   * ESERVICE AGREEMENTS (OWN/ DELEGATED) DATA
   * */

  // The main problem is that the agreements are limited to 50 in this case
  const { data: agreements, isFetching: isFetchingAgreements } = useQuery({
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

  const { data: delegators, isFetching: isFetchingDelegators } = useQuery({
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
  const { data: delegations, isFetching: isFetchingDelegations } = useQuery({
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
    (agreements: Agreement[], consuemrs: Consumer[]) => {
      openDialog({
        type: 'updateAgreement',
      })
    },
    [openDialog]
  )
  const inspect = useCallback(
    (inspectables: Agreement[]) => {
      match(inspectables.length)
        .with(0, () => {})
        .with(1, () => {
          navigate('SUBSCRIBE_AGREEMENT_READ', {
            params: {
              agreementId: inspectables[0].id,
            },
          })
        })
        .otherwise(() => {
          openDialog({
            type: 'inspectAgreement',
          })
        })
    },
    [navigate, openDialog]
  )
  const edit = useCallback(
    (editables: Agreement[]) => {
      match(editables.length)
        .with(0, () => {})
        .with(1, () => {
          navigate('SUBSCRIBE_AGREEMENT_EDIT', {
            params: {
              agreementId: editables[0].id,
            },
          })
        })
        .otherwise(() => {
          openDialog({
            type: 'editAgreement',
          })
        })
    },
    [navigate, openDialog]
  )
  const subscribe = useCallback(
    (consumers: Consumer[], descriptor: CatalogEServiceDescriptor, tenantId: string) => {
      // const create = ({
      //   isOwnEService,
      //   delegationId,
      // }: {
      //   isOwnEService: boolean
      //   delegationId?: string
      // }) => {
      //   /**
      //    * If the subscriber is the owner of the e-service or delegated by the owner,
      //    * create and submit the agreement without passing through the draft
      //    * */
      //   if (isOwnEService) {
      //     submitToOwnEService(
      //       {
      //         eserviceId: descriptor.eservice.id,
      //         descriptorId: descriptor.id,
      //         delegationId: delegationId,
      //       },
      //       {
      //         onSuccess({ id }) {
      //           navigate('SUBSCRIBE_AGREEMENT_READ', { params: { agreementId: id } })
      //         },
      //       }
      //     )
      //     return
      //   }
      //
      //   /**
      //    * If the subscriber is not the owner of the e-service or delegated by the owner
      //    * create the agreement draft
      //    * */
      //   createAgreementDraft(
      //     {
      //       eserviceName: descriptor.eservice.name,
      //       eserviceId: descriptor.eservice.id,
      //       eserviceVersion: descriptor.version,
      //       descriptorId: descriptor.id,
      //       delegationId: delegationId,
      //     },
      //     {
      //       onSuccess({ id }) {
      //         navigate('SUBSCRIBE_AGREEMENT_EDIT', { params: { agreementId: id } })
      //       },
      //     }
      //   )
      // }

      match(consumers.length)
        .with(0, () => {})
        .with(1, () => {
          const consumerId = consumers[0].id

          if (consumerId === tenantId) {
            // create({ isOwnEService: descriptor.eservice.producer.id === tenantId })
          } else {
            openDialog({
              type: 'createAgreement',
            })
          }
        })
        .otherwise(() => {
          openDialog({
            type: 'createAgreement',
          })
        })
    },
    [openDialog, submitToOwnEService, createAgreementDraft, navigate]
  )

  if (
    isFetchingCertified ||
    isFetchingVerified ||
    isFetchingDeclared ||
    isFetchingCurrentDescriptor ||
    isFetchingActiveDescriptor ||
    isFetchingAgreements ||
    isFetchingDelegators ||
    isFetchingDelegations ||
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
  let hasAllVerifiedAttributes = false
  let hasAllDeclaredAttributes = false

  if (activeDescriptor) {
    // Check if the current user organization is the producer of the current eService, in that case it owns all the attributes required by the descriptor
    if (isMine) {
      hasAllCertifiedAttributes = true
      hasAllDeclaredAttributes = true
      hasAllVerifiedAttributes = true
    } else {
      hasAllCertifiedAttributes = hasAllDescriptorAttributes(
        'certified',
        certified.attributes,
        activeDescriptor.attributes.certified
      )

      hasAllVerifiedAttributes = hasAllDescriptorAttributes(
        'verified',
        verified.attributes,
        activeDescriptor.attributes.verified,
        activeDescriptor.eservice.producer.id
      )

      hasAllDeclaredAttributes = hasAllDescriptorAttributes(
        'declared',
        declared.attributes,
        activeDescriptor.attributes.declared
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

  const inspectables: Agreement[] = []
  const editables: Agreement[] = []
  const subscribed: Agreement[] = []
  const upgradables: Agreement[] = []

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
  const consumers: Consumer[] = []

  if (hasAllCertifiedAttributes) {
    consumers.push({
      id: tenantId,
      name: tenant.name,
    })
  }

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
      actions.push({
        action: () => upgrade(upgradables, consumers),
        label: '',
      })
    }

    // INSPECT ACTION
    if (inspectables.length > 0) {
      actions.push({
        action: () => inspect(inspectables),
        label: '',
      })
    }

    // EDIT ACTION
    if (!isDelegator && editables.length > 0) {
      actions.push({
        action: () => edit(editables),
        label: '',
      })
    }

    // SUBSCRIBE ACTION
    if (!isDelegator && subscribed.length < consumers.length) {
      actions.push({
        action: () => subscribe(consumers, descriptor, tenantId),
        label: '',
      })
    }
  }

  if (descriptor.state === 'SUSPENDED') {
    // INSPECT ACTION
    if (inspectables.length > 0) {
      actions.push({
        action: () => inspect(inspectables),
        label: '',
      })
    }
  }

  if (['DEPRECATED', 'ARCHIVING'].includes(descriptor.state)) {
    // UPGRADE ACTION
    const currentDescriptorUpgradables = upgradables.filter(
      (agreement) => agreement.descriptorId === descriptor.id
    )
    if (!isDelegator && currentDescriptorUpgradables.length > 0) {
      actions.push({
        action: () => upgrade(currentDescriptorUpgradables, consumers),
        label: '',
      })
    }

    // INSPECT ACTION
    if (inspectables.length > 0) {
      actions.push({
        action: () => inspect(inspectables),
        label: '',
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
      primary: actions[0],
      secondary: undefined,
    }
  }

  if (actions.length === 2) {
    return {
      primary: actions[0],
      secondary: actions[1],
    }
  }

  return {
    primary: actions[0],
    menu: actions.slice(1),
  }
}
