import React, { Suspense } from 'react'
import { PurposeQueries } from '@/api/purpose'
import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { RiskAnalysisFormComponents } from '@/components/shared/RiskAnalysisFormComponents'
import useCurrentLanguage from '@/hooks/useCurrentLanguage'
import { useRiskAnalysisForm } from '@/hooks/useRiskAnalysisForm'
import type { RiskAnalysisKind } from '@/types/risk-analysis-form.types'
import { getValidAnswers } from '@/utils/risk-analysis-form.utils'
import { Button, Box, Stack, Alert, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useSuspenseQuery } from '@tanstack/react-query'
import { FormProvider } from 'react-hook-form'
import LoopIcon from '@mui/icons-material/Loop'
import { useRiskAnalysisExporterToolContext } from './RiskAnalysisExporterToolContext'
import { useTranslation } from 'react-i18next' // Import here

export function RiskAnalysisFormStep() {
  const { selectedRiskAnalysisKind } = useRiskAnalysisExporterToolContext()

  return (
    <>
      <RiskAnalysisKindSelectSection />
      <Suspense fallback={<RiskAnalysisToolFormSkeleton />}>
        <RiskAnalysisToolForm key={selectedRiskAnalysisKind} />
      </Suspense>
    </>
  )
}

function RiskAnalysisToolForm() {
  const { t } = useTranslation('developer-tools', {
    keyPrefix: 'riskAnalysisExporterTool.formStep',
  })
  const currentLang = useCurrentLanguage()
  const { selectedRiskAnalysisKind, onRiskAnalysisFormSubmit } =
    useRiskAnalysisExporterToolContext()

  const { data: riskAnalysisConfig } = useSuspenseQuery(
    PurposeQueries.getRiskAnalysisLatest({ tenantKind: selectedRiskAnalysisKind })
  )

  const formMethods = useRiskAnalysisForm({
    riskAnalysisConfig: riskAnalysisConfig,
  })

  const handleSubmit = formMethods.handleSubmit(
    ({ validAnswers }) => {
      onRiskAnalysisFormSubmit(validAnswers, [])
    },
    (errors) => {
      const errorMessages = Object.keys(errors.answers ?? {}).map(
        (id) => riskAnalysisConfig.questions.find((q) => q.id === id)?.label?.[currentLang] ?? id
      )

      const currentAnswers = formMethods.getValues('answers')
      const validAnswers = getValidAnswers(Object.keys(formMethods.questions), currentAnswers)

      onRiskAnalysisFormSubmit(validAnswers, errorMessages)
    }
  )

  return (
    <Box>
      <FormProvider {...formMethods}>
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <RiskAnalysisFormComponents questions={formMethods.questions} />
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button startIcon={<LoopIcon />} variant="contained" type="submit">
              {t('generateCodeButton')}
            </Button>
          </Stack>
        </Box>
      </FormProvider>
    </Box>
  )
}

function RiskAnalysisKindSelectSection() {
  const { t } = useTranslation('developer-tools', {
    keyPrefix: 'riskAnalysisExporterTool.formStep.riskAnalysisSection',
  })
  const { selectedRiskAnalysisKind, tenantRiskAnalysisKind, onRiskAnalysisKindChange } =
    useRiskAnalysisExporterToolContext()

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <FormControl fullWidth>
        <InputLabel id="tenant-kind-select-label">{t('tenantKindLabel')}</InputLabel>
        <Select
          labelId="tenant-kind-select-label"
          id="tenant-kind-select"
          value={selectedRiskAnalysisKind}
          label={t('tenantKindLabel')}
          onChange={(event) => onRiskAnalysisKindChange(event.target.value as RiskAnalysisKind)}
        >
          <MenuItem value={'PA' satisfies RiskAnalysisKind}>
            {t('publicAdministrationOption')}
          </MenuItem>
          <MenuItem value={'PRIVATE' satisfies RiskAnalysisKind}>{t('privateOption')}</MenuItem>
        </Select>
      </FormControl>
      {tenantRiskAnalysisKind !== selectedRiskAnalysisKind && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t('warningAlert')}
        </Alert>
      )}
    </SectionContainer>
  )
}

export function RiskAnalysisToolFormSkeleton() {
  return (
    <>
      <SectionContainerSkeleton height={288} />
      <SectionContainerSkeleton height={190} />
      <SectionContainerSkeleton height={600} />
    </>
  )
}
