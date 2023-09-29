import React from 'react'
import { Box, Link, Stack, Typography } from '@mui/material'
import { SectionContainer } from '@/components/layout/containers'
import { Trans, useTranslation } from 'react-i18next'
import { CLIENT_ASSERTION_JWT_AUDIENCE, FE_URL } from '@/config/env'
import { useClientKind } from '@/hooks/useClientKind'
import { CodeSnippetPreview } from './CodeSnippetPreview'
import { StepActions } from '@/components/shared/StepActions'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useVoucherInstructionsContext } from './VoucherInstructionsContext'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const CLIENT_ASSERTION_TYP = 'JWT'
const CLIENT_ASSERTION_ALG = 'RS256'

export const VoucherInstructionsStep2: React.FC = () => {
  const { t } = useTranslation('voucher')
  const clientKind = useClientKind()

  const { selectedPurposeId, selectedKeyId, clientId, goToNextStep, goToPreviousStep } =
    useVoucherInstructionsContext()

  const filename =
    clientKind === 'CONSUMER' ? 'create_client_assertion.py' : 'create_m2m_client_assertion.py'

  const downloadUrl = `${FE_URL}/data/it/${filename}`

  return (
    <>
      <SectionContainer
        newDesign
        title={t('step2.title')}
        description={
          <>
            {t('step2.description.label')}{' '}
            <Link
              href="https://datatracker.ietf.org/doc/html/rfc7521"
              target="_blank"
              rel="noreferrer"
              title={t('step2.description.link.title')}
            >
              {t('step2.description.link.label')}
            </Link>
          </>
        }
      >
        <SectionContainer newDesign innerSection title={t('step2.assertionHeader.title')}>
          <Stack spacing={4}>
            <InformationContainer
              label={t('step2.assertionHeader.kidField.label')}
              labelDescription={t('step2.assertionHeader.kidField.description')}
              content={selectedKeyId!}
              copyToClipboard={{
                value: selectedKeyId!,
                tooltipTitle: t('step2.assertionHeader.kidField.copySuccessFeedbackText'),
              }}
            />

            <InformationContainer
              label={t('step2.assertionHeader.algField.label')}
              labelDescription={t('step2.assertionHeader.algField.description')}
              content={CLIENT_ASSERTION_ALG}
              copyToClipboard={{
                value: CLIENT_ASSERTION_ALG,
                tooltipTitle: t('step2.assertionHeader.algField.copySuccessFeedbackText'),
              }}
            />

            <InformationContainer
              label={t('step2.assertionHeader.typField.label')}
              labelDescription={t('step2.assertionHeader.typField.description')}
              content={CLIENT_ASSERTION_TYP}
              copyToClipboard={{
                value: CLIENT_ASSERTION_TYP,
                tooltipTitle: t('step2.assertionHeader.typField.copySuccessFeedbackText'),
              }}
            />
          </Stack>
        </SectionContainer>
        <SectionContainer newDesign innerSection title={t('step2.assertionPayload.title')}>
          <Stack spacing={4}>
            <InformationContainer
              label={t('step2.assertionPayload.issField.label')}
              labelDescription={t('step2.assertionPayload.issField.description')}
              content={clientId}
              copyToClipboard={{
                value: clientId,
                tooltipTitle: t('step2.assertionPayload.issField.copySuccessFeedbackText'),
              }}
            />

            <InformationContainer
              label={t('step2.assertionPayload.subField.label')}
              labelDescription={t('step2.assertionPayload.subField.description')}
              content={clientId}
              copyToClipboard={{
                value: clientId,
                tooltipTitle: t('step2.assertionPayload.subField.copySuccessFeedbackText'),
              }}
            />
            <InformationContainer
              label={t('step2.assertionPayload.audField.label')}
              labelDescription={t('step2.assertionPayload.audField.description')}
              content={CLIENT_ASSERTION_JWT_AUDIENCE}
              copyToClipboard={{
                value: CLIENT_ASSERTION_JWT_AUDIENCE,
                tooltipTitle: t('step2.assertionPayload.audField.copySuccessFeedbackText'),
              }}
            />
            {clientKind === 'CONSUMER' && selectedPurposeId && (
              <InformationContainer
                label={t('step2.assertionPayload.purposeIdField.label')}
                labelDescription={t('step2.assertionPayload.purposeIdField.description')}
                content={selectedPurposeId}
                copyToClipboard={{
                  value: selectedPurposeId,
                  tooltipTitle: t('step2.assertionPayload.purposeIdField.copySuccessFeedbackText'),
                }}
              />
            )}
            <InformationContainer
              label={t('step2.assertionPayload.jtiField.label')}
              labelDescription={t('step2.assertionPayload.jtiField.description')}
              content={t('step2.assertionPayload.jtiField.suggestionLabel')}
            />
            <InformationContainer
              label={t('step2.assertionPayload.iatField.label')}
              labelDescription={t('step2.assertionPayload.iatField.description')}
              content={t('step2.assertionPayload.iatField.suggestionLabel')}
            />
            <InformationContainer
              label={t('step2.assertionPayload.expField.label')}
              labelDescription={t('step2.assertionPayload.expField.description')}
              content={t('step2.assertionPayload.expField.suggestionLabel')}
            />
          </Stack>
        </SectionContainer>
      </SectionContainer>
      <SectionContainer newDesign title={t('step2.assertionScript.title')}>
        <Box sx={{ pl: 2 }} component="ol">
          <Typography component="li">{t('step2.assertionScript.steps.1')}</Typography>
          <Typography component="li">
            <Trans components={{ 1: <Link download href={downloadUrl} /> }}>
              {t('step2.assertionScript.steps.2', { filename })}
            </Trans>
          </Typography>
          <Typography component="li">{t('step2.assertionScript.steps.3')}</Typography>
          <Typography component="li">{t('step2.assertionScript.steps.4')}</Typography>
          <Typography component="li">{t('step2.assertionScript.steps.5')}</Typography>
        </Box>

        <CodeSnippetPreview
          sx={{ mt: 2 }}
          title={t('step2.assertionScript.exampleLabel')}
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
            INSERISCI_VALORE_KID: selectedKeyId!,
            INSERISCI_VALORE_ALG: CLIENT_ASSERTION_ALG,
            INSERISCI_VALORE_TYP: CLIENT_ASSERTION_TYP,
            INSERISCI_VALORE_ISS: clientId,
            INSERISCI_VALORE_SUB: clientId,
            INSERISCI_VALORE_AUD: CLIENT_ASSERTION_JWT_AUDIENCE,
            INSERISCI_VALORE_PUR: selectedPurposeId ?? '',
          }}
        />
        <Typography>{t('step2.assertionScript.steps.result')}</Typography>
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
