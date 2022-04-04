import React from 'react'
import { AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import { ActionProps, ClientKind, PublicKeyItem, PublicKeys, User } from '../../../types'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { RunAction, RunActionOutput } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { axiosErrorToError } from '../../lib/error-utils'
import { downloadFile } from '../../lib/file-utils'
import { isKeyOrphan } from '../../lib/key-utils'
import { StyledTableRow } from './StyledTableRow'
import { StyledTooltip } from './StyledTooltip'
import { TableWithLoader } from './TableWithLoader'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import { formatDateString } from '../../lib/format-utils'
import { StyledButton } from './StyledButton'
import { Box } from '@mui/material'
import { ActionMenu } from './ActionMenu'
import { buildDynamicPath } from '../../lib/router-utils'

type AsyncTableKeyProps = {
  forceRerenderCounter: number
  runAction: RunAction
  clientId: string
  clientKind: ClientKind
}

export const AsyncTableKey = ({
  forceRerenderCounter,
  runAction,
  clientId,
  clientKind,
}: AsyncTableKeyProps) => {
  const { routes } = useRoute()
  const history = useHistory()

  const {
    data: keysData,
    error,
    isLoading,
  } = useAsyncFetch<PublicKeys>(
    { path: { endpoint: 'KEY_GET_LIST', endpointParams: { clientId } } },
    { useEffectDeps: [forceRerenderCounter] }
  )

  const { data: userData } = useAsyncFetch<Array<User>>({
    path: { endpoint: 'OPERATOR_SECURITY_GET_LIST', endpointParams: { clientId } },
  })

  const wrapDownloadKey = (keyId: string) => async () => {
    const { response, outcome } = (await runAction(
      { path: { endpoint: 'KEY_DOWNLOAD', endpointParams: { clientId, keyId } } },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      const decoded = atob((response as AxiosResponse).data.key)
      downloadFile(decoded, 'public_key')
    }
  }

  const wrapDeleteKey = (keyId: string) => async () => {
    await runAction(
      { path: { endpoint: 'KEY_DELETE', endpointParams: { clientId, keyId } } },
      { showConfirmDialog: true }
    )
  }

  const getAvailableActions = (key: PublicKeyItem) => {
    const actions: Array<ActionProps> = [
      { onClick: wrapDownloadKey(key.kid), label: 'Scarica' },
      { onClick: wrapDeleteKey(key.kid), label: 'Elimina' },
    ]

    return actions
  }

  const fetchError =
    error && error.response && error.response.status !== 404 ? axiosErrorToError(error) : undefined

  const headData = ['Nome della chiave', 'Data di creazione', 'Caricata da', '']

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText="Stiamo caricando le chiavi"
      headData={headData}
      noDataLabel="Non ci sono chiavi disponibili"
      error={fetchError}
    >
      {keysData?.keys.map((singleKey, i) => {
        const { key, name, createdAt, operator } = singleKey
        const isOrphan = isKeyOrphan(singleKey, userData)
        const color = isOrphan ? 'error' : 'primary'
        return (
          <StyledTableRow
            key={i}
            cellData={[
              {
                label: name,
                tooltip: isOrphan ? (
                  <StyledTooltip title="Attenzione! L'operatore che ha caricato questa chiave è stato rimosso da questo ente. Si consiglia di eliminare la chiave e di sostituirla con una nuova">
                    <ReportGmailerrorredIcon sx={{ ml: 0.75, fontSize: 16 }} color={color} />
                  </StyledTooltip>
                ) : undefined,
              },
              { label: formatDateString(createdAt) },
              { label: `${operator.name} ${operator.surname}` },
            ]}
          >
            <StyledButton
              size="small"
              variant="outlined"
              sx={{ display: 'inline-flex' }}
              onClick={() => {
                history.push(
                  buildDynamicPath(
                    clientKind === 'API'
                      ? routes.SUBSCRIBE_INTEROP_M2M_CLIENT_KEY_EDIT.PATH
                      : routes.SUBSCRIBE_CLIENT_KEY_EDIT.PATH,
                    {
                      clientId,
                      kid: key.kid,
                    }
                  )
                )
              }}
            >
              Ispeziona
            </StyledButton>

            <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
              <ActionMenu actions={getAvailableActions(key)} iconColor={color} />
            </Box>
          </StyledTableRow>
        )
      })}
    </TableWithLoader>
  )
}
