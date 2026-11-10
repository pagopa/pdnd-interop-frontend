import React, { useCallback } from 'react'
import { EServiceQueries } from '@/api/eservice'
import { useNavigate, useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { Tab } from '@mui/material'
import { useTrackPageViewEvent } from '@/config/tracking'
import { useQueries, useQuery } from '@tanstack/react-query'
import { DelegationQueries } from '@/api/delegation'
import { AuthHooks } from '@/api/auth'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useActiveTab } from '@/hooks/useActiveTab'
import ConsumerEServiceDetailsTab from './components/ConsumerEServiceDetailsTab/ConsumerEServiceDetailsTab'
import ConsumerLinkedPurposeTemplatesTab from './components/ConsumerLinkedPurposeTemplatesTab.tsx/ConsumerLinkedPurposeTemplatesTab'
import { useMarkNotificationsAsRead } from '@/hooks/useMarkNotificationsAsRead'
import { NewPageContainer } from '@/components/layout/containers/NewPageContainer'
import { useDialog } from '@/stores'
import { getViewLatestVersionTargetId, isDescriptorPendingArchiving } from '@/utils/eservice.utils'
import { ConsumerEServiceDetailsAlerts } from './components/ConsumerEServiceDetailsTab/ConsumerEServiceDetailsAlerts'
import SendIcon from '@mui/icons-material/Send'
import ArticleIcon from '@mui/icons-material/Article'
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled'
import UpdateIcon from '@mui/icons-material/Update'
import { AttributeQueries } from '@/api/attribute'
import { AgreementMutations, AgreementQueries } from '@/api/agreement'
import { hasAllDescriptorAttributes } from '@/utils/attribute.utils'
import type {
  Agreement,
  AgreementListEntry,
  CatalogEServiceDescriptor,
} from '@/api/api.generatedTypes'
import { match } from 'ts-pattern'
import noop from 'lodash/noop'
import type { ActionItemButton } from '@/types/common.types'

const ConsumerEServiceDetailsPage: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'read' })
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { jwt, isReviewer } = AuthHooks.useJwt()

  const navigate = useNavigate()

  const { activeTab, updateActiveTab } = useActiveTab('eserviceDetail')
  const { openDialog } = useDialog()

  const { data: descriptor } = useQuery(
    EServiceQueries.getDescriptorCatalog(eserviceId, descriptorId)
  )

  useMarkNotificationsAsRead(`${eserviceId}/${descriptorId}`)

  const { data: delegators } = useQuery({
    ...DelegationQueries.getConsumerDelegators({
      limit: 50,
      offset: 0,
      eserviceIds: [eserviceId],
    }),
    enabled: Boolean(jwt?.organizationId) && !isReviewer,
    select: ({ results }) => results ?? [],
  })

  const viewLatestVersionTargetId = React.useMemo(
    () => getViewLatestVersionTargetId(descriptor?.eservice.descriptors, descriptorId, 'consumer'),
    [descriptor?.eservice.descriptors, descriptorId]
  )

  const { primary, secondary } = useActions()

  useTrackPageViewEvent('INTEROP_CATALOG_READ', {
    eserviceId: descriptor?.eservice.id,
    descriptorId: descriptor?.id,
  })

  const handleViewLatestVersion = () => {
    if (descriptor && viewLatestVersionTargetId) {
      navigate('SUBSCRIBE_CATALOG_VIEW', {
        params: { eserviceId: descriptor?.eservice.id, descriptorId: viewLatestVersionTargetId },
      })
    }
  }

  return (
    <NewPageContainer
      title={descriptor?.eservice.name || ''}
      primaryAction={primary}
      secondaryAction={secondary}
      isLoading={!descriptor}
      backToAction={{
        label: t('actions.backToCatalogLabel'),
        to: 'SUBSCRIBE_CATALOG_LIST',
      }}
      infoSection={
        descriptor
          ? {
              label: t('versionHeaderLabel'),
              shortcut: {
                type: 'button',
                label: descriptor.version,
                onClick: () =>
                  openDialog({
                    type: 'showEserviceVersionsList',
                    eserviceId,
                    eserviceName: descriptor.eservice.name,
                    descriptors: descriptor.eservice.descriptors,
                    activeDescriptor: descriptor.eservice.activeDescriptor,
                    routeKey: 'SUBSCRIBE_CATALOG_VIEW',
                  }),
              },
              actions: viewLatestVersionTargetId
                ? [
                    {
                      action: handleViewLatestVersion,
                      label: t('actions.viewLatestVersion'),
                      icon: ReplayCircleFilledIcon,
                    },
                  ]
                : [],
              statusChip: {
                for: 'descriptor',
                state: descriptor.state,
                isActiveDescriptor: descriptor.id === descriptor.eservice.activeDescriptor?.id,
              },
              archivingScheduleInfo:
                isDescriptorPendingArchiving(descriptor.state) &&
                descriptor.archivingSchedule?.archivableOn &&
                descriptor.archivingSchedule?.scope
                  ? {
                      archivableOn: descriptor.archivingSchedule.archivableOn,
                      scope: descriptor.archivingSchedule.scope,
                    }
                  : undefined,
            }
          : undefined
      }
    >
      <ConsumerEServiceDetailsAlerts descriptor={descriptor} />
      {isReviewer ? (
        <ConsumerEServiceDetailsTab />
      ) : (
        <TabContext value={activeTab}>
          <TabList
            onChange={updateActiveTab}
            aria-label={t('tabs.ariaLabelEserviceDetail')}
            variant="fullWidth"
          >
            <Tab label={t('tabs.eserviceDetail')} value="eserviceDetail" />
            <Tab label={t('tabs.purposeTemplate')} value="linkedPurposeTemplates" />
          </TabList>

          <TabPanel value="eserviceDetail">
            <ConsumerEServiceDetailsTab delegators={delegators} />
          </TabPanel>

          <TabPanel value="linkedPurposeTemplates">
            <ConsumerLinkedPurposeTemplatesTab />
          </TabPanel>
        </TabContext>
      )}
    </NewPageContainer>
  )
}

const useActions = (): {
  primary: ActionItemButton | undefined
  secondary?: ActionItemButton | undefined
} => {
  const { t } = useTranslation('eservice')
  const { t: tAgreement } = useTranslation('agreement')
  const navigate = useNavigate()

  const { openDialog } = useDialog()
  const { eserviceId, descriptorId } = useParams<'SUBSCRIBE_CATALOG_VIEW'>()
  const { jwt, isReviewer, isAdmin } = AuthHooks.useJwt()

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
    (agreement: Agreement, hasMissingAttributes: boolean) => {
      openDialog({
        type: 'upgradeAgreementVersion',
        agreement: agreement,
        hasMissingAttributes: hasMissingAttributes,
      })
    },
    [openDialog]
  )
  const inspect = useCallback(
    (inspectables: AgreementListEntry[], descriptor: CatalogEServiceDescriptor) => {
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
            // Map the inspectables agreements to a simplified object to pass to the dialog
            // TODO: Modify the SelectAgreementConsumerDialog to accept the full agreement object instead of a simplified one
            agreements: inspectables.map((agreement) => ({
              id: agreement.id,
              consumerId: agreement.consumer.id,
              state: agreement.state,
              canBeUpgraded: agreement.canBeUpgraded,
            })),
            action: 'inspect',
          })
        })
    },
    [navigate, openDialog]
  )
  const edit = useCallback(
    (editables: AgreementListEntry[], descriptor: CatalogEServiceDescriptor) => {
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
            // Map the editables agreements to a simplified object to pass to the dialog
            // TODO: Modify the SelectAgreementConsumerDialog to accept the full agreement object instead of a simplified one
            agreements: editables.map((agreement) => ({
              id: agreement.id,
              consumerId: agreement.consumer.id,
              state: agreement.state,
              canBeUpgraded: agreement.canBeUpgraded,
            })),
            action: 'edit',
          })
        })
    },
    [navigate, openDialog]
  )
  const subscribe = useCallback(
    (
      subscribed: AgreementListEntry[],
      consumers: string[],
      descriptor: CatalogEServiceDescriptor,
      tenantId: string
    ) => {
      const availables = consumers.filter(
        (consumer) => !subscribed.some((agreement) => agreement.consumer.id === consumer)
      )

      const create = ({
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

      match(availables.length)
        .with(0, () => {})
        .with(1, () => {
          const consumerId = availables[0]

          if (consumerId === tenantId) {
            create({ isOwnEService: descriptor.eservice.producer.id === tenantId })
          } else {
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
              onSubmitCreate: create,
              action: 'create',
            })
          }
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
            onSubmitCreate: create,
            action: 'create',
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

  const isMine = activeDescriptor?.eservice.producer.id === tenantId
  const isSuspended = activeDescriptor?.state === 'SUSPENDED'
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

  // Check if there are inspectable agreements for the current eService descriptor, in that case the user can inspect them
  const inspectables = agreements.filter(
    (agreement) =>
      agreement.descriptor.id === descriptor.id &&
      ['ACTIVE', 'SUSPENDED', 'PENDING'].includes(agreement.state)
  )

  const editables = agreements.filter(
    (agreement) => agreement.descriptor.id === descriptor.id && agreement.state === 'DRAFT'
  )

  // The subscribed agreements are the agreements that are not rejected or archived for every descriptor of the eService
  const subscribed = agreements.filter(
    (agreement) => agreement.state !== 'REJECTED' && agreement.state !== 'ARCHIVED'
  )

  // The admitted consumers are the delegators and the current user organization
  const consumers = delegators.map((delegator) => delegator.id)
  if (hasAllCertifiedAttributes) {
    consumers.push(tenantId)
  }

  // Agreements that can be upgraded are the agreements that are in the state "ACTIVE" or "SUSPENDED" and have a descriptor version lower than the active descriptor version
  let upgradables: AgreementListEntry[] = []

  // The available consumers are the admitted consumers that are not already subscribed to this  eService
  let availables: string[] = []

  if (
    activeDescriptor &&
    ['PUBLISHED', 'SUSPENDED'].includes(activeDescriptor.state) &&
    !isDelegator
  ) {
    upgradables = agreements.filter(
      (agreement) =>
        agreement.descriptor.id === descriptor.id &&
        ['ACTIVE', 'SUSPENDED'].includes(agreement.state) &&
        parseInt(agreement.descriptor.version) < parseInt(activeDescriptor.version)
    )
    availables = consumers.filter(
      (consumer) => !subscribed.some((agreement) => agreement.consumer.id === consumer)
    )
  }

  /*
   * CASE I: The user can upgrade an agreement existing for the current eService descriptor
   *    ACTIONS:
   *      - primary: UPGRADE
   *      - secondary: INSPECT | SUBSCRIBE
   *   UPGRADE CONDITIONS:
   *    - Exists an agreement(OWNED/DELEGATED) for the current eService descriptor in the state "ACTIVE" or "SUSPENDED"
   *    - The active descriptor of the current eService is in the state "PUBLISHED" or "SUSPENDED" and is version is higher than the agreement descriptor version
   *    - The user is not a delegator of the current eService (delegators can not upgrade agreements)
   * */

  if (upgradables.length > 0) {
    let primary = undefined
    let secondary = undefined

    primary = {
      action: noop,
      label: t('tableEServiceCatalog.upgradeToNewVersion'),
      icon: UpdateIcon,
      variant: 'contained',
      disabled: !hasAllCertifiedAttributes,
      tooltip: !hasAllCertifiedAttributes
        ? tAgreement('consumerRead.noCertifiedAttributesForUpgradeTooltip')
        : undefined,
    }

    // INPECT ACTIION if available
    if (inspectables.length > 0) {
      secondary = {
        action: () => inspect(inspectables, descriptor),
        label: t('tableEServiceCatalog.inspect'),
        icon: ArticleIcon,
        variant: 'outlined',
      }

      return {
        primary,
        secondary,
      }
    }

    // SUBSCRIBE ACTION if available
    if (availables.length > 0) {
      secondary = {
        action: () => subscribe(subscribed, availables, descriptor, tenantId),
        label: t('tableEServiceCatalog.subscribe'),
        icon: SendIcon,
        variant: 'outlined',
        disabled: isSuspended,
        tooltip: isSuspended ? t('tableEServiceCatalog.eserviceSuspendedTooltip') : undefined,
      }
    }
  }

  /*
   * CASE II: The user can inspect an agreement existing for the current e-service descriptor
   * */

  if (inspectables.length > 0) {
    const primary = {
      action: () => inspect(inspectables, descriptor),
      label: t('tableEServiceCatalog.inspect'),
      icon: ArticleIcon,
      variant: 'contained',
    }

    let secondary = undefined

    // SUBSCRIBE ACTION if available
    if (availables.length > 0) {
      secondary = {
        action: () => subscribe(subscribed, availables, descriptor, tenantId),
        label: t('tableEServiceCatalog.subscribe'),
        icon: SendIcon,
        variant: 'outlined',
        disabled: isSuspended,
        tooltip: isSuspended ? t('tableEServiceCatalog.eserviceSuspendedTooltip') : undefined,
      }
    }

    return {
      primary,
      secondary,
    }
  }

  /*
   * CASE III: The user can edit an agreement existing for the current e-service descriptor
   * */

  if (editables.length > 0) {
    const primary = {
      action: () => edit(editables, descriptor),
      label: t('tableEServiceCatalog.editDraft'),
      icon: UpdateIcon,
      variant: 'contained',
    }

    let secondary = undefined

    // SUBSCRIBE ACTION if available
    if (availables.length > 0) {
      secondary = {
        action: () => subscribe(subscribed, availables, descriptor, tenantId),
        label: t('tableEServiceCatalog.subscribe'),
        icon: SendIcon,
        variant: 'outlined',
        disabled: isSuspended,
        tooltip: isSuspended ? t('tableEServiceCatalog.eserviceSuspendedTooltip') : undefined,
      }
    }

    return {
      primary,
      secondary,
    }
  }

  /*
   * CASE IV: The user can subscribe to the current e-service descriptor
   * */

  if (availables.length > 0) {
    if (availables.length === 1) {
      if (availables[0] === tenantId) {
        if (!isMine && !hasAllCertifiedAttributes) {
          return {
            primary: {
              action: noop,
              label: t('tableEServiceCatalog.subscribe'),
              icon: SendIcon,
              variant: 'contained',
              disabled: true,
              tooltip: t('tableEServiceCatalog.missingCertifiedAttributesTooltip'),
            },
            secondary: undefined,
          }
        }

        if (descriptor.id !== activeDescriptor?.id) {
          return {
            primary: {
              action: noop,
              label: t('tableEServiceCatalog.subscribe'),
              icon: SendIcon,
              variant: 'contained',
              disabled: true,
            },
            secondary: undefined,
          }
        }
      }
    }

    return {
      primary: {
        action: () => subscribe(subscribed, availables, descriptor, tenantId),
        label: t('tableEServiceCatalog.subscribe'),
        icon: SendIcon,
        variant: 'contained',
        disabled: isSuspended,
        tooltip: isSuspended ? t('tableEServiceCatalog.eserviceSuspendedTooltip') : undefined,
      },
      secondary: undefined,
    }
  }

  return {
    primary: undefined,
    secondary: undefined,
  }
}

export default ConsumerEServiceDetailsPage
