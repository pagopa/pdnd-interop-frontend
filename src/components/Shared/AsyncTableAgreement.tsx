import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Chip } from '@mui/material'
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
import { CHIP_COLORS_AGREEMENT } from '../../lib/constants'

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
      ? {
          producerId: jwt?.organization.id,
          states: ['ACTIVE', 'ARCHIVED', 'PENDING', 'SUSPENDED', 'REJECTED'],
        }
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
        path: { endpoint: 'AGREEMENT_ACTIVATE', endpointParams: { agreementId } },
      },
      { showConfirmDialog: true }
    )
  }

  const wrapSuspend = (agreementId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'AGREEMENT_SUSPEND', endpointParams: { agreementId } },
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
      ARCHIVED: [],
      DRAFT: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (
      agreement.eservice.activeDescriptor &&
      agreement.eservice.activeDescriptor.state === 'PUBLISHED'
    ) {
      subscriberOnlyActionsActive.push({
        onClick: wrapUpgrade(agreement.id),
        label: t('actions.upgrade', { ns: 'common' }),
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      ACTIVE: subscriberOnlyActionsActive,
      SUSPENDED: [],
      PENDING: [],
      ARCHIVED: [],
      DRAFT: [],
    }

    const providerOnlyActions: AgreementActions = {
      ACTIVE: [],
      SUSPENDED: [],
      PENDING: [
        { onClick: wrapActivate(agreement.id), label: t('actions.activate', { ns: 'common' }) },
      ],
      ARCHIVED: [],
      DRAFT: [],
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
              {
                custom: (
                  <Chip
                    label={t(`status.agreement.${[item.state]}`, { ns: 'common' })}
                    color={CHIP_COLORS_AGREEMENT[item.state]}
                  />
                ),
              },
            ]}
          >
            <StyledButton
              variant="outlined"
              size="small"
              onClick={() => {
                let route = 'PROVIDE_AGREEMENT_READ'
                if (currentMode === 'subscriber') {
                  route =
                    item.state === 'DRAFT' ? 'SUBSCRIBE_AGREEMENT_EDIT' : 'SUBSCRIBE_AGREEMENT_READ'
                }

                history.push(buildDynamicPath(routes[route].PATH, { agreementId: item.id }))
              }}
            >
              {t(`actions.${item.state === 'DRAFT' ? 'edit' : 'inspect'}`, { ns: 'common' })}
            </StyledButton>

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getAvailableActions(item)} />
            </Box>
          </StyledTableRow>
        ))}
    </TableWithLoader>
  )
}
