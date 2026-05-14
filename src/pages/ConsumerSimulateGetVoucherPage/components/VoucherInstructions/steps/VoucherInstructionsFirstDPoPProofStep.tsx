import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { SectionContainer } from '@/components/layout/containers'
import { Grid } from '@mui/material'
import { VerticalInformationContainer } from '@/components/shared/VerticalInformationContainer'
import { AUTHORIZATION_SERVER_TOKEN_CREATION_URL, FE_URL } from '@/config/env'
import { VoucherScriptPreviewSection } from '../VoucherScriptPreviewSection'
import {
  CLIENT_ASSERTION_ALG,
  CLIENT_ASSERTION_HTM,
  CLIENT_ASSERTION_TYP,
  VOUCHER_FIRST_DPOP_FILENAME,
} from '@/config/constants'

export const VoucherInstructionsFirstDPoPProofStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { goToPreviousStep, goToNextStep } = useVoucherInstructionsContext()

  const getFilePath = (type: 'script' | 'preview') => {
    const base = `${FE_URL}/data/it`

    const ext = type === 'script' ? 'py' : 'txt'

    return `${base}/dpop/${type}/${VOUCHER_FIRST_DPOP_FILENAME}.${ext}`
  }

  return (
    <SectionContainer
      title={t('firstDPoPProofStep.title')}
      description={<>{t('firstDPoPProofStep.description')}</>}
    >
      <SectionContainer variant="outlined" title={t('firstDPoPProofStep.assertionHeader.title')}>
        <Grid container columnSpacing={4.5} rowSpacing={3}>
          <VerticalInformationContainer
            label={t('firstDPoPProofStep.assertionHeader.typField.label')}
            labelDescription={t('firstDPoPProofStep.assertionHeader.typField.description')}
            content={CLIENT_ASSERTION_TYP}
            copyToClipboard={{
              value: CLIENT_ASSERTION_TYP,
              tooltipTitle: t(
                'firstDPoPProofStep.assertionHeader.typField.copySuccessFeedbackText'
              ),
            }}
          />
          <VerticalInformationContainer
            label={t('firstDPoPProofStep.assertionHeader.algField.label')}
            labelDescription={t('firstDPoPProofStep.assertionHeader.algField.description')}
            content={CLIENT_ASSERTION_ALG}
            copyToClipboard={{
              value: CLIENT_ASSERTION_ALG,
              tooltipTitle: t(
                'firstDPoPProofStep.assertionHeader.algField.copySuccessFeedbackText'
              ),
            }}
          />
          <VerticalInformationContainer
            label={t('firstDPoPProofStep.assertionHeader.jwkField.label')}
            labelDescription={t('firstDPoPProofStep.assertionHeader.jwkField.description')}
            content={t('firstDPoPProofStep.assertionHeader.jwkField.suggestionLabel')}
          />
        </Grid>
      </SectionContainer>
      <SectionContainer variant="outlined" title={t('firstDPoPProofStep.assertionPayload.title')}>
        <Grid container columnSpacing={4.5} rowSpacing={3}>
          <VerticalInformationContainer
            label={t('firstDPoPProofStep.assertionPayload.htmField.label')}
            labelDescription={t('firstDPoPProofStep.assertionPayload.htmField.description')}
            content={CLIENT_ASSERTION_HTM}
            copyToClipboard={{
              value: CLIENT_ASSERTION_HTM,
              tooltipTitle: t(
                'firstDPoPProofStep.assertionPayload.htmField.copySuccessFeedbackText'
              ),
            }}
          />
          <VerticalInformationContainer
            label={t('firstDPoPProofStep.assertionPayload.htuField.label')}
            labelDescription={t('firstDPoPProofStep.assertionPayload.htuField.description')}
            content={AUTHORIZATION_SERVER_TOKEN_CREATION_URL}
            copyToClipboard={{
              value: AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
              tooltipTitle: t(
                'firstDPoPProofStep.assertionPayload.htuField.copySuccessFeedbackText'
              ),
            }}
          />
          <VerticalInformationContainer
            label={t('firstDPoPProofStep.assertionPayload.jtiField.label')}
            labelDescription={t('firstDPoPProofStep.assertionPayload.jtiField.description')}
            content={t('firstDPoPProofStep.assertionPayload.jtiField.suggestionLabel')}
          />
          <VerticalInformationContainer
            label={t('firstDPoPProofStep.assertionPayload.iatField.label')}
            labelDescription={t('firstDPoPProofStep.assertionPayload.iatField.description')}
            content={t('firstDPoPProofStep.assertionPayload.iatField.suggestionLabel')}
          />
        </Grid>
      </SectionContainer>
      <VoucherScriptPreviewSection
        fileUrl={getFilePath('script')}
        previewUrl={getFilePath('preview')}
        fileName={VOUCHER_FIRST_DPOP_FILENAME}
        substitutions={{
          INSERISCI_VALORE_ALG: CLIENT_ASSERTION_ALG,
          INSERISCI_VALORE_TYP: CLIENT_ASSERTION_TYP,
          INSERISCI_VALORE_HTM: CLIENT_ASSERTION_HTM,
          INSERISCI_VALORE_HTU: AUTHORIZATION_SERVER_TOKEN_CREATION_URL,
        }}
      />
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
    </SectionContainer>
  )
}
