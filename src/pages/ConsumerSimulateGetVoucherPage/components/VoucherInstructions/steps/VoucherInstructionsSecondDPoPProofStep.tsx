import React from 'react'
import { StepActions } from '@/components/shared/StepActions'
import { useTranslation } from 'react-i18next'
import { useVoucherInstructionsContext } from '../VoucherInstructionsContext'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { SectionContainer } from '@/components/layout/containers'
import { Grid, FormControl, Alert, Typography, Stack, Button } from '@mui/material'
import { VerticalInformationContainer } from '@/components/shared/VerticalInformationContainer'
import {
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
import { RestartAlt } from '@mui/icons-material'
import { useClientKind } from '@/hooks/useClientKind'
import { DPoPAssertionHeader } from '../DPoPAssertionHeader'
import { ApiVersionSummary } from '../ApiVersionSummary'

type SecondDpopStepFormValues = {
  htm: string
  htu: string
}

const HTM_OPTIONS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH', 'TRACE']

export const VoucherInstructionsSecondDPoPProofStep: React.FC = () => {
  const { t } = useTranslation('voucher')
  const { goToPreviousStep, resetStepper } = useVoucherInstructionsContext()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const clientKind = useClientKind()
  const guidanceKind = clientKind === 'API' ? 'pdnd' : 'eservice'

  const purposeId = searchParams.get('purposeId') || ''
  const memberType = (searchParams.get('memberType') as MemberType) || ''

  const { data: purpose } = useQuery({
    ...PurposeQueries.getSingle(purposeId),
    enabled: Boolean(purposeId),
  })

  const handleNavigateToEservice = () => {
    if (purpose) {
      navigate('SUBSCRIBE_CATALOG_VIEW', {
        params: { eserviceId: purpose.eservice.id, descriptorId: purpose.eservice.descriptor.id },
      })
    }
  }

  const formMethods = useForm<SecondDpopStepFormValues>({
    defaultValues: {
      htm: '',
      htu: '',
    },
  })

  const htmValue = formMethods.watch('htm')
  const htuValue = formMethods.watch('htu')

  const substitutions = {
    INSERISCI_VALORE_ALG: CLIENT_ASSERTION_ALG,
    INSERISCI_VALORE_TYP: CLIENT_ASSERTION_TYP,
    ...(htmValue && {
      METHOD_API_INVOCATA: htmValue,
    }),
    ...(htuValue && {
      PATH_API_INVOCATA: htuValue,
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
        <DPoPAssertionHeader keyPrefix="secondDPoPProofStep" />
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
                    infoLabel={t(
                      `secondDPoPProofStep.assertionPayload.htmField.description.${guidanceKind}`
                    )}
                    options={HTM_OPTIONS.map((value) => ({ label: value, value }))}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <RHFTextField
                    name="htu"
                    label={t('secondDPoPProofStep.assertionPayload.htuField.label')}
                    infoLabel={t(
                      `secondDPoPProofStep.assertionPayload.htuField.description.${guidanceKind}`
                    )}
                  />
                </FormControl>
              </Grid>
            </FormProvider>
            <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <Alert severity="info" variant="outlined" sx={{ width: '100%', mb: 1.5 }}>
                {t(`secondDPoPProofStep.assertionPayload.alert.${guidanceKind}`)}
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
      {clientKind === 'API' && <ApiVersionSummary keyPrefix="secondDPoPProofStep" hideV2 />}
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
          scriptSubstitutionValues={substitutions}
        />
        {clientKind === 'CONSUMER' && memberType !== MEMBER_TYPE.PRODUCER && (
          <Alert variant="outlined" severity="warning" sx={{ mt: 2 }}>
            <Stack direction="row">
              <Typography variant="body2">
                {t('secondDPoPProofStep.exampleRequest.alert.title')}
              </Typography>
              <Button sx={{ whiteSpace: 'nowrap' }} onClick={() => handleNavigateToEservice()}>
                {t('secondDPoPProofStep.exampleRequest.alert.actionLabel')}
              </Button>
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
