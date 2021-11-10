import React, { useContext } from 'react'
import { AGREEMENT_STATUS_LABEL, ROUTES } from '../lib/constants'
import { PartyContext } from '../lib/context'
import { AgreementStatus, AgreementSummary, ProviderOrSubscriber, ActionProps } from '../../types'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useMode } from '../hooks/useMode'
import { TempFilters } from '../components/TempFilters'
import { mergeActions } from '../lib/eservice-utils'
import { getAgreementStatus } from '../lib/status-utils'
import { useFeedback } from '../hooks/useFeedback'
import { StyledLink } from '../components/Shared/StyledLink'
import { Box } from '@mui/system'
import { StyledTableRow } from '../components/Shared/StyledTableRow'

export function AgreementList() {
  const { runAction, forceRerenderCounter, wrapActionInDialog } = useFeedback()
  const mode = useMode()
  const { party } = useContext(PartyContext)

  const params =
    mode === 'provider' ? { producerId: party?.partyId } : { consumerId: party?.partyId }
  const { data, loadingText, error } = useAsyncFetch<AgreementSummary[]>(
    {
      path: { endpoint: 'AGREEMENT_GET_LIST' },
      config: { params },
    },
    {
      defaultValue: [],
      useEffectDeps: [forceRerenderCounter],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando gli accordi',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapActivate = (agreementId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_ACTIVATE',
          endpointParams: { agreementId, partyId: party!.partyId },
        },
      },
      { suppressToast: false }
    )
  }

  const wrapSuspend = (agreementId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_SUSPEND',
          endpointParams: { agreementId, partyId: party!.partyId },
        },
      },
      { suppressToast: false }
    )
  }

  const wrapUpgrade = (agreementId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } },
      },
      { suppressToast: false }
    )
  }
  /*
   * End list of actions
   */

  type AgreementActions = { [key in AgreementStatus]: ActionProps[] }
  // Build list of available actions for each service in its current state
  const getAvailableActions = (agreement: AgreementSummary) => {
    const sharedActions: AgreementActions = {
      active: [
        {
          onClick: wrapActionInDialog(wrapSuspend(agreement.id), 'AGREEMENT_SUSPEND'),
          label: 'Sospendi',
        },
      ],
      suspended: [
        {
          onClick: wrapActionInDialog(wrapActivate(agreement.id), 'AGREEMENT_ACTIVATE'),
          label: 'Riattiva',
        },
      ],
      pending: [],
      inactive: [],
    }

    const subscriberOnlyActionsActive: ActionProps[] = []
    if (agreement.eservice.activeDescriptor) {
      subscriberOnlyActionsActive.push({
        onClick: wrapActionInDialog(wrapUpgrade(agreement.id), 'AGREEMENT_UPGRADE'),
        label: 'Aggiorna',
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      active: subscriberOnlyActionsActive,
      suspended: [],
      pending: [],
      inactive: [],
    }

    const providerOnlyActions: AgreementActions = {
      active: [],
      suspended: [],
      pending: [
        {
          onClick: wrapActionInDialog(wrapActivate(agreement.id), 'AGREEMENT_ACTIVATE'),
          label: 'Attiva',
        },
      ],
      inactive: [],
    }

    const currentActions: AgreementActions = {
      provider: providerOnlyActions,
      subscriber: subscriberOnlyActions,
    }[mode!]

    const status = getAgreementStatus(agreement, mode)

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

  const headData = [
    'nome e-service',
    'versione e-service',
    'stato accordo',
    mode === 'provider' ? 'ente fruitore' : 'ente erogatore',
    '',
  ]

  const INTRO: { [key in ProviderOrSubscriber]: { title: string; description?: string } } = {
    provider: {
      title: 'Gli accordi',
      description: "In quest'area puoi gestire tutti gli accordi di cui sei erogatore",
    },
    subscriber: {
      title: 'Gli accordi',
      description: "In quest'area puoi gestire tutti gli accordi di cui sei fruitore",
    },
  }

  return (
    <React.Fragment>
      <StyledIntro>{INTRO[mode!]}</StyledIntro>

      <Box sx={{ mt: 4 }}>
        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          pagination={true}
          data={data}
          noDataLabel="Non ci sono accordi disponibili"
          error={error}
        >
          {data.map((item, i) => (
            <StyledTableRow
              key={i}
              cellData={[
                { label: item.eservice.name },
                { label: item.eservice.version },
                { label: AGREEMENT_STATUS_LABEL[item.status] },
                { label: mode === 'provider' ? item.consumer.name : item.producer.name },
              ]}
              index={i}
              singleActionBtn={{
                props: {
                  to: `${
                    ROUTES[mode === 'provider' ? 'PROVIDE' : 'SUBSCRIBE'].SUBROUTES!.AGREEMENT
                      .SUBROUTES!.LIST.PATH
                  }/${item.id}`,
                  component: StyledLink,
                },
                label: 'Ispeziona',
              }}
              actions={getAvailableActions(item)}
            />
          ))}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}
