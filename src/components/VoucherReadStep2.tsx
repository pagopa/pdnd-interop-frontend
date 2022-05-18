import React from 'react'
import { Divider, Link, Paper, Typography } from '@mui/material'
import { InteropM2MVoucherStepProps } from './VoucherRead'
import { StepActions } from './Shared/StepActions'
import { StyledIntro } from './Shared/StyledIntro'
import { DescriptionBlock } from './DescriptionBlock'
import { InlineClipboard } from './Shared/InlineClipboard'
import { API_GATEWAY_URL, AUTHORIZATION_SERVER_ACCESS_TOKEN_URL } from '../config/api-endpoints'
import { CodeSnippetPreview } from './Shared/CodeSnippedPreview'
import { URL_FE } from '../lib/constants'
import { useTranslation } from 'react-i18next'

const CLIENT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
const GRANT_TYPE = 'client_credentials'

export const VoucherReadStep2 = ({
  clientKind,
  clientId,
  back,
  forward,
}: InteropM2MVoucherStepProps) => {
  const { t } = useTranslation('voucher')

  return (
    <Paper sx={{ bgcolor: 'background.paper', p: 3, mt: 2 }}>
      <StyledIntro component="h2">
        {{
          title: t('step2.title'),
          description:
            clientKind === 'CONSUMER' ? (
              t('step2.consumerDescription')
            ) : (
              <React.Fragment>
                {t('step2.apiDescription.message')}{' '}
                <Link
                  href={`${API_GATEWAY_URL}/swagger/docs/index.html`}
                  target="_blank"
                  rel="noreferrer"
                  title={t('step2.apiDescription.link.title')}
                >
                  {t('step2.apiDescription.link.label')}
                </Link>
              </React.Fragment>
            ),
        }}
      </StyledIntro>

      <DescriptionBlock label={t('step2.authEndpoint.label')}>
        <InlineClipboard
          textToCopy={AUTHORIZATION_SERVER_ACCESS_TOKEN_URL}
          successFeedbackText={t('step2.authEndpoint.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{ title: t('step2.requestBody.title') }}
      </StyledIntro>

      <DescriptionBlock label={t('step2.requestBody.clientIdField.label')}>
        <InlineClipboard
          textToCopy={clientId}
          successFeedbackText={t('step2.requestBody.clientIdField.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      <DescriptionBlock label={t('step2.requestBody.clientAssertionField.label')}>
        <Typography>{t('step2.requestBody.clientAssertionField.suggestionLabel')}</Typography>
      </DescriptionBlock>

      <DescriptionBlock
        label={t('step2.requestBody.clientAssertionTypeField.label')}
        labelDescription={t('step2.requestBody.clientAssertionTypeField.description')}
      >
        <InlineClipboard
          textToCopy={CLIENT_ASSERTION_TYPE}
          successFeedbackText={t(
            'step2.requestBody.clientAssertionTypeField.copySuccessFeedbackText'
          )}
        />
      </DescriptionBlock>

      <DescriptionBlock
        label={t('step2.requestBody.grantTypeField.label')}
        labelDescription={t('step2.requestBody.grantTypeField.description')}
      >
        <InlineClipboard
          textToCopy={GRANT_TYPE}
          successFeedbackText={t('step2.requestBody.grantTypeField.copySuccessFeedbackText')}
        />
      </DescriptionBlock>

      <Divider />

      <StyledIntro component="h3" sx={{ mt: 3 }}>
        {{
          title: t('step2.accessTokenScript.title'),
          description: t('step2.accessTokenScript.description'),
        }}
      </StyledIntro>

      <CodeSnippetPreview
        sx={{ mt: 2 }}
        title={t('step2.accessTokenScript.exampleLabel')}
        activeLang="curl"
        entries={[{ url: `${URL_FE}/data/it/session_token_curl.txt`, value: 'curl' }]}
        scriptSubstitutionValues={{
          AUTHORIZATION_SERVER_ACCESS_TOKEN_URL: AUTHORIZATION_SERVER_ACCESS_TOKEN_URL,
          CLIENT_ID: clientId,
          CLIENT_ASSERTION_TYPE: CLIENT_ASSERTION_TYPE,
          GRANT_TYPE: GRANT_TYPE,
        }}
      />

      <StepActions
        back={{ label: t('backBtn'), type: 'button', onClick: back }}
        forward={{ label: t('proceedBtn'), type: 'button', onClick: forward }}
      />
    </Paper>
  )
}
