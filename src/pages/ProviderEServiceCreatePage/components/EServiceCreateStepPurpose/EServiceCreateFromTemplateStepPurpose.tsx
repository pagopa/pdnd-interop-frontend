import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Button, Stack } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { FormProvider, useForm } from 'react-hook-form'
import { StepActions } from '@/components/shared/StepActions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { RiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'

type RiskAnalysisValue = { label: string; value: string }

export const EServiceCreateFromTemplateStepPurpose: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { t: tCommon } = useTranslation('common')

  const { descriptor, forward, back } = useEServiceCreateContext()

  const methods = useForm()

  const riskAnalysisList = descriptor?.eservice.riskAnalysis ?? []

  const autocompleteOptions = (riskAnalysisList ?? []).map((riskAnalysis) => ({
    label: riskAnalysis.name,
    value: riskAnalysis.id,
  }))

  const [selectedRiskAnalysis, setSelectedRiskAnalysis] = useState<RiskAnalysisValue>({
    label: '',
    value: '',
  })
  const [showRiskAnalysis, setShowRiskAnalisys] = useState(false)

  const resetStates = () => {
    setShowRiskAnalisys(false)
    setSelectedRiskAnalysis({ label: '', value: '' })
  }

  const setStates = (value: RiskAnalysisValue) => {
    setShowRiskAnalisys(false)
    setSelectedRiskAnalysis(value)
  }

  return (
    <FormProvider {...methods}>
      <SectionContainer
        title={t('stepPurpose.purposeTableSection.title')}
        description={t('stepPurpose.purposeTableSection.descriptionEServiceFromTemplate')}
      >
        <Stack spacing={2} alignItems="flex-start">
          <RHFAutocompleteSingle
            sx={{ my: 0 }}
            name="riskAnalysis"
            label={t('stepPurpose.purposeTableSection.labelAutocompleteEServiceFromTemplate')}
            options={autocompleteOptions}
            onValueChange={(value) => (value === null ? resetStates() : setStates(value))}
            rules={{ required: true }}
          />
          <Button
            variant="contained"
            disabled={selectedRiskAnalysis.value === ''}
            onClick={() => setShowRiskAnalisys(true)}
          >
            {tCommon('actions.inspect')}
          </Button>
        </Stack>
      </SectionContainer>
      {showRiskAnalysis && (
        <SectionContainer title={selectedRiskAnalysis.label}>
          <RiskAnalysisInfoSummary
            eServiceId={descriptor?.eservice.id as string}
            riskAnalysisId={selectedRiskAnalysis.value}
          />
        </SectionContainer>
      )}
      <StepActions
        back={{
          label: t('backWithoutSaveBtn'),
          type: 'button',
          onClick: back,
          startIcon: <ArrowBackIcon />,
        }}
        forward={{
          label: t('forwardWithoutSaveBtn'),
          type: 'button',
          onClick: forward,
          endIcon: <ArrowForwardIcon />,
        }}
      />
    </FormProvider>
  )
}

export const EServiceCreateFromTemplateStepPurposeSkeleton: React.FC = () => {
  return (
    <>
      <SectionContainerSkeleton height={365} />
      <SectionContainerSkeleton height={178} />
    </>
  )
}
