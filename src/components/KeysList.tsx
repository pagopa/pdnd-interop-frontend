import React, { FunctionComponent, useContext } from 'react'
import { Box } from '@mui/system'
import { AxiosResponse } from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { object, string } from 'yup'
import {
  ActionProps,
  ClientKind,
  PublicKeyItem,
  PublicKeys,
  SecurityOperatorKeysFormInputValues,
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
  const { runAction, wrapActionInDialog, forceRerenderCounter } = useFeedback()
  const history = useHistory()

  const { data, loadingText, error } = useAsyncFetch<PublicKeys>(
    { path: { endpoint: 'KEY_GET_LIST', endpointParams: { clientId } } },
    {
      useEffectDeps: [forceRerenderCounter],
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le chiavi',
    }
  )

  const wrapDownloadKey = (keyId: string) => async () => {
    const { response, outcome } = await runAction(
      {
        path: {
          endpoint: 'KEY_DOWNLOAD',
          endpointParams: { clientId, keyId },
        },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      const decoded = atob((response as AxiosResponse).data.key)
      downloadFile(decoded, 'public_key')
    }
  }

  const wrapDeleteKey = (keyId: string) => async () => {
    await runAction(
      {
        path: {
          endpoint: 'KEY_DELETE',
          endpointParams: { clientId, keyId },
        },
      },
      { suppressToast: false }
    )
  }

  const getAvailableActions = (key: PublicKeyItem) => {
    const actions: Array<ActionProps> = [
      {
        onClick: wrapDownloadKey(key.kid),
        label: 'Scarica',
      },
      {
        onClick: wrapActionInDialog(wrapDeleteKey(key.kid), 'KEY_DELETE'),
        label: 'Elimina',
      },
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

    await runAction(
      {
        path: { endpoint: 'KEY_POST', endpointParams: { clientId } },
        config: { data: [dataToPost] },
      },
      { suppressToast: false }
    )
  }

  const openUploadKeyDialog = () => {
    setDialog({
      type: 'addSecurityOperatorKey',
      onSubmit: uploadKey,
      initialValues: uploadKeyFormInitialValues,
      validationSchema: uploadKeyFormValidationSchema,
    })
  }

  const headData = ['nome della chiave', 'data di creazione' /*, 'operatore' */]

  const fetchError =
    error && error.response && error.response.status !== 404 ? axiosErrorToError(error) : undefined

  return (
    <React.Fragment>
      {party?.productInfo.role === 'security' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <StyledButton variant="contained" onClick={openUploadKeyDialog}>
            + Aggiungi
          </StyledButton>
        </Box>
      )}

      <TableWithLoader
        loadingText={loadingText}
        headData={headData}
        noDataLabel="Non ci sono chiavi disponibili"
        error={fetchError}
      >
        {data?.keys.map(({ key, name, createdAt }, i) => (
          <StyledTableRow
            key={i}
            cellData={[
              { label: name },
              { label: formatDateString(createdAt) },
              // TEMP PIN-1114
              // { label: '[TEMP BACKEND] Nome e cognome' },
            ]}
          >
            <StyledButton
              variant="outlined"
              size="small"
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

            <ActionMenu actions={getAvailableActions(key)} />
          </StyledTableRow>
        ))}
      </TableWithLoader>
    </React.Fragment>
  )
}
