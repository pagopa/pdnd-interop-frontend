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

const CLIENT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
const GRANT_TYPE = 'client_credentials'

export const VoucherInstructionsStep3: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()

  const { clientId, goToPreviousStep, goToNextStep } = useVoucherInstructionsContext()

  return (
    <>
      <SectionContainer
        newDesign
        title={t('step3.title')}
        description={t(
          `step3.${clientKind === 'CONSUMER' ? 'consumerDescription' : 'apiDescription'}`
        )}
      >
        <SectionContainer newDesign innerSection title={t('step3.authEndpoint.label')}>
          <InformationContainer
            label="URL"
            content={AUTHORIZATION_SERVER_TOKEN_CREATION_URL}
            copyToClipboard={{
              value: AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
              tooltipTitle: t('step3.authEndpoint.copySuccessFeedbackText'),
            }}
          />
        </SectionContainer>
        <Divider sx={{ my: 1 }} />
        <SectionContainer newDesign innerSection title={t('step3.requestBody.title')}>
          <Stack spacing={2}>
            <InformationContainer
              label={t('step3.requestBody.clientIdField.label')}
              content={clientId}
              copyToClipboard={{
                value: clientId,
                tooltipTitle: t('step3.requestBody.clientIdField.copySuccessFeedbackText'),
              }}
            />
            <InformationContainer
              label={t('step3.requestBody.clientAssertionField.label')}
              content={t('step3.requestBody.clientAssertionField.suggestionLabel')}
            />

            <InformationContainer
              label={t('step3.requestBody.clientAssertionTypeField.label')}
              labelDescription={t('step3.requestBody.clientAssertionTypeField.description')}
              content={CLIENT_ASSERTION_TYPE}
              copyToClipboard={{
                value: CLIENT_ASSERTION_TYPE,
                tooltipTitle: t(
                  'step3.requestBody.clientAssertionTypeField.copySuccessFeedbackText'
                ),
              }}
            />
            <InformationContainer
              label={t('step3.requestBody.grantTypeField.label')}
              labelDescription={t('step3.requestBody.grantTypeField.description')}
              content={GRANT_TYPE}
              copyToClipboard={{
                value: GRANT_TYPE,
                tooltipTitle: t('step3.requestBody.grantTypeField.copySuccessFeedbackText'),
              }}
            />
          </Stack>
        </SectionContainer>
      </SectionContainer>

      <SectionContainer newDesign title={t('step3.voucherScript.title')}>
        <Typography>
          <Trans
            components={{
              1: <MUILink href="https://formulae.brew.sh/formula/curl" target="_blank" />,
            }}
          >
            {t('step3.voucherScript.guide')}
          </Trans>
        </Typography>
        <CodeSnippetPreview
          sx={{ mt: 2 }}
          title={t('step3.voucherScript.exampleLabel')}
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
          {t('step3.debugVoucherAlert.description')}{' '}
          <Link to={'SUBSCRIBE_DEBUG_VOUCHER'}>{t('step3.debugVoucherAlert.link.label')}</Link>
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
