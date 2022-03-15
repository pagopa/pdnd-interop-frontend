import React, { useContext } from 'react'
import { AGREEMENT_STATE_LABEL } from '../config/labels'
import { Box } from '@mui/system'
import {
  AgreementState,
  AgreementSummary,
  ProviderOrSubscriber,
  ActionProps,
  Party,
} from '../../types'
import { PartyContext } from '../lib/context'
import { mergeActions } from '../lib/eservice-utils'
import { getAgreementState } from '../lib/status-utils'
import { buildDynamicPath } from '../lib/router-utils'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useFeedback } from '../hooks/useFeedback'
import { useMode } from '../hooks/useMode'
import { StyledIntro, StyledIntroChildrenProps } from '../components/Shared/StyledIntro'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { TempFilters } from '../components/TempFilters'
import { StyledTableRow } from '../components/Shared/StyledTableRow'
import { StyledButton } from '../components/Shared/StyledButton'
import { ActionMenu } from '../components/Shared/ActionMenu'
import { useHistory } from 'react-router-dom'
import { axiosErrorToError } from '../lib/error-utils'
import { useRoute } from '../hooks/useRoute'

export function AgreementList() {
  const { runAction, forceRerenderCounter, wrapActionInDialog } = useFeedback()
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()
  const history = useHistory()

  const params = mode === 'provider' ? { producerId: party?.id } : { consumerId: party?.id }
  const { data, loadingText, error } = useAsyncFetch<Array<AgreementSummary>>(
    {
      path: { endpoint: 'AGREEMENT_GET_LIST' },
      config: { params },
    },
    {
      useEffectDeps: [forceRerenderCounter],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando gli accordi',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapActivate = (agreementId: string) => async () => {
    const { id: partyId } = party as Party
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_ACTIVATE',
          endpointParams: { agreementId, partyId },
        },
      },
      { suppressToast: false }
    )
  }

  const wrapSuspend = (agreementId: string) => async () => {
    const { id: partyId } = party as Party
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_SUSPEND',
          endpointParams: { agreementId, partyId },
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

  type AgreementActions = Record<AgreementState, Array<ActionProps>>
  // Build list of available actions for each service in its current state
  const getAvailableActions = (agreement: AgreementSummary) => {
    const sharedActions: AgreementActions = {
      ACTIVE: [
        {
          onClick: wrapActionInDialog(wrapSuspend(agreement.id), 'AGREEMENT_SUSPEND'),
          label: 'Sospendi',
        },
      ],
      SUSPENDED: [
        {
          onClick: wrapActionInDialog(wrapActivate(agreement.id), 'AGREEMENT_ACTIVATE'),
          label: 'Riattiva',
        },
      ],
      PENDING: [],
      INACTIVE: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (agreement.eservice.activeDescriptor) {
      subscriberOnlyActionsActive.push({
        onClick: wrapActionInDialog(wrapUpgrade(agreement.id), 'AGREEMENT_UPGRADE'),
        label: 'Aggiorna',
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      ACTIVE: subscriberOnlyActionsActive,
      SUSPENDED: [],
      PENDING: [],
      INACTIVE: [],
    }

    const providerOnlyActions: AgreementActions = {
      ACTIVE: [],
      SUSPENDED: [],
      PENDING: [
        {
          onClick: wrapActionInDialog(wrapActivate(agreement.id), 'AGREEMENT_ACTIVATE'),
          label: 'Attiva',
        },
      ],
      INACTIVE: [],
    }

    const currentActions: AgreementActions = {
      provider: providerOnlyActions,
      subscriber: subscriberOnlyActions,
    }[currentMode]

    const status = getAgreementState(agreement, mode)

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

  const headData = [
    'nome e-service',
    mode === 'provider' ? 'ente fruitore' : 'ente erogatore',
    'stato richiesta',
  ]

  const INTRO: Record<ProviderOrSubscriber, StyledIntroChildrenProps> = {
    provider: {
      title: 'Richieste di fruizione',
      description:
        "In quest'area puoi gestire tutte le richieste di fruizione che ti sono state inoltrate da enti che intendono fruire dei tuoi e-service",
    },
    subscriber: {
      title: 'Le tue richieste',
      description:
        "In quest'area puoi gestire tutte le richieste di fruizione che hai sottoscritto presso Enti Erogatori",
    },
  }

  return (
    <React.Fragment>
      <StyledIntro>{INTRO[currentMode]}</StyledIntro>

      <Box sx={{ mt: 4 }}>
        <TempFilters />

        <TableWithLoader
          loadingText={loadingText}
          headData={headData}
          noDataLabel="Non ci sono accordi disponibili"
          error={axiosErrorToError(error)}
        >
          {data &&
            Boolean(data.length > 0) &&
            data.map((item, i) => (
              <StyledTableRow
                key={i}
                cellData={[
                  { label: item.eservice.name },
                  { label: mode === 'provider' ? item.consumer.name : item.producer.name },
                  { label: AGREEMENT_STATE_LABEL[item.state] },
                ]}
              >
                <StyledButton
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    history.push(
                      buildDynamicPath(
                        routes[
                          mode === 'provider'
                            ? 'PROVIDE_AGREEMENT_EDIT'
                            : 'SUBSCRIBE_AGREEMENT_EDIT'
                        ].PATH,
                        { agreementId: item.id }
                      )
                    )
                  }}
                >
                  Ispeziona
                </StyledButton>

                <ActionMenu actions={getAvailableActions(item)} />
              </StyledTableRow>
            ))}
        </TableWithLoader>
      </Box>
    </React.Fragment>
  )
}
