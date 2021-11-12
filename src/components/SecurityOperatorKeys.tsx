import React, { useContext, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import isEmpty from 'lodash/isEmpty'
import { ActionProps, SecurityOperatorPublicKey, ToastContentWithOutcome, User } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { CreateKeyModal } from './CreateKeyModal'
import { ToastContext, UserContext } from '../lib/context'
import { DescriptionBlock } from './DescriptionBlock'
import { downloadFile } from '../lib/file-utils'
import { StyledButton } from './Shared/StyledButton'
import { StyledLink } from './Shared/StyledLink'
import { useFeedback } from '../hooks/useFeedback'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { ROUTES } from '../config/routes'

type SecurityOperatorKeysProps = {
  clientId: string
  userData: User
}

export function SecurityOperatorKeys({ clientId, userData }: SecurityOperatorKeysProps) {
  const { runAction, forceRerenderCounter, wrapActionInDialog } = useFeedback()
  const { user } = useContext(UserContext)
  const [key, setKey] = useState<any>()
  const { setToast } = useContext(ToastContext)
  const [modal, setModal] = useState(false)
  const [keyCreationCounter, setKeyCreationCounter] = useState(0)

  const closeToast = () => {
    setToast(null)
  }

  const openModal = () => {
    setModal(true)
  }

  const closeModal = (toastContent?: ToastContentWithOutcome) => {
    setModal(false)
    if (!isEmpty(toastContent)) {
      setToast({ ...toastContent!, onClose: closeToast })
    }
  }

  const updateKeyCreationCounter = () => {
    setKeyCreationCounter(keyCreationCounter + 1)
  }

  /*
   * List of keys related actions to perform
   */
  useEffect(() => {
    async function asyncFetchKeys() {
      const resp = await fetchWithLogs({
        path: {
          endpoint: 'OPERATOR_SECURITY_KEYS_GET',
          endpointParams: { taxCode: userData.taxCode, clientId },
        },
      })
      const outcome = getFetchOutcome(resp)

      setKey(undefined)
      if (outcome === 'success') {
        const axiosResp = resp as AxiosResponse
        if (axiosResp.data.keys.length > 0) {
          setKey(axiosResp.data.keys[0])
        }
      }
    }

    asyncFetchKeys()
  }, [forceRerenderCounter, keyCreationCounter]) // eslint-disable-line react-hooks/exhaustive-deps

  const wrapDownloadKey = (keyId: string) => async (_: any) => {
    const { response, outcome } = await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_KEY_DOWNLOAD',
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

  const wrapDeleteKey = (keyId: string) => async (_: any) => {
    await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_KEY_DELETE',
          endpointParams: { clientId, keyId },
        },
      },
      { suppressToast: false }
    )
  }

  const getAvailableActions = (key: SecurityOperatorPublicKey) => {
    const actions: ActionProps[] = [
      {
        onClick: wrapDownloadKey(key.kid),
        label: 'Scarica chiave',
      },
      {
        onClick: wrapActionInDialog(wrapDeleteKey(key.kid), 'OPERATOR_SECURITY_KEY_DELETE'),
        label: 'Cancella chiave',
      },
    ]

    return actions
  }

  return (
    <React.Fragment>
      {user?.taxCode === userData.taxCode && !key && (
        <StyledButton sx={{ mb: 2 }} onClick={openModal} variant="contained">
          Carica nuova chiave
        </StyledButton>
      )}

      {key ? (
        <React.Fragment>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
              borderTop: 1,
              borderBottom: 1,
            }}
          >
            <Typography>Chiave pubblica</Typography>
            <Box>
              {getAvailableActions(key.key).map(({ label, onClick }, j) => (
                <StyledButton key={j} onClick={onClick}>
                  {label}
                </StyledButton>
              ))}
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <DescriptionBlock label="Id del client">
              <span>{clientId}</span>
            </DescriptionBlock>
            <DescriptionBlock label="Id della chiave">
              <span>{key.key.kid}</span>
            </DescriptionBlock>
          </Box>
        </React.Fragment>
      ) : (
        <Typography>Nessuna chiave presente</Typography>
      )}

      {modal && (
        <CreateKeyModal
          close={closeModal}
          clientId={clientId}
          taxCode={userData.taxCode}
          afterSuccess={updateKeyCreationCounter}
        />
      )}

      <Typography sx={{ mt: 2 }}>
        Per maggiori dettagli,{' '}
        <StyledLink
          to={ROUTES.SECURITY_KEY_GUIDE.PATH}
          title="Vai alla guida per la creazione delle chiavi di sicurezza"
          target="_blank"
          rel="noreferrer noopener"
        >
          consulta la guida
        </StyledLink>
      </Typography>
    </React.Fragment>
  )
}
