import React, { useContext } from 'react'
import { Box } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { ActionProps, Client, ClientKind, DecoratedPurpose } from '../../../types'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { RunAction, useFeedback } from '../../hooks/useFeedback'
import { axiosErrorToError } from '../../lib/error-utils'
import { buildDynamicPath } from '../../lib/router-utils'
import { ActionMenu } from './ActionMenu'
import { StyledButton } from './StyledButton'
import { StyledTableRow } from './StyledTableRow'
import { TableWithLoader } from './TableWithLoader'
import { PartyContext } from '../../lib/context'
import { useRoute } from '../../hooks/useRoute'
import { useTranslation } from 'react-i18next'

type AsyncTableClientProps = {
  clientKind: ClientKind
}

export const AsyncTableClient = ({ clientKind }: AsyncTableClientProps) => {
  const { t } = useTranslation(['client', 'common'])
  const { runAction, forceRerenderCounter } = useFeedback()
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()

  const history = useHistory()
  const editPath =
    clientKind === 'CONSUMER'
      ? routes.SUBSCRIBE_CLIENT_EDIT.PATH
      : routes.SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT.PATH

  const { data, error, isLoading } = useAsyncFetch<{ clients: Array<Client> }, Array<Client>>(
    {
      path: { endpoint: 'CLIENT_GET_LIST' },
      config: { params: { kind: clientKind, consumerId: party?.id } },
    },
    { mapFn: (data) => data.clients, useEffectDeps: [forceRerenderCounter] }
  )

  /*
   * List of possible actions for the user to perform
   */
  const wrapDelete = (clientId: string) => async () => {
    await runAction(
      { path: { endpoint: 'CLIENT_DELETE', endpointParams: { clientId } } },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  const getAvailableActions = (client: Client): Array<ActionProps> => {
    return [{ onClick: wrapDelete(client.id), label: t('actions.delete', { ns: 'common' }) }]
  }

  const headData = [t('tableHead.clientName'), '']

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText={t('loadingLabel')}
      headData={headData}
      noDataLabel={t('noDataLabel')}
      error={axiosErrorToError(error)}
    >
      {data &&
        Boolean(data.length > 0) &&
        data.map((item, i) => (
          <StyledTableRow key={i} cellData={[{ label: item.name }]}>
            <StyledButton
              variant="outlined"
              size="small"
              onClick={() => {
                history.push(buildDynamicPath(editPath, { clientId: item.id }))
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

type AsyncTableClientInPurposeProps = {
  runAction: RunAction
  purposeId?: string
  data?: DecoratedPurpose
}

export const AsyncTableClientInPurpose = ({
  runAction,
  purposeId,
  data,
}: AsyncTableClientInPurposeProps) => {
  const { t } = useTranslation(['client', 'common'])
  const { routes } = useRoute()
  const history = useHistory()

  /*
   * List of possible actions to perform in the client tab
   */
  const wrapRemoveFromPurpose = (clientId: string) => async () => {
    await runAction(
      {
        path: { endpoint: 'CLIENT_REMOVE_FROM_PURPOSE', endpointParams: { clientId, purposeId } },
      },
      { showConfirmDialog: true }
    )
  }
  /*
   * End list of actions
   */

  // Build list of available actions for each client in its current state
  const getAvailableActions = (item: Pick<Client, 'id' | 'name'>): Array<ActionProps> => {
    const removeFromPurposeAction = {
      onClick: wrapRemoveFromPurpose(item.id),
      label: t('actions.removeFromPurpose'),
    }

    return [removeFromPurposeAction]
  }

  const headData = [t('tableHead.clientName'), '']

  return (
    <TableWithLoader
      isLoading={false}
      headData={headData}
      noDataLabel={t('noClientsAssociatedToPurposeLabel')}
      // error={axiosErrorToError(error)}
    >
      {data?.clients?.map((item, i) => (
        <StyledTableRow key={i} cellData={[{ label: item.name }]}>
          <StyledButton
            variant="outlined"
            size="small"
            onClick={() => {
              history.push(
                buildDynamicPath(routes.SUBSCRIBE_CLIENT_EDIT.PATH, { clientId: item.id })
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
