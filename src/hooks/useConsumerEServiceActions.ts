import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import { AuthHooks } from '@/api/auth'
import { DelegationQueries } from '@/api/delegation'
import { EServiceQueries } from '@/api/eservice'
import { AttributeQueries } from '@/api/attribute'
import { useNavigate, useParams } from '@/router'
import { useDialog } from '@/stores'
import { useQuery, useQueries } from '@tanstack/react-query'
import { hasAllDescriptorAttributes } from '@/utils/attribute.utils'
import { match } from 'ts-pattern'
import type { DelegationTenant } from '@/api/api.generatedTypes'

type ConsumerActionsName = 'SUBSCRIBE' | 'UPGRADE' | 'EDIT' | 'INSPECT'

export const useConsumerEServiceActions = () => {
  const { openDialog } = useDialog()
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const navigate = useNavigate()

  const { jwt, isReviewer } = AuthHooks.useJwt()

  const tenantId = jwt?.organizationId

  /*
   * TENANT ATTRIBUTES DATA: Attributes that the current user organization owns
   * */

  const [{ data: certified }, { data: verified }, { data: declared }] = useQueries({
    queries: [
      AttributeQueries.getPartyCertifiedList(tenantId),
      AttributeQueries.getPartyVerifiedList(tenantId),
      AttributeQueries.getPartyDeclaredList(tenantId),
    ],
  })

  /*
   * ESERVICE DESCRIPTOR DATA
   * */

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  /*
   * ESERVICE SUBSCRIPTION DATA: Check if the current user organization has an agreement with the current eService
   * */
  const isSubscribed = descriptor?.eservice.isSubscribed

  const isAsyncExchange = descriptor?.eservice.asyncExchange ?? false

  /*
   * MUTATIONS
   * */

  const { mutate: createAgreementDraft } = AgreementMutations.useCreateDraft(true, isAsyncExchange)
  const { mutate: submitToOwnEService } = AgreementMutations.useSubmitToOwnEService()

  /*
   * AGREEMENTS DATA: Agreements that the current user organization has with the current eService
  *
  "DRAFT",
  "ACTIVE",
  "ARCHIVED",
  "PENDING",
  "SUSPENDED",
  "MISSING_CERTIFIED_ATTRIBUTES",
  "REJECTED",
   * */

  // TODO: check if this query get only the current user organization agreements or all the agreements for the current eService

  const { data: agreements } = useQuery({
    ...AgreementQueries.getConsumerAgreementsList({
      limit: 50,
      offset: 0,
      states: [],
      eservicesIds: [eserviceId],
    }),
    enabled: Boolean(jwt?.organizationId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  // Check if there is an agreement in ACTIVE or SUSPENDED state to upgrade to a new version of the descriptor
  const agreementId = agreements?.find(
    (agreement) =>
      agreement.canBeUpgraded && (agreement.state === 'ACTIVE' || agreement.state === 'SUSPENDED')
  )?.id

  const { data: agreement } = useQuery({
    ...AgreementQueries.getSingle(agreementId as string),
    enabled: Boolean(agreementId),
  })

  /*
   * DELEGATORS DATA: Delegators that have delegated to the current user organization for the current eService
   * */

  const { data: delegators } = useQuery({
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
  const { data: delegations = [] } = useQuery({
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

  /*
   * ATTRIBUTES OWNERSHIP DATA: Check if the current user organization owns all the attributes required by the current eService descriptor
   * */

  let hasAllCertifiedAttributes = false
  let hasAllVerifiedAttributes = false
  let hasAllDeclaredAttributes = false

  if (descriptor && certified && verified && declared) {
    // Check if the current user organization is the producer of the current eService descriptor, in that case it owns all the attributes required by the descriptor
    if (descriptor.eservice.isMine) {
      hasAllCertifiedAttributes = true
      hasAllDeclaredAttributes = true
      hasAllVerifiedAttributes = true
    } else {
      hasAllCertifiedAttributes = hasAllDescriptorAttributes(
        'certified',
        certified.attributes,
        descriptor.attributes.certified
      )

      hasAllVerifiedAttributes = hasAllDescriptorAttributes(
        'verified',
        verified.attributes,
        descriptor.attributes.verified,
        descriptor.eservice.producer.id
      )

      hasAllDeclaredAttributes = hasAllDescriptorAttributes(
        'declared',
        declared.attributes,
        descriptor.attributes.declared
      )
    }
  }

  /*
   * ACTIONS DATA: Actions that the current user organization can perform on the current eService
   * */

  const actions: Record<ConsumerActionsName, VoidFunction | undefined> = {
    SUBSCRIBE: undefined,
    UPGRADE: undefined,
    EDIT: undefined,
    INSPECT: undefined,
  }

  /*
   * UPGRADE ACTION: If the current user organization has an agreement in ACTIVE or SUSPENDED state that can be upgraded
   * */

  if (agreement) {
    const upgrade = () =>
      openDialog({
        type: 'upgradeAgreementVersion',
        agreement,
        hasMissingAttributes: !hasAllDeclaredAttributes || !hasAllVerifiedAttributes,
      })

    actions.UPGRADE = upgrade
  }

  /*
   * INSPECT ACTION
   * */

  if (isSubscribed) {
    const inspect = () => {
      const inspectableAgreements = descriptor?.eservice.agreements.filter(
        (agreement) =>
          agreement.state === 'ACTIVE' ||
          agreement.state === 'SUSPENDED' ||
          agreement.state === 'PENDING'
      )

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

    actions.INSPECT = inspect
  }

  /*
   * EDIT ACTION
   * */

  // Check if the current user organization is a delegator for the current eService
  const isDelegator = delegations.length > 0
  const editable = descriptor?.eservice.agreements.filter(
    (agreement) => agreement.state === 'DRAFT'
  )

  if (descriptor && !isDelegator && editable && editable.length) {
    const edit = () => {
      match(editable.length)
        .with(0, () => {})
        .with(1, () => {
          navigate('SUBSCRIBE_AGREEMENT_EDIT', {
            params: {
              agreementId: editable[0].id,
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

    actions.EDIT = edit
  }

  /*
   * SUBSCRIBE ACTION
   * */

  const blocking = agreements?.filter(
    (agreement) => agreement.state !== 'ARCHIVED' && agreement.state !== 'REJECTED'
  )

  // Init tenants with delegators that have delegated to the current user organization for the current eService.
  const tenants: DelegationTenant[] = delegators ?? []

  // Add the current user to the tenants list
  // The check is required because the jwt is typed as optional, but it should always be present when the user is logged in.
  if (jwt) {
    tenants.push({
      id: jwt.organizationId,
      name: jwt.organization.name,
    })
  }

  // Filter the tenants list for those who have not an agreement from the "blocking" list for the current eService
  const eligibles: DelegationTenant[] = []

  tenants.forEach((tenant) => {
    const hasBlockingAgreement = blocking?.some((agreement) => agreement.consumer.id === tenant.id)

    if (!hasBlockingAgreement) eligibles.push(tenant)
  })

  // If the blocking list has been fetched, and there are eligible tenants, then the subscribe action can be performed
  if (blocking && eligibles.length > 0) {
    // Function to create the agreement draft or submit the agreement directly if the subscriber is the owner of the e-service or delegated by the owner
    let create: ({ delegationId }: { delegationId?: string }) => void = () => {}

    if (descriptor) {
      create = ({ delegationId }: { delegationId?: string }) => {
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
    }

    if (descriptor && descriptor.eservice.isMine) {
      create = () => {
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
      }
    }

    let subscribe: VoidFunction | undefined

    if (
      eligibles.length > 1 ||
      (eligibles.length === 1 && eligibles[0].id !== jwt?.organizationId)
    ) {
      subscribe = () => {
        if (!descriptor) return
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
          onSubmitCreate: create,
        })
      }
    }

    if (
      eligibles.length === 1 &&
      eligibles[0].id === jwt?.organizationId &&
      (descriptor?.eservice.hasCertifiedAttributes || descriptor?.eservice.isMine) &&
      !descriptor?.eservice.isSubscribed &&
      ['PUBLISHED', 'SUSPENDED'].includes(descriptor?.state)
    ) {
      if (
        !blocking?.some(
          (agreement) =>
            agreement.state === 'DRAFT' && agreement.consumer.id === jwt?.organizationId
        )
      ) {
        subscribe = () => {
          create({})
        }
      }
    }

    actions.SUBSCRIBE = subscribe
  }

  return actions
}
