import React from 'react'
import { AxiosResponse } from 'axios'
import { PublicKey, User } from '../../types'
import { DescriptionBlock } from '../components/DescriptionBlock'
import { downloadFile } from '../lib/file-utils'
import { RunActionOutput, useFeedback } from '../hooks/useFeedback'
import { Box } from '@mui/system'
import { InlineClipboard } from '../components/Shared/InlineClipboard'
import { useAsyncFetch } from '../hooks/useAsyncFetch'
import { useLocation } from 'react-router-dom'
import { buildDynamicRoute, getBits } from '../lib/router-utils'
import { StyledIntro } from '../components/Shared/StyledIntro'
import { StyledButton } from '../components/Shared/StyledButton'
import { useRoute } from '../hooks/useRoute'
import { formatDateString } from '../lib/date-utils'
import { Typography } from '@mui/material'
import { isKeyOrphan } from '../lib/key-utils'

export function KeyEdit() {
  const { routes } = useRoute()
  const { runAction } = useFeedback()
  const location = useLocation()
  const locationBits = getBits(location)
  const kid = locationBits[locationBits.length - 1]
  const clientId = locationBits[locationBits.length - 3]

  const { data: keyData } = useAsyncFetch<PublicKey>(
    { path: { endpoint: 'KEY_GET_SINGLE', endpointParams: { clientId, kid } } },
    {
      loaderType: 'contextual',
      loadingTextLabel: 'Stiamo caricando le chiavi',
    }
  )

  const { data: userData } = useAsyncFetch<Array<User>>(
    { path: { endpoint: 'OPERATOR_SECURITY_GET_LIST', endpointParams: { clientId } } },
    { loaderType: 'contextual', loadingTextLabel: 'Stiamo caricando gli operatori' }
  )

  const downloadKey = async () => {
    const { response, outcome } = (await runAction(
      {
        path: {
          endpoint: 'KEY_DOWNLOAD',
          endpointParams: { clientId, keyId: keyData?.key.kid },
        },
      },
      { suppressToast: ['success'] }
    )) as RunActionOutput

    if (outcome === 'success') {
      const decoded = atob((response as AxiosResponse).data.key)
      downloadFile(decoded, 'public_key')
    }
  }

  const deleteKey = async () => {
    await runAction(
      {
        path: {
          endpoint: 'KEY_DELETE',
          endpointParams: { clientId, keyId: keyData?.key.kid },
        },
      },
      {
        onSuccessDestination: buildDynamicRoute(
          routes.SUBSCRIBE_CLIENT_EDIT,
          { clientId },
          { tab: 'publicKeys' }
        ),
        showConfirmDialog: true,
      }
    )
  }

  return (
    <React.Fragment>
      <StyledIntro>{{ title: keyData?.name }}</StyledIntro>
      <Box sx={{ mt: 6 }}>
        <DescriptionBlock label="Data di creazione">
          {keyData && formatDateString(keyData.createdAt)}
        </DescriptionBlock>

        <DescriptionBlock label="Caricata da">
          {keyData?.operator.name} {keyData?.operator.surname}
        </DescriptionBlock>

        <DescriptionBlock label="Id della chiave (kid)">
          {keyData?.key && (
            <InlineClipboard
              text={keyData.key.kid}
              successFeedbackText="Id copiato correttamente"
            />
          )}
        </DescriptionBlock>
        <DescriptionBlock label="Id del client (clientId)">
          <InlineClipboard text={clientId} successFeedbackText="Id copiato correttamente" />
        </DescriptionBlock>

        {keyData && isKeyOrphan(keyData, userData) && (
          <Typography bgcolor="error.main" color="common.white" sx={{ p: 2 }}>
            Attenzione! L&lsquo;operatore che ha caricato questa chiave è stato rimosso da questo
            ente. Si consiglia di eliminare la chiave e di sostituirla con una nuova
          </Typography>
        )}
      </Box>

      <Box sx={{ mt: 4, display: 'flex' }}>
        <StyledButton sx={{ mr: 2 }} variant="contained" onClick={downloadKey}>
          Scarica
        </StyledButton>
        <StyledButton variant="outlined" onClick={deleteKey}>
          Elimina
        </StyledButton>
      </Box>
    </React.Fragment>
  )
}
