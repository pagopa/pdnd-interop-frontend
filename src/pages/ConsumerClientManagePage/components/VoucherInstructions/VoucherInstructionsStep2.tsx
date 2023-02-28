import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import { AUTHORIZATION_SERVER_ACCESS_TOKEN_URL, FE_URL } from '@/config/env'
import { Divider, Stack, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import type { VoucherInstructionsStepProps } from '../../types/voucher-instructions.types'
import { CodeSnippetPreview } from './CodeSnippetPreview'

const CLIENT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
const GRANT_TYPE = 'client_credentials'

export const VoucherInstructionsStep2: React.FC<VoucherInstructionsStepProps> = ({
  back,
  forward,
  clientId,
}) => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()

  return (
    <SectionContainer>
      <Typography component="h2" variant="h5">
        {t('step2.title')}
      </Typography>
      <Typography sx={{ mt: 1 }} component="p" variant="body1" color="text.secondary">
        {t(`step2.${clientKind === 'CONSUMER' ? 'consumerDescription' : 'apiDescription.message'}`)}
      </Typography>

      <InformationContainer
        sx={{ mt: 4 }}
        label={t('step2.authEndpoint.label')}
        copyToClipboard={{
          value: AUTHORIZATION_SERVER_ACCESS_TOKEN_URL,
          tooltipTitle: t('step2.authEndpoint.copySuccessFeedbackText'),
        }}
      >
        {AUTHORIZATION_SERVER_ACCESS_TOKEN_URL}
      </InformationContainer>

      <Divider sx={{ mt: 4 }} />

      <Typography sx={{ my: 4 }} component="h2" variant="h6">
        {t('step2.requestBody.title')}
      </Typography>

      <Stack spacing={4}>
        <InformationContainer
          label={t('step2.requestBody.clientIdField.label')}
          copyToClipboard={{
            value: clientId,
            tooltipTitle: t('step2.requestBody.clientIdField.copySuccessFeedbackText'),
          }}
        >
          {clientId}
        </InformationContainer>

        <InformationContainer label={t('step2.requestBody.clientAssertionField.label')}>
          {t('step2.requestBody.clientAssertionField.suggestionLabel')}
        </InformationContainer>

        <InformationContainer
          label={t('step2.requestBody.clientAssertionTypeField.label')}
          labelDescription={t('step2.requestBody.clientAssertionTypeField.description')}
          copyToClipboard={{
            value: CLIENT_ASSERTION_TYPE,
            tooltipTitle: t('step2.requestBody.clientAssertionTypeField.copySuccessFeedbackText'),
          }}
        >
          {CLIENT_ASSERTION_TYPE}
        </InformationContainer>

        <InformationContainer
          label={t('step2.requestBody.grantTypeField.label')}
          labelDescription={t('step2.requestBody.grantTypeField.description')}
          copyToClipboard={{
            value: GRANT_TYPE,
            tooltipTitle: t('step2.requestBody.grantTypeField.copySuccessFeedbackText'),
          }}
        >
          {GRANT_TYPE}
        </InformationContainer>
      </Stack>

      <Divider sx={{ mt: 4 }} />

      <Typography sx={{ mt: 3 }} component="h3" variant="h6">
        {t('step2.voucherScript.title')}
      </Typography>
      <Typography sx={{ mt: 1 }} component="p" variant="body2" color="text.secondary">
        {t('step2.voucherScript.description')}
      </Typography>

      <CodeSnippetPreview
        sx={{ mt: 2 }}
        title={t('step2.voucherScript.exampleLabel')}
        activeLang="curl"
        entries={[{ url: `${FE_URL}/data/it/session_token_curl.txt`, value: 'curl' }]}
        scriptSubstitutionValues={{
          AUTHORIZATION_SERVER_ACCESS_TOKEN_URL,
          CLIENT_ID: clientId,
          CLIENT_ASSERTION_TYPE: CLIENT_ASSERTION_TYPE,
          GRANT_TYPE: GRANT_TYPE,
        }}
      />

      <StepActions
        back={{ label: t('backBtn'), type: 'button', onClick: back }}
        forward={{ label: t('proceedBtn'), type: 'button', onClick: forward }}
      />
    </SectionContainer>
  )
}
