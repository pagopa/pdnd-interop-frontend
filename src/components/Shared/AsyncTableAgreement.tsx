import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from '@mui/material'
import {
  ActionProps,
  AgreementState,
  AgreementSummary,
  Party,
  ProviderOrSubscriber,
} from '../../../types'
import { AGREEMENT_STATE_LABEL } from '../../config/labels'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { useFeedback } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { PartyContext } from '../../lib/context'
import { axiosErrorToError } from '../../lib/error-utils'
import { mergeActions } from '../../lib/eservice-utils'
import { buildDynamicPath } from '../../lib/router-utils'
import { getAgreementState } from '../../lib/status-utils'
import { ActionMenu } from './ActionMenu'
import { StyledButton } from './StyledButton'
import { StyledTableRow } from './StyledTableRow'
import { TableWithLoader } from './TableWithLoader'
import { useMode } from '../../hooks/useMode'

export const AsyncTableAgreement = () => {
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber
  const { party } = useContext(PartyContext)
  const { runAction, forceRerenderCounter } = useFeedback()
  const { routes } = useRoute()
  const history = useHistory()
  const params = currentMode === 'provider' ? { producerId: party?.id } : { consumerId: party?.id }

  const { data, loadingText, error } = useAsyncFetch<Array<AgreementSummary>>(
    {
      path: { endpoint: 'AGREEMENT_GET_LIST' },
      config: { params },
    },
    {
      useEffectDeps: [forceRerenderCounter],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le richieste',
    }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapActivate = (agreementId: string) => async () => {
    const { id: partyId } = party as Party
    await runAction(
      {
        path: { endpoint: 'AGREEMENT_ACTIVATE', endpointParams: { agreementId, partyId } },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapSuspend = (agreementId: string) => async () => {
    const { id: partyId } = party as Party
    await runAction(
      {
        path: { endpoint: 'AGREEMENT_SUSPEND', endpointParams: { agreementId, partyId } },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapUpgrade = (agreementId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'AGREEMENT_UPGRADE', endpointParams: { agreementId } },
      },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  type AgreementActions = Record<AgreementState, Array<ActionProps>>
  // Build list of available actions for each service in its current state
  const getAvailableActions = (agreement: AgreementSummary) => {
    const sharedActions: AgreementActions = {
      ACTIVE: [{ onClick: wrapSuspend(agreement.id), label: 'Sospendi' }],
      SUSPENDED: [{ onClick: wrapActivate(agreement.id), label: 'Riattiva' }],
      PENDING: [],
      INACTIVE: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (agreement.eservice.activeDescriptor) {
      subscriberOnlyActionsActive.push({
        onClick: wrapUpgrade(agreement.id),
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
      PENDING: [{ onClick: wrapActivate(agreement.id), label: 'Attiva' }],
      INACTIVE: [],
    }

    const currentActions: AgreementActions = {
      provider: providerOnlyActions,
      subscriber: subscriberOnlyActions,
    }[currentMode]

    const status = getAgreementState(agreement, currentMode)

    return mergeActions<AgreementActions>([currentActions, sharedActions], status)
  }

  const headData = [
    'Nome E-Service',
    currentMode === 'provider' ? 'Ente fruitore' : 'Ente erogatore',
    'Stato richiesta',
    '',
  ]

  return (
    <TableWithLoader
      loadingText={loadingText}
      headData={headData}
      noDataLabel="Non ci sono richieste disponibili"
      error={axiosErrorToError(error)}
    >
      {data &&
        Boolean(data.length > 0) &&
        data.map((item, i) => (
          <StyledTableRow
            key={i}
            cellData={[
              { label: item.eservice.name },
              { label: currentMode === 'provider' ? item.consumer.name : item.producer.name },
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
                      currentMode === 'provider'
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

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getAvailableActions(item)} />
            </Box>
          </StyledTableRow>
        ))}
    </TableWithLoader>
  )
}
