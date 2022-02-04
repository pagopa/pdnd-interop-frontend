import React from 'react'
import { AxiosResponse } from 'axios'
import { PublicKey } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { downloadFile } from '../lib/file-utils'
import { useFeedback } from '../hooks/useFeedback'
import { Box } from '@mui/system'
import { InlineClipboard } from '../components/Shared/InlineClipboard'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useLocation } from 'react-router-dom'
import { getBits } from '../lib/router-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { ROUTES } from '../config/routes'

export function KeyEdit() {
  const { runAction, runActionWithDestination, wrapActionInDialog } = useFeedback()
  const location = useLocation()
  const locationBits = getBits(location)
  const kid = locationBits[locationBits.length - 1]
  const clientId = locationBits[locationBits.length - 3]

  const { data } = useAsyncFetch<PublicKey>(
    { path: { endpoint: 'KEY_GET_SINGLE', endpointParams: { clientId, kid } } },
    {
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le chiavi',
    }
  )

  const downloadKey = async () => {
    const { response, outcome } = await runAction(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_KEY_DOWNLOAD',
          endpointParams: { clientId, keyId: data?.key.kid },
        },
      },
      { suppressToast: true }
    )

    if (outcome === 'success') {
      const decoded = atob((response as AxiosResponse).data.key)
      downloadFile(decoded, 'public_key')
    }
  }

  const deleteKey = async () => {
    await runActionWithDestination(
      {
        path: {
          endpoint: 'OPERATOR_SECURITY_KEY_DELETE',
          endpointParams: { clientId, keyId: data?.key.kid },
        },
      },
      {
        destination: ROUTES.SUBSCRIBE_CLIENT_LIST,
        suppressToast: false,
      }
    )
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: 'Gestisci chiave pubblica' }}</StyledIntro>
      <Box sx={{ mt: 6 }}>
        <DescriptionBlock label="Id della chiave">
          {data?.key && (
            <InlineClipboard text={data.key.kid} successTooltipText="Id copiato correttamente" />
          )}
        </DescriptionBlock>
        <DescriptionBlock label="Id del client">
          <InlineClipboard text={clientId} successTooltipText="Id copiato correttamente" />
        </DescriptionBlock>
      </Box>

      <Box sx={{ mt: 4, display: 'flex' }}>
        <StyledButton sx={{ mr: 2 }} variant="contained" onClick={downloadKey}>
          Scarica
        </StyledButton>
        <StyledButton
          variant="outlined"
          onClick={wrapActionInDialog(deleteKey, 'OPERATOR_SECURITY_KEY_DELETE')}
        >
          Elimina
        </StyledButton>
      </Box>
    </React.Fragment>
  )
}
