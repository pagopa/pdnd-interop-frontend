import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box } from '@mui/material'
import { ActionProps, AgreementState, AgreementSummary, ProviderOrSubscriber } from '../../../types'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { useFeedback } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { axiosErrorToError } from '../../lib/error-utils'
import { mergeActions } from '../../lib/eservice-utils'
import { buildDynamicPath } from '../../lib/router-utils'
import { getAgreementState } from '../../lib/status-utils'
import { ActionMenu } from './ActionMenu'
import { StyledButton } from './StyledButton'
import { StyledTableRow } from './StyledTableRow'
import { TableWithLoader } from './TableWithLoader'
import { useMode } from '../../hooks/useMode'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../../hooks/useJwt'

export const AsyncTableAgreement = () => {
  const { t } = useTranslation(['agreement', 'common'])
  const mode = useMode()
  const currentMode = mode as ProviderOrSubscriber
  const { jwt } = useJwt()
  const { runAction, forceRerenderCounter } = useFeedback()
  const { routes } = useRoute()
  const history = useHistory()
  const params =
    currentMode === 'provider'
      ? { producerId: jwt?.organization.id }
      : { consumerId: jwt?.organization.id }

  const { data, error, isLoading } = useAsyncFetch<Array<AgreementSummary>>(
    { path: { endpoint: 'AGREEMENT_GET_LIST' }, config: { params } },
    { useEffectDeps: [forceRerenderCounter] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapActivate = (agreementId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_ACTIVATE',
          endpointParams: { agreementId, partyId: jwt?.organization.id },
        },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapSuspend = (agreementId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'AGREEMENT_SUSPEND',
          endpointParams: { agreementId, partyId: jwt?.organization.id },
        },
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
      ACTIVE: [
        { onClick: wrapSuspend(agreement.id), label: t('actions.suspend', { ns: 'common' }) },
      ],
      SUSPENDED: [
        { onClick: wrapActivate(agreement.id), label: t('actions.activate', { ns: 'common' }) },
      ],
      PENDING: [],
      INACTIVE: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (agreement.eservice.activeDescriptor) {
      subscriberOnlyActionsActive.push({
        onClick: wrapUpgrade(agreement.id),
        label: t('actions.upgrade', { ns: 'common' }),
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
        { onClick: wrapActivate(agreement.id), label: t('actions.activate', { ns: 'common' }) },
      ],
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
    t('table.headData.eserviceName', { ns: 'common' }),
    t(`table.headData.${currentMode === 'provider' ? 'subscriberName' : 'providerName'}`, {
      ns: 'common',
    }),
    t('table.headData.agreementStatus', { ns: 'common' }),
    '',
  ]

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText={t('loadingMultiLabel')}
      headData={headData}
      noDataLabel={t('noMultiDataLabel')}
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
              { label: t(`status.agreement.${[item.state]}`, { ns: 'common' }) },
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
              {t('actions.inspect', { ns: 'common' })}
            </StyledButton>

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getAvailableActions(item)} />
            </Box>
          </StyledTableRow>
        ))}
    </TableWithLoader>
  )
}
