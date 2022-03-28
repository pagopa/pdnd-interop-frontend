import React, { FunctionComponent, useContext } from 'react'
import { AxiosResponse } from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { object, string } from 'yup'
import {
  ActionProps,
  ClientKind,
  PublicKeyItem,
  PublicKeys,
  SecurityOperatorKeysFormInputValues,
  User,
} from '../../types'
import { TableWithLoader } from '../components/Shared/TableWithLoader'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useFeedback } from '../hooks/useFeedback'
import { useUser } from '../hooks/useUser'
import { DialogContext, PartyContext } from '../lib/context'
import { axiosErrorToError } from '../lib/error-utils'
import { downloadFile } from '../lib/file-utils'
import { buildDynamicPath, getBits } from '../lib/router-utils'
import { ActionMenu } from './Shared/ActionMenu'
import { StyledButton } from './Shared/StyledButton'
import { StyledTableRow } from './Shared/StyledTableRow'
import { useRoute } from '../hooks/useRoute'
import { formatDateString } from '../lib/date-utils'
import { StyledTooltip } from './Shared/StyledTooltip'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import { isKeyOrphan } from '../lib/key-utils'
import { PageTopFilters } from './Shared/PageTopFilters'
import { TempFilters } from './TempFilters'
import { Box } from '@mui/system'
import { RunActionOutput } from '../hooks/useFeedback'

type KeyToPostProps = SecurityOperatorKeysFormInputValues & {
  use: 'SIG'
  alg: 'RS256'
  operatorId: string
}

type KeysListProps = {
  clientKind?: ClientKind
}

export const KeysList: FunctionComponent<KeysListProps> = ({ clientKind = 'CONSUMER' }) => {
  const location = useLocation()
  const locationBits = getBits(location)
  const clientId = locationBits[locationBits.length - 1]
  const { setDialog } = useContext(DialogContext)
  const { party } = useContext(PartyContext)
  const { routes } = useRoute()
  const { user } = useUser()
  const { runAction, forceRerenderCounter } = useFeedback()
  const history = useHistory()

  const {
    data: keysData,
    loadingText,
    error,
  } = useAsyncFetch<PublicKeys>(
    { path: { endpoint: 'KEY_GET_LIST', endpointParams: { clientId } } },
    {
      useEffectDeps: [forceRerenderCounter],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le chiavi',
    }
  )

  const { data: userData } = useAsyncFetch<Array<User>>(
    { path: { endpoint: 'OPERATOR_SECURITY_GET_LIST', endpointParams: { clientId } } },
    { loaderType: 'contextual', loadingTextLabel: 'Stiamo caricando gli operatori' }
  )

  const wrapDownloadKey = (keyId: string) => async () => {
    const { response, outcome } = (await runAction(
      {
        path: {
          endpoint: 'KEY_DOWNLOAD',
          endpointParams: { clientId, keyId },
        },
      },
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

  const uploadKeyFormInitialValues: SecurityOperatorKeysFormInputValues = { name: '', key: '' }
  const uploadKeyFormValidationSchema = object({
    name: string().required(),
    key: string().required(),
  })

  const uploadKey = async (data: SecurityOperatorKeysFormInputValues) => {
    // Encode public key
    const dataToPost: KeyToPostProps = {
      ...data,
      use: 'SIG',
      alg: 'RS256',
      operatorId: user?.id as string,
    }
    dataToPost.key = btoa(dataToPost.key.trim())

    await runAction({
      path: { endpoint: 'KEY_POST', endpointParams: { clientId } },
      config: { data: [dataToPost] },
    })
  }

  const openUploadKeyDialog = () => {
    setDialog({
      type: 'addSecurityOperatorKey',
      onSubmit: uploadKey,
      initialValues: uploadKeyFormInitialValues,
      validationSchema: uploadKeyFormValidationSchema,
    })
  }

  const headData = ['Nome della chiave', 'Data di creazione', 'Caricata da', '']

  const fetchError =
    error && error.response && error.response.status !== 404 ? axiosErrorToError(error) : undefined

  return (
    <React.Fragment>
      <PageTopFilters>
        <TempFilters />
        {party?.productInfo.role === 'security' && (
          <StyledButton variant="contained" size="small" onClick={openUploadKeyDialog}>
            + Aggiungi
          </StyledButton>
        )}
      </PageTopFilters>

      <TableWithLoader
        loadingText={loadingText}
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
    </React.Fragment>
  )
}
