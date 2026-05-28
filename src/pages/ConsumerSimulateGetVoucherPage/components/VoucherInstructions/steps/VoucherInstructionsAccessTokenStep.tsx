import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { StepActions } from '@/components/shared/StepActions'
import {
  AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
  AUTHORIZATION_SERVER_TOKEN_CREATION_ASYNC_URL,
  FE_URL,
  PUBLIC_URL,
} from '@/config/env'
import { Typography, Link as MUILink, Grid } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { CodeSnippetPreview } from '../CodeSnippetPreview'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useSearchParams } from 'react-router-dom'
import { VerticalInformationContainer } from '@/components/shared/VerticalInformationContainer'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { IconLink } from '@/components/shared/IconLink'
import type { MemberType } from '../VoucherInstructionsGeneralForm'
import {
  INTERACTION_TYPE,
  type InteractionType,
  MEMBER_TYPE,
  VOUCHER_TYPE,
  type VoucherType,
} from '../VoucherInstructionsGeneralForm'
import { useGeneratePath } from '@/router'

const CLIENT_ASSERTION_TYPE = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
const GRANT_TYPE = 'client_credentials'

export const VoucherInstructionsAccessTokenStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const [searchParams] = useSearchParams()
  const generatePath = useGeneratePath()

  const { goToPreviousStep, goToNextStep } = useVoucherInstructionsContext()

  const clientId = searchParams.get('clientId') || ''
  const producerKeychainId = searchParams.get('producerKeychainId') || ''
  const voucherType = (searchParams.get('voucherType') as VoucherType) || ''
  const interactionType = (searchParams.get('interactionType') as InteractionType) || ''
  const memberType = (searchParams.get('memberType') as MemberType) || ''

  const authEndpointUrl =
    interactionType === INTERACTION_TYPE.SYNC
      ? AUTHORIZATION_SERVER_TOKEN_CREATION_URL
      : AUTHORIZATION_SERVER_TOKEN_CREATION_ASYNC_URL

  const getFilePath = () => {
    if (!interactionType || !voucherType) return ''

    const base = `${FE_URL}/data/it`

    return `${base}/session-token/session_token_curl_${interactionType.toLowerCase()}_${voucherType.toLowerCase()}.txt`
  }

  const subscribeDebugVoucherPath = generatePath('SUBSCRIBE_DEBUG_VOUCHER')

  return (
    <>
      <SectionContainer
        title={t('accessTokenStep.title')}
        description={t('accessTokenStep.description')}
      >
        <SectionContainer variant="outlined" title={t('accessTokenStep.authEndpoint.title')}>
          <Grid container columnSpacing={4.5} rowSpacing={3}>
            <VerticalInformationContainer
              label={t('accessTokenStep.authEndpoint.url.label')}
              labelDescription={t('accessTokenStep.authEndpoint.url.description')}
              content={authEndpointUrl}
              copyToClipboard={{
                value: authEndpointUrl,
                tooltipTitle: t('accessTokenStep.authEndpoint.url.copySuccessFeedbackText'),
              }}
            />
          </Grid>
        </SectionContainer>
        {voucherType === VOUCHER_TYPE.DPOP && (
          <SectionContainer variant="outlined" title={t('accessTokenStep.requestDPoPHeader.title')}>
            <Grid container columnSpacing={4.5} rowSpacing={3}>
              <VerticalInformationContainer
                label={t('accessTokenStep.requestDPoPHeader.dPoP.label')}
                labelDescription={t('accessTokenStep.requestDPoPHeader.dPoP.description')}
                content={t('accessTokenStep.requestDPoPHeader.dPoP.suggestionLabel')}
              />
            </Grid>
          </SectionContainer>
        )}
        <SectionContainer
          variant="outlined"
          title={
            voucherType === VOUCHER_TYPE.BEARER
              ? t('accessTokenStep.requestBody.title.bearer')
              : t('accessTokenStep.requestBody.title.dpop')
          }
        >
          <Grid container columnSpacing={4.5} rowSpacing={3}>
            {memberType === MEMBER_TYPE.PRODUCER ? (
              <VerticalInformationContainer
                label={t('accessTokenStep.requestBody.producerKeychainId.label')}
                labelDescription={t('accessTokenStep.requestBody.producerKeychainId.description')}
                content={producerKeychainId}
                copyToClipboard={{
                  value: producerKeychainId,
                  tooltipTitle: t(
                    'accessTokenStep.requestBody.producerKeychainId.copySuccessFeedbackText'
                  ),
                }}
              />
            ) : (
              <VerticalInformationContainer
                label={t('accessTokenStep.requestBody.clientIdField.label')}
                labelDescription={t('accessTokenStep.requestBody.clientIdField.description')}
                content={clientId}
                copyToClipboard={{
                  value: clientId,
                  tooltipTitle: t(
                    'accessTokenStep.requestBody.clientIdField.copySuccessFeedbackText'
                  ),
                }}
              />
            )}
            <VerticalInformationContainer
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
            <VerticalInformationContainer
              label={t('accessTokenStep.requestBody.clientAssertionField.label')}
              labelDescription={t('accessTokenStep.requestBody.clientAssertionField.description')}
              content={t('accessTokenStep.requestBody.clientAssertionField.suggestionLabel')}
            />
            <VerticalInformationContainer
              label={t('accessTokenStep.requestBody.grantTypeField.label')}
              labelDescription={t('accessTokenStep.requestBody.grantTypeField.description')}
              content={GRANT_TYPE}
              copyToClipboard={{
                value: GRANT_TYPE,
                tooltipTitle: t(
                  'accessTokenStep.requestBody.grantTypeField.copySuccessFeedbackText'
                ),
              }}
            />
          </Grid>
        </SectionContainer>
      </SectionContainer>
      <SectionContainer title={t('accessTokenStep.voucherScript.title')}>
        <Typography variant="body2">
          <Trans
            components={{
              1: <MUILink href="https://formulae.brew.sh/formula/curl" target="_blank" />,
            }}
          >
            {voucherType === VOUCHER_TYPE.BEARER
              ? t('accessTokenStep.voucherScript.guide.bearer')
              : t('accessTokenStep.voucherScript.guide.dpop')}
          </Trans>
        </Typography>
        <CodeSnippetPreview
          sx={{ mt: 2 }}
          title={t('accessTokenStep.voucherScript.exampleLabel')}
          activeLang="curl"
          entries={[{ url: getFilePath(), value: 'curl' }]}
          scriptSubstitutionValues={{
            AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
            AUTHORIZATION_SERVER_TOKEN_CREATION_ASYNC_URL,
            CLIENT_ID: clientId,
            CLIENT_ASSERTION_TYPE: CLIENT_ASSERTION_TYPE,
            GRANT_TYPE: GRANT_TYPE,
          }}
        />
        <IconLink
          endIcon={<OpenInNewIcon fontSize="small" />}
          href={PUBLIC_URL + subscribeDebugVoucherPath}
          target="_blank"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {t('accessTokenStep.debugVoucherLink')}
        </IconLink>
      </SectionContainer>
      <StepActions
        back={{
          label: t('backBtn'),
          type: 'button',
          onClick: goToPreviousStep,
          startIcon: <ArrowBackIcon />,
        }}
        secondaryAction={{
          label: t('firstDPoPProofStep.navigateToDebugButton.label'),
          type: 'link',
          to: 'SUBSCRIBE_DEBUG_VOUCHER',
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
