import React from 'react'
import { AxiosResponse } from 'axios'
import { useHistory } from 'react-router-dom'
import { ActionProps, ClientKind, PublicKeyItem, PublicKeys, SelfCareUser } from '../../../types'
import { useAsyncFetch } from '../../hooks/useAsyncFetch'
import { RunAction, RunActionOutput } from '../../hooks/useFeedback'
import { useRoute } from '../../hooks/useRoute'
import { axiosErrorToError } from '../../lib/error-utils'
import { downloadFile } from '../../lib/file-utils'
import { isKeyOrphan } from '../../lib/key-utils'
import { StyledTableRow } from './StyledTableRow'
import { StyledTooltip } from './StyledTooltip'
import { TableWithLoader } from './TableWithLoader'
import { ReportGmailerrorred as ReportGmailerrorredIcon } from '@mui/icons-material'
import { formatDateString } from '../../lib/format-utils'
import { StyledButton } from './StyledButton'
import { Box } from '@mui/material'
import { ActionMenu } from './ActionMenu'
import { buildDynamicPath } from '../../lib/router-utils'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['key', 'common'])
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

  const { data: userData } = useAsyncFetch<Array<SelfCareUser>>({
    path: { endpoint: 'OPERATOR_SECURITY_GET_LIST', endpointParams: { clientId } },
  })

  const wrapDownloadKey = (keyId: string) => async () => {
    const { response, outcome } = (await runAction(
      { path: { endpoint: 'KEY_DOWNLOAD', endpointParams: { clientId, keyId } } },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      const decoded = atob((response as AxiosResponse).data.key)
      downloadFile(decoded, 'public_key.pub')
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
      { onClick: wrapDownloadKey(key.kid), label: t('actions.download', { ns: 'common' }) },
      { onClick: wrapDeleteKey(key.kid), label: t('actions.delete', { ns: 'common' }) },
    ]

    return actions
  }

  const fetchError =
    error && error.response && error.response.status !== 404 ? axiosErrorToError(error) : undefined

  const headData = [
    t('table.headData.keyName', { ns: 'common' }),
    t('table.headData.keyUploader', { ns: 'common' }),
    t('table.headData.keyUploadDate', { ns: 'common' }),
    '',
  ]

  return (
    <TableWithLoader
      isLoading={isLoading}
      loadingText={t('loadingMultiLabel')}
      headData={headData}
      noDataLabel={t('noMultiDataLabel')}
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
                  <StyledTooltip title={t('tableKey.operatorDeletedWarning.message')}>
                    <ReportGmailerrorredIcon sx={{ ml: 0.75, fontSize: 16 }} color={color} />
                  </StyledTooltip>
                ) : undefined,
              },
              { label: formatDateString(createdAt) },
              { label: `${operator.name} ${operator.familyName}` },
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
              {t('actions.inspect', { ns: 'common' })}
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
