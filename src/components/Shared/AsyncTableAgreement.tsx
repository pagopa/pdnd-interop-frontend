import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Chip, Stack } from '@mui/material'
import { ActionProps, AgreementState, AgreementSummary, ProviderOrSubscriber } from '../../../types'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { useFeedback } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { axiosErrorToError } from '../../lib/error-utils'
import { mergeActions } from '../../lib/eservice-utils'
import { buildDynamicPath } from '../../lib/router-utils'
import { ActionMenu } from './ActionMenu'
import { StyledButton } from './StyledButton'
import { StyledTableRow } from './StyledTableRow'
import { TableWithLoader } from './TableWithLoader'
import { useMode } from '../../hooks/useMode'
import { useTranslation } from 'react-i18next'
import { useJwt } from '../../hooks/useJwt'
import { getAgreementChipState } from '../../lib/status-utils'

export const AsyncTableAgreement = () => {
  const { t } = useTranslation(['agreement'])
  const { t: tCommon } = useTranslation('common')
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
      ACTIVE: [{ onClick: wrapSuspend(agreement.id), label: tCommon('actions.suspend') }],
      SUSPENDED: [{ onClick: wrapActivate(agreement.id), label: tCommon('actions.activate') }],
      PENDING: [],
      ARCHIVED: [],
      DRAFT: [],
      REJECTED: [],
      MISSING_CERTIFIED_ATTRIBUTES: [],
    }

    const subscriberOnlyActionsActive: Array<ActionProps> = []
    if (
      agreement.eservice.activeDescriptor &&
      agreement.eservice.activeDescriptor.state === 'PUBLISHED'
    ) {
      subscriberOnlyActionsActive.push({
        onClick: wrapUpgrade(agreement.id),
        label: tCommon('actions.upgrade'),
      })
    }

    const subscriberOnlyActions: AgreementActions = {
      ACTIVE: subscriberOnlyActionsActive,
      SUSPENDED: [],
      PENDING: [],
      ARCHIVED: [],
      DRAFT: [],
      REJECTED: [],
      MISSING_CERTIFIED_ATTRIBUTES: [],
    }

    const providerOnlyActions: AgreementActions = {
      ACTIVE: [],
      SUSPENDED: [],
      PENDING: [{ onClick: wrapActivate(agreement.id), label: tCommon('actions.activate') }],
      ARCHIVED: [],
      DRAFT: [],
      REJECTED: [],
      MISSING_CERTIFIED_ATTRIBUTES: [],
    }

    const currentActions: AgreementActions = {
      provider: providerOnlyActions,
      subscriber: subscriberOnlyActions,
    }[currentMode]

    return mergeActions<AgreementActions>([currentActions, sharedActions], agreement.state)
  }

  const headData = [
    tCommon('table.headData.eserviceName'),
    tCommon(`table.headData.${currentMode === 'provider' ? 'subscriberName' : 'providerName'}`),
    tCommon('table.headData.agreementStatus'),
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
                  <Stack direction="row" flexWrap="wrap" spacing={1} alignItems="flex-start">
                    {getAgreementChipState(item, tCommon).map(({ label, color }, i) => (
                      <Chip size="small" key={i} label={label} color={color} />
                    ))}
                  </Stack>
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
              {tCommon(`actions.${item.state === 'DRAFT' ? 'edit' : 'inspect'}`)}
            </StyledButton>

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getAvailableActions(item)} />
            </Box>
          </StyledTableRow>
        ))}
    </TableWithLoader>
  )
}
