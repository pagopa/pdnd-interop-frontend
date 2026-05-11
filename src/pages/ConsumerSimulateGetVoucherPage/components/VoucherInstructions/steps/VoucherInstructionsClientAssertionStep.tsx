import React, { useState } from 'react'
import { Box, Grid, Link, TextField, Typography } from '@mui/material'
import { SectionContainer } from '@/components/layout/containers'
import { Trans, useTranslation } from 'react-i18next'
import { CLIENT_ASSERTION_JWT_AUDIENCE, FE_URL } from '@/config/env'
import { useClientKind } from '@/hooks/useClientKind'
import { CodeSnippetPreview } from '../CodeSnippetPreview'
import { StepActions } from '@/components/shared/StepActions'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useSearchParams } from 'react-router-dom'
import { VerticalInformationContainer } from '@/components/shared/VerticalInformationContainer'
import {
  ASYNC_EXCHANGE_STEP,
  INTERACTION_TYPE,
  MEMBER_TYPE,
} from '../VoucherInstructionsGeneralForm'

const CLIENT_ASSERTION_TYP = 'JWT'
const CLIENT_ASSERTION_ALG = 'RS256'

type AsyncParamKey = 'urlCallback' | 'interactionID' | 'entityNumber'

export const VoucherInstructionsClientAssertionStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const [searchParams] = useSearchParams()

  const [asyncParams, setAsyncParams] = useState<Partial<Record<AsyncParamKey, string>>>({})

  const { goToNextStep, goToPreviousStep } = useVoucherInstructionsContext()

  const purposeId = searchParams.get('purposeId') || ''
  const memberType = searchParams.get('memberType') || ''
  const interactionType = searchParams.get('interactionType') || ''
  const asyncExchangeStep = searchParams.get('asyncExchangeStep') || ''

  const isConsumerOrInterationTypeSync =
    INTERACTION_TYPE.SYNC || memberType === MEMBER_TYPE.CONSUMER

  const clientId =
    searchParams.get(isConsumerOrInterationTypeSync ? 'clientId' : 'producerKeychainId') || ''
  const keyId = searchParams.get(isConsumerOrInterationTypeSync ? 'keyId' : 'publicKeyId') || ''

  const showPurposeId =
    interactionType === INTERACTION_TYPE.SYNC ||
    (interactionType === INTERACTION_TYPE.ASYNC &&
      asyncExchangeStep === ASYNC_EXCHANGE_STEP.START_INTERACTION)

  const asyncFieldConfig =
    asyncExchangeStep === ASYNC_EXCHANGE_STEP.START_INTERACTION
      ? {
          key: 'urlCallback' as const,
          label: t('clientAssertionStep.assertionPayload.urlCallbackField.label'),
          description: t('clientAssertionStep.assertionPayload.urlCallbackField.description'),
        }
      : {
          key: 'interactionID' as const,
          label: t('clientAssertionStep.assertionPayload.interactionIDField.label'),
          description: t('clientAssertionStep.assertionPayload.interactionIDField.description'),
        }

  const handleAsyncParamChanged = (key: AsyncParamKey, value: string) => {
    setAsyncParams((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const JtiField = () => (
    <>
      <Grid item xs={12} md={6}>
        <VerticalInformationContainer
          label={t('clientAssertionStep.assertionPayload.jtiField.label')}
          labelDescription={t('clientAssertionStep.assertionPayload.jtiField.description')}
          content={t('clientAssertionStep.assertionPayload.jtiField.suggestionLabel')}
        />
      </Grid>
      {/* Empty Grid item for this case: https://www.figma.com/design/CpRV3kPvFEWLXGtJUgWeZW/Interop-%E2%80%94-Delivery-FE---QA?node-id=4078-16065&t=RqfS1AkOeuYRe9id-4 */}
      {asyncExchangeStep === ASYNC_EXCHANGE_STEP.START_INTERACTION && (
        <Grid item xs={12} md={6}></Grid>
      )}
    </>
  )

  const asyncScriptSubstitutionValues = {
    ...(asyncParams.urlCallback && {
      INSERISCI_VALORE_URL_CALLBACK: asyncParams.urlCallback,
    }),
    ...(asyncParams.interactionID && {
      INSERISCI_VALORE_INTERACTION_ID: asyncParams.interactionID,
    }),
    ...(asyncParams.entityNumber && {
      INSERISCI_VALORE_ENTITY_NUMBER: asyncParams.entityNumber,
    }),
  }

  const getFileName = () => {
    if (interactionType === INTERACTION_TYPE.SYNC) {
      return clientKind === 'CONSUMER' ? 'create_client_assertion' : 'create_m2m_client_assertion'
    }
    if (interactionType === INTERACTION_TYPE.ASYNC) {
      return `create_async_client_assertion_${asyncExchangeStep}`
    }
    return ''
  }

  const getFilePath = (type: 'script' | 'preview') => {
    const base = `${FE_URL}/data/it`
    const file = getFileName()

    if (!file) return ''

    const ext = type === 'script' ? 'py' : 'txt'

    if (interactionType === INTERACTION_TYPE.SYNC) {
      return `${base}/sync/${type}/${file}.${ext}`
    }

    if (interactionType === INTERACTION_TYPE.ASYNC) {
      return `${base}/async/${type}/${file}.${ext}`
    }

    return ''
  }

  return (
    <>
      <SectionContainer
        title={t('clientAssertionStep.title')}
        description={
          <>
            {t('clientAssertionStep.description.label')}{' '}
            <Link
              href="https://datatracker.ietf.org/doc/html/rfc7521"
              target="_blank"
              rel="noreferrer"
              title={t('clientAssertionStep.description.link.title')}
            >
              {t('clientAssertionStep.description.link.label')}
            </Link>
          </>
        }
      >
        <SectionContainer variant="outlined" title={t('clientAssertionStep.assertionHeader.title')}>
          <Grid container columnSpacing={4.5} rowSpacing={3}>
            <Grid item xs={12}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionHeader.kidField.label')}
                labelDescription={t('clientAssertionStep.assertionHeader.kidField.description')}
                content={keyId}
                copyToClipboard={{
                  value: keyId,
                  tooltipTitle: t(
                    'clientAssertionStep.assertionHeader.kidField.copySuccessFeedbackText'
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionHeader.algField.label')}
                labelDescription={t('clientAssertionStep.assertionHeader.algField.description')}
                content={CLIENT_ASSERTION_ALG}
                copyToClipboard={{
                  value: CLIENT_ASSERTION_ALG,
                  tooltipTitle: t(
                    'clientAssertionStep.assertionHeader.algField.copySuccessFeedbackText'
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionHeader.typField.label')}
                labelDescription={t('clientAssertionStep.assertionHeader.typField.description')}
                content={CLIENT_ASSERTION_TYP}
                copyToClipboard={{
                  value: CLIENT_ASSERTION_TYP,
                  tooltipTitle: t(
                    'clientAssertionStep.assertionHeader.typField.copySuccessFeedbackText'
                  ),
                }}
              />
            </Grid>
          </Grid>
        </SectionContainer>
        <SectionContainer
          variant="outlined"
          title={t('clientAssertionStep.assertionPayload.title')}
        >
          <Grid container spacing={4.5}>
            <Grid item xs={12} md={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionPayload.issField.label')}
                labelDescription={t('clientAssertionStep.assertionPayload.issField.description')}
                content={clientId}
                copyToClipboard={{
                  value: clientId,
                  tooltipTitle: t(
                    'clientAssertionStep.assertionPayload.issField.copySuccessFeedbackText'
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionPayload.subField.label')}
                labelDescription={t('clientAssertionStep.assertionPayload.subField.description')}
                content={clientId}
                copyToClipboard={{
                  value: clientId,
                  tooltipTitle: t(
                    'clientAssertionStep.assertionPayload.subField.copySuccessFeedbackText'
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionPayload.audField.label')}
                labelDescription={t('clientAssertionStep.assertionPayload.audField.description')}
                content={CLIENT_ASSERTION_JWT_AUDIENCE}
                copyToClipboard={{
                  value: CLIENT_ASSERTION_JWT_AUDIENCE,
                  tooltipTitle: t(
                    'clientAssertionStep.assertionPayload.audField.copySuccessFeedbackText'
                  ),
                }}
              />
            </Grid>
            {clientKind === 'CONSUMER' && Boolean(purposeId) && showPurposeId && (
              <Grid item xs={12} md={6}>
                <VerticalInformationContainer
                  label={t('clientAssertionStep.assertionPayload.purposeIdField.label')}
                  labelDescription={t(
                    'clientAssertionStep.assertionPayload.purposeIdField.description'
                  )}
                  content={purposeId}
                  copyToClipboard={{
                    value: purposeId,
                    tooltipTitle: t(
                      'clientAssertionStep.assertionPayload.purposeIdField.copySuccessFeedbackText'
                    ),
                  }}
                />
              </Grid>
            )}
            {asyncExchangeStep !== ASYNC_EXCHANGE_STEP.START_INTERACTION && <JtiField />}
            {interactionType === INTERACTION_TYPE.ASYNC && (
              <>
                <Grid
                  item
                  xs={asyncExchangeStep === ASYNC_EXCHANGE_STEP.CALLBACK_INVOCATION ? 12 : 6}
                >
                  <VerticalInformationContainer
                    label={t('clientAssertionStep.assertionPayload.scope.label')}
                    labelDescription={t('clientAssertionStep.assertionPayload.scope.description')}
                    content={asyncExchangeStep}
                    copyToClipboard={{
                      value: asyncExchangeStep,
                      tooltipTitle: t(
                        'clientAssertionStep.assertionPayload.purposeIdField.copySuccessFeedbackText'
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    sx={{ my: 0, width: '100%', flexShrink: 1 }}
                    size="small"
                    name={asyncFieldConfig.key}
                    label={asyncFieldConfig.label}
                    helperText={asyncFieldConfig.description}
                    value={asyncParams[asyncFieldConfig.key] ?? ''}
                    onChange={(e) => handleAsyncParamChanged(asyncFieldConfig.key, e.target.value)}
                  />
                </Grid>
                {asyncExchangeStep === ASYNC_EXCHANGE_STEP.CALLBACK_INVOCATION && (
                  <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      sx={{ my: 0, width: '100%', flexShrink: 1 }}
                      size="small"
                      name="entityNumber"
                      label={t('clientAssertionStep.assertionPayload.entityNumberField.label')}
                      helperText={t(
                        'clientAssertionStep.assertionPayload.entityNumberField.description'
                      )}
                      value={asyncParams.entityNumber ?? ''}
                      onChange={(e) => handleAsyncParamChanged('entityNumber', e.target.value)}
                    />
                  </Grid>
                )}
              </>
            )}
            {asyncExchangeStep === ASYNC_EXCHANGE_STEP.START_INTERACTION && <JtiField />}
            <Grid item xs={12} md={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionPayload.iatField.label')}
                labelDescription={t('clientAssertionStep.assertionPayload.iatField.description')}
                content={t('clientAssertionStep.assertionPayload.iatField.suggestionLabel')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionPayload.expField.label')}
                labelDescription={t('clientAssertionStep.assertionPayload.expField.description')}
                content={t('clientAssertionStep.assertionPayload.expField.suggestionLabel')}
              />
            </Grid>
          </Grid>
        </SectionContainer>
      </SectionContainer>
      <SectionContainer title={t('clientAssertionStep.assertionScript.title')}>
        <Box sx={{ pl: 2 }} component="ol">
          <Typography component="li" variant="body2">
            {t('clientAssertionStep.assertionScript.steps.1')}
          </Typography>
          <Typography component="li" variant="body2">
            <Trans components={{ 1: <Link download href={getFilePath('script')} /> }}>
              {t('clientAssertionStep.assertionScript.steps.2', {
                filename: `${getFileName()}.py`,
              })}
            </Trans>
          </Typography>
          <Typography component="li" variant="body2" sx={{ whiteSpace: 'break-spaces' }}>
            {t('clientAssertionStep.assertionScript.steps.3')}
          </Typography>
          <Typography component="li" variant="body2">
            {t('clientAssertionStep.assertionScript.steps.4')}
          </Typography>
          <Typography component="li" variant="body2">
            {t('clientAssertionStep.assertionScript.steps.5')}
          </Typography>
        </Box>

        <CodeSnippetPreview
          sx={{ mt: 2 }}
          title={t('clientAssertionStep.assertionScript.exampleLabel')}
          activeLang={'python'}
          entries={[
            {
              url: getFilePath('preview'),
              value: 'python',
            },
          ]}
          scriptSubstitutionValues={{
            INSERISCI_VALORE_KID: keyId,
            INSERISCI_VALORE_ALG: CLIENT_ASSERTION_ALG,
            INSERISCI_VALORE_TYP: CLIENT_ASSERTION_TYP,
            INSERISCI_VALORE_ISS: clientId!,
            INSERISCI_VALORE_SUB: clientId!,
            INSERISCI_VALORE_AUD: CLIENT_ASSERTION_JWT_AUDIENCE,
            INSERISCI_VALORE_PUR: purposeId,
            ...asyncScriptSubstitutionValues,
          }}
        />
        <Typography sx={{ mt: 2 }} variant="body2">
          {t('clientAssertionStep.assertionScript.steps.result')}
        </Typography>
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
