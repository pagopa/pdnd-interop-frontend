import React from 'react'
import { Box, Grid, Link, Typography } from '@mui/material'
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

const CLIENT_ASSERTION_TYP = 'JWT'
const CLIENT_ASSERTION_ALG = 'RS256'

export const VoucherInstructionsClientAssertionStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()
  const [searchParams] = useSearchParams()

  const { goToNextStep, goToPreviousStep } = useVoucherInstructionsContext()

  const clientId = searchParams.get('clientId') || ''
  const purposeId = searchParams.get('purposeId') || ''
  const keyId = searchParams.get('keyId') || ''

  const filename =
    clientKind === 'CONSUMER' ? 'create_client_assertion.py' : 'create_m2m_client_assertion.py'

  const downloadUrl = `${FE_URL}/data/it/${filename}`

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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            {clientKind === 'CONSUMER' && Boolean(purposeId) && (
              <Grid item xs={6}>
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
            <Grid item xs={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionPayload.jtiField.label')}
                labelDescription={t('clientAssertionStep.assertionPayload.jtiField.description')}
                content={t('clientAssertionStep.assertionPayload.jtiField.suggestionLabel')}
              />
            </Grid>
            <Grid item xs={6}>
              <VerticalInformationContainer
                label={t('clientAssertionStep.assertionPayload.iatField.label')}
                labelDescription={t('clientAssertionStep.assertionPayload.iatField.description')}
                content={t('clientAssertionStep.assertionPayload.iatField.suggestionLabel')}
              />
            </Grid>
            <Grid item xs={6}>
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
            <Trans components={{ 1: <Link download href={downloadUrl} /> }}>
              {t('clientAssertionStep.assertionScript.steps.2', { filename })}
            </Trans>
          </Typography>
          <Typography component="li" variant="body2">
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
              url: `${FE_URL}/data/it/${
                clientKind === 'CONSUMER' ? 'voucher-python-invoke' : 'voucher-python-m2m-invoke'
              }.txt`,
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
