import React, { useContext, useEffect, useState } from 'react'
import { AxiosResponse } from 'axios'
import { ActionProps, SecurityOperatorPublicKey, User } from '../../types'
import { fetchWithLogs } from '../lib/api-utils'
import { getFetchOutcome } from '../lib/error-utils'
import { UserContext } from '../lib/context'
import { DescriptionBlock } from './DescriptionBlock'
import { downloadFile } from '../lib/file-utils'
import { StyledButton } from './Shared/StyledButton'
import { StyledLink } from './Shared/StyledLink'
import { useFeedback } from '../hooks/useFeedback'
import { Box } from '@mui/system'
import { Typography } from '@mui/material'
import { ROUTES } from '../config/routes'
import { useSecurityOperatorKeyDialog } from '../hooks/useSecurityOperatorKeyDialog'
import { InlineClipboard } from './Shared/InlineClipboard'

type SecurityOperatorKeysProps = {
  clientId: string
  userData: User
}

type Key = {
  kid: string
}

type PublicKeyObject = {
  key: Key
}

export function SecurityOperatorKeys({ clientId, userData }: SecurityOperatorKeysProps) {
  const { runAction, forceRerenderCounter, wrapActionInDialog } = useFeedback()
  const { user } = useContext(UserContext)
  const [key, setKey] = useState<PublicKeyObject | undefined>()

  const { openDialog, forceRerenderCounter: securityKeyPostForceRerenderCounter } =
    useSecurityOperatorKeyDialog({
      clientId,
      taxCode: userData.taxCode,
    })

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
  }, [forceRerenderCounter, securityKeyPostForceRerenderCounter]) // eslint-disable-line react-hooks/exhaustive-deps

  const wrapDownloadKey = (keyId: string) => async () => {
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

  const wrapDeleteKey = (keyId: string) => async () => {
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
    const actions: Array<ActionProps> = [
      {
        onClick: wrapDownloadKey(key.kid),
        label: 'Scarica',
      },
      {
        onClick: wrapActionInDialog(wrapDeleteKey(key.kid), 'OPERATOR_SECURITY_KEY_DELETE'),
        label: 'Elimina',
      },
    ]

    return actions
  }

  return (
    <React.Fragment>
      {user?.taxCode === userData.taxCode && !key && (
        <React.Fragment>
          <StyledButton sx={{ mb: 2 }} onClick={openDialog} variant="contained">
            Carica nuova chiave
          </StyledButton>
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
              borderColor: 'divider',
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
          <Box sx={{ mt: 6 }}>
            <DescriptionBlock label="Id del client">
              <InlineClipboard text={clientId} successTooltipText="Id copiato correttamente" />
            </DescriptionBlock>
            <DescriptionBlock label="Id della chiave">
              <InlineClipboard text={key.key.kid} successTooltipText="Id copiato correttamente" />
            </DescriptionBlock>
          </Box>
        </React.Fragment>
      ) : (
        <Typography>Nessuna chiave presente</Typography>
      )}
    </React.Fragment>
  )
}
