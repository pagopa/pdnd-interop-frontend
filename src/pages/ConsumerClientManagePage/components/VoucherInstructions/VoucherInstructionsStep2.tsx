import React from 'react'
import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import { AUTHORIZATION_SERVER_ACCESS_TOKEN_URL, FE_URL } from '@/config/env'
import { Stack } from '@mui/material'
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
    <>
      <SectionContainer
        title={t('step2.title')}
        description={t(
          `step2.${clientKind === 'CONSUMER' ? 'consumerDescription' : 'apiDescription.message'}`
        )}
      >
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
      </SectionContainer>

      <SectionContainer title={t('step2.requestBody.title')}>
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
      </SectionContainer>

      <SectionContainer
        title={t('step2.voucherScript.title')}
        description={t('step2.voucherScript.description')}
      >
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
    </>
  )
}
