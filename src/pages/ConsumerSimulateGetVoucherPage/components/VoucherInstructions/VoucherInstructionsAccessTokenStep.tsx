import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import { AUTHORIZATION_SERVER_TOKEN_CREATION_URL, FE_URL } from '@/config/env'
import { Alert, Divider, Stack, Typography, Link as MUILink } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { useClientKind } from '@/hooks/useClientKind'
import { CodeSnippetPreview } from './CodeSnippetPreview'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { Link } from '@/router'
import { useVoucherInstructionsContext } from './VoucherInstructionsContext'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useSearchParams } from 'react-router-dom'

const CLIENT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
const GRANT_TYPE = 'client_credentials'

export const VoucherInstructionsAccessTokenStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const [searchParams] = useSearchParams()

  const { goToPreviousStep, goToNextStep } = useVoucherInstructionsContext()

  const clientId = searchParams.get('clientId') || ''

  return (
    <>
      <SectionContainer
        title={t('accessTokenStep.title')}
        description={t(
          `accessTokenStep.${clientKind === 'CONSUMER' ? 'consumerDescription' : 'apiDescription'}`
        )}
      >
        <SectionContainer innerSection title={t('accessTokenStep.authEndpoint.label')}>
          <InformationContainer
            label="URL"
            content={AUTHORIZATION_SERVER_TOKEN_CREATION_URL}
            copyToClipboard={{
              value: AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
              tooltipTitle: t('accessTokenStep.authEndpoint.copySuccessFeedbackText'),
            }}
          />
        </SectionContainer>
        <Divider sx={{ my: 1 }} />
        <SectionContainer innerSection title={t('accessTokenStep.requestBody.title')}>
          <Stack spacing={2}>
            <InformationContainer
              label={t('accessTokenStep.requestBody.clientIdField.label')}
              content={clientId}
              copyToClipboard={{
                value: clientId,
                tooltipTitle: t(
                  'accessTokenStep.requestBody.clientIdField.copySuccessFeedbackText'
                ),
              }}
            />
            <InformationContainer
              label={t('accessTokenStep.requestBody.clientAssertionField.label')}
              content={t('accessTokenStep.requestBody.clientAssertionField.suggestionLabel')}
            />

            <InformationContainer
              label={t('accessTokenStep.requestBody.clientAssertionTypeField.label')}
              labelDescription={t(
                'accessTokenStep.requestBody.clientAssertionTypeField.description'
              )}
              content={CLIENT_ASSERTION_TYPE}
              copyToClipboard={{
                value: CLIENT_ASSERTION_TYPE,
                tooltipTitle: t(
                  'accessTokenStep.requestBody.clientAssertionTypeField.copySuccessFeedbackText'
                ),
              }}
            />
            <InformationContainer
              label={t('accessTokenStep.requestBody.grantTypeField.label')}
              content={GRANT_TYPE}
              copyToClipboard={{
                value: GRANT_TYPE,
                tooltipTitle: t(
                  'accessTokenStep.requestBody.grantTypeField.copySuccessFeedbackText'
                ),
              }}
            />
          </Stack>
        </SectionContainer>
      </SectionContainer>

      <SectionContainer title={t('accessTokenStep.voucherScript.title')}>
        <Typography>
          <Trans
            components={{
              1: <MUILink href="https://formulae.brew.sh/formula/curl" target="_blank" />,
            }}
          >
            {t('accessTokenStep.voucherScript.guide')}
          </Trans>
        </Typography>
        <CodeSnippetPreview
          sx={{ mt: 2 }}
          title={t('accessTokenStep.voucherScript.exampleLabel')}
          activeLang="curl"
          entries={[{ url: `${FE_URL}/data/it/session_token_curl.txt`, value: 'curl' }]}
          scriptSubstitutionValues={{
            AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
            CLIENT_ID: clientId,
            CLIENT_ASSERTION_TYPE: CLIENT_ASSERTION_TYPE,
            GRANT_TYPE: GRANT_TYPE,
          }}
        />

        <Alert severity="info" sx={{ mt: 4 }}>
          {t('accessTokenStep.debugVoucherAlert.description')}{' '}
          <Link to={'SUBSCRIBE_DEBUG_VOUCHER'}>
            {t('accessTokenStep.debugVoucherAlert.link.label')}
          </Link>
        </Alert>
      </SectionContainer>
      <StepActions
        back={{
          label: t('backBtn'),
          type: 'button',
          onClick: goToPreviousStep,
          startIcon: <ArrowBackIcon />,
        }}
        forward={{
          label: t('proceedBtn'),
          type: 'button',
          onClick: goToNextStep,
          endIcon: <ArrowForwardIcon />,
        }}
      />
    </>
  )
}
