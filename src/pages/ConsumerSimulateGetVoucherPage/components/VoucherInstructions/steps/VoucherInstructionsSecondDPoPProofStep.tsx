import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SectionContainer } from '@/components/layout/containers'
import { Grid, FormControl, Alert, Typography, Stack, Button } from '@mui/material'
import { VerticalInformationContainer } from '@/components/shared/VerticalInformationContainer'
import {
  apiV3DocLink,
  CLIENT_ASSERTION_ALG,
  CLIENT_ASSERTION_TYP,
  VOUCHER_SECOND_DPOP_FILENAME,
} from '@/config/constants'
import { RHFSelect, RHFTextField } from '@/components/shared/react-hook-form-inputs'
import { FormProvider, useForm } from 'react-hook-form'
import { VoucherScriptPreviewSection } from '../VoucherScriptPreviewSection'
import { FE_URL } from '@/config/env'
import { CodeSnippetPreview } from '../CodeSnippetPreview'
import { useQuery } from '@tanstack/react-query'
import { PurposeQueries } from '@/api/purpose'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from '@/router'
import { MEMBER_TYPE, type MemberType } from '../VoucherInstructionsGeneralForm'
import { IconLink } from '@/components/shared/IconLink'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { RestartAlt } from '@mui/icons-material'
import { useClientKind } from '@/hooks/useClientKind'

type SecondDpopStepFormValues = {
  htm: string
  htu: string
}

export const VoucherInstructionsSecondDPoPProofStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { goToPreviousStep, resetStepper } = useVoucherInstructionsContext()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const clientKind = useClientKind()

  const purposeId = searchParams.get('purposeId') || ''
  const memberType = (searchParams.get('memberType') as MemberType) || ''

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    enabled: Boolean(purposeId),
  })

  /* @TODO - add condition if async + producer (waiting for bff to return the descriptorId) (https://pagopa.atlassian.net/browse/PIN-10116) */
  const handleNavigateToEservice = () => {
    if (purpose) {
      navigate('PROVIDE_ESERVICE_MANAGE', {
        params: { eserviceId: purpose.eservice.id, descriptorId: purpose.eservice.descriptor.id },
      })
    }
  }

  const htmOptions = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH', 'TRACE']
  const formMethods = useForm<SecondDpopStepFormValues>({
    defaultValues: {
      htm: undefined,
      htu: undefined,
    },
  })

  const htmValue = formMethods.watch('htm')
  const htuValue = formMethods.watch('htu')

  const substitutions = {
    INSERISCI_VALORE_ALG: CLIENT_ASSERTION_ALG,
    INSERISCI_VALORE_TYP: CLIENT_ASSERTION_TYP,
    ...(htmValue && {
      INSERISCI_VALORE_HTM: htmValue,
    }),
    ...(htuValue && {
      INSERISCI_VALORE_HTU: htuValue,
    }),
  }

  const getFilePath = (type: 'script' | 'preview' | 'curl') => {
    const base = `${FE_URL}/data/it`

    const ext = type === 'script' ? 'py' : 'txt'

    return `${base}/dpop/${type}/${VOUCHER_SECOND_DPOP_FILENAME}.${ext}`
  }

  return (
    <>
      <SectionContainer
        title={t('secondDPoPProofStep.title')}
        description={<>{t('secondDPoPProofStep.description')}</>}
      >
        <SectionContainer variant="outlined" title={t('secondDPoPProofStep.assertionHeader.title')}>
          <Grid container columnSpacing={4.5} rowSpacing={3}>
            <VerticalInformationContainer
              label={t('secondDPoPProofStep.assertionHeader.typField.label')}
              labelDescription={t('secondDPoPProofStep.assertionHeader.typField.description')}
              content={CLIENT_ASSERTION_TYP}
              copyToClipboard={{
                value: CLIENT_ASSERTION_TYP,
                tooltipTitle: t(
                  'secondDPoPProofStep.assertionHeader.typField.copySuccessFeedbackText'
                ),
              }}
            />
            <VerticalInformationContainer
              label={t('secondDPoPProofStep.assertionHeader.algField.label')}
              labelDescription={t('secondDPoPProofStep.assertionHeader.algField.description')}
              content={CLIENT_ASSERTION_ALG}
              copyToClipboard={{
                value: CLIENT_ASSERTION_ALG,
                tooltipTitle: t(
                  'secondDPoPProofStep.assertionHeader.algField.copySuccessFeedbackText'
                ),
              }}
            />
            <VerticalInformationContainer
              label={t('secondDPoPProofStep.assertionHeader.jwkField.label')}
              labelDescription={t('secondDPoPProofStep.assertionHeader.jwkField.description')}
              content={t('secondDPoPProofStep.assertionHeader.jwkField.suggestionLabel')}
            />
          </Grid>
        </SectionContainer>
        <SectionContainer
          variant="outlined"
          title={t('secondDPoPProofStep.assertionPayload.title')}
        >
          <Grid container columnSpacing={4.5} rowSpacing={3}>
            <FormProvider {...formMethods}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <RHFSelect
                    name="htm"
                    label={t('secondDPoPProofStep.assertionPayload.htmField.label')}
                    infoLabel={t('secondDPoPProofStep.assertionPayload.htmField.description')}
                    options={htmOptions.map((value) => ({ label: value, value }))}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <RHFTextField
                    name="htu"
                    label={t('secondDPoPProofStep.assertionPayload.htuField.label')}
                    infoLabel={t('secondDPoPProofStep.assertionPayload.htuField.description')}
                  />
                </FormControl>
              </Grid>
            </FormProvider>
            <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <Alert severity="info" variant="outlined" sx={{ width: '100%', mb: 1.5 }}>
                {t('secondDPoPProofStep.assertionPayload.alert')}
              </Alert>
            </Grid>
            <VerticalInformationContainer
              label={t('secondDPoPProofStep.assertionPayload.athField.label')}
              labelDescription={t('secondDPoPProofStep.assertionPayload.athField.description')}
              content={t('secondDPoPProofStep.assertionPayload.athField.suggestionLabel')}
              gridProps={{ md: 12 }}
            />
            <VerticalInformationContainer
              label={t('secondDPoPProofStep.assertionPayload.jtiField.label')}
              labelDescription={t('secondDPoPProofStep.assertionPayload.jtiField.description')}
              content={t('secondDPoPProofStep.assertionPayload.jtiField.suggestionLabel')}
            />
            <VerticalInformationContainer
              label={t('secondDPoPProofStep.assertionPayload.iatField.label')}
              labelDescription={t('secondDPoPProofStep.assertionPayload.iatField.description')}
              content={t('secondDPoPProofStep.assertionPayload.iatField.suggestionLabel')}
            />
          </Grid>
        </SectionContainer>
      </SectionContainer>
      <VoucherScriptPreviewSection
        fileUrl={getFilePath('script')}
        previewUrl={getFilePath('preview')}
        fileName={VOUCHER_SECOND_DPOP_FILENAME}
        keyPrefix="secondDPoPProofStep"
        substitutions={substitutions}
      />
      {clientKind === 'API' && (
        <SectionContainer
          title={t('secondDPoPProofStep.pdndInteroperability.title')}
          description={t('secondDPoPProofStep.pdndInteroperability.description')}
        >
          <Stack direction="row" sx={{ pt: 1, pb: 3 }} alignItems="center">
            <Stack direction="column" justifyContent="space-between" gap={1} sx={{ mr: 3 }}>
              <Typography variant="body2" fontWeight={600}>
                {t('secondDPoPProofStep.pdndInteroperability.apiV3.title')}
              </Typography>
              <Typography variant="body2">
                {t('secondDPoPProofStep.pdndInteroperability.apiV3.description')}
              </Typography>
            </Stack>
            <IconLink
              endIcon={<OpenInNewIcon fontSize="small" />}
              href={apiV3DocLink}
              target="_blank"
              sx={{
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {t('secondDPoPProofStep.pdndInteroperability.actionLabel')}
            </IconLink>
          </Stack>
        </SectionContainer>
      )}
      <SectionContainer
        title={
          clientKind === 'CONSUMER'
            ? t('secondDPoPProofStep.exampleRequest.title.eservice')
            : t('secondDPoPProofStep.exampleRequest.title.pdnd')
        }
      >
        <Typography variant="body2">
          {t('secondDPoPProofStep.exampleRequest.description')}
        </Typography>
        <CodeSnippetPreview
          sx={{ mt: 2 }}
          activeLang="curl"
          entries={[{ url: getFilePath('curl'), value: 'curl' }]}
        />
        {clientKind === 'CONSUMER' && (
          <Alert variant="outlined" severity="warning" sx={{ mt: 2 }}>
            <Stack direction="row">
              <Typography variant="body2">
                {t('secondDPoPProofStep.exampleRequest.alert.title')}
              </Typography>
              {/* @TODO remove this condition when the bff will return the descriptorId for the redirect (https://pagopa.atlassian.net/browse/PIN-10116) */}
              {memberType !== MEMBER_TYPE.PRODUCER && (
                <Button sx={{ whiteSpace: 'nowrap' }} onClick={() => handleNavigateToEservice()}>
                  {t('secondDPoPProofStep.exampleRequest.alert.actionLabel')}
                </Button>
              )}
            </Stack>
          </Alert>
        )}
      </SectionContainer>
      <StepActions
        back={{
          label: t('backBtn'),
          type: 'button',
          onClick: goToPreviousStep,
          startIcon: <ArrowBackIcon />,
        }}
        forward={{
          label: t('newSimulationBtn'),
          type: 'button',
          onClick: resetStepper,
          endIcon: <RestartAlt />,
        }}
      />
    </>
  )
}
