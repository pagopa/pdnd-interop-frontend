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
import { formatDateString } from '../lib/format-utils'
import { Alert } from '@mui/material'
import { isKeyOrphan } from '../lib/key-utils'
import { useTranslation } from 'react-i18next'

export function KeyEdit() {
  const { t } = useTranslation(['key', 'common'])
  const { routes } = useRoute()
  const { runAction } = useFeedback()
  const location = useLocation()
  const locationBits = getBits(location)
  const kid = locationBits[locationBits.length - 1]
  const clientId = locationBits[locationBits.length - 3]

  const { data: keyData } = useAsyncFetch<PublicKey>({
    path: { endpoint: 'KEY_GET_SINGLE', endpointParams: { clientId, kid } },
  })

  const { data: userData } = useAsyncFetch<Array<User>>({
    path: { endpoint: 'OPERATOR_SECURITY_GET_LIST', endpointParams: { clientId } },
  })

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
      downloadFile(decoded, 'public_key.pub')
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
        <DescriptionBlock label={t('edit.creationDateField.label')}>
          {keyData && formatDateString(keyData.createdAt)}
        </DescriptionBlock>

        <DescriptionBlock label={t('edit.uploaderField.name')}>
          {keyData?.operator.name} {keyData?.operator.surname}
        </DescriptionBlock>

        <DescriptionBlock label={t('edit.kidField.label')}>
          {keyData?.key && (
            <InlineClipboard
              textToCopy={keyData.key.kid}
              successFeedbackText={t('edit.kidField.copySuccessFeedbackText')}
            />
          )}
        </DescriptionBlock>
        <DescriptionBlock label={t('edit.clientIdField.label')}>
          <InlineClipboard
            textToCopy={clientId}
            successFeedbackText={t('edit.clientIdField.copySuccessFeedbackText')}
          />
        </DescriptionBlock>

        {keyData && isKeyOrphan(keyData, userData) && (
          <Alert severity="info">{t('edit.operatorDeletedAlertMessage')}</Alert>
        )}
      </Box>

      <Box sx={{ mt: 4, display: 'flex' }}>
        <StyledButton sx={{ mr: 2 }} variant="contained" onClick={downloadKey}>
          {t('actions.download', { ns: 'common' })}
        </StyledButton>
        <StyledButton variant="outlined" onClick={deleteKey}>
          {t('actions.delete', { ns: 'common' })}
        </StyledButton>
      </Box>
    </React.Fragment>
  )
}
