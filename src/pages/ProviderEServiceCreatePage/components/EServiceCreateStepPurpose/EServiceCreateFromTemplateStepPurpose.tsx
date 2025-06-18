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
import { EServiceRiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'

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

  const [riskAnalysisToShow, setRiskAnalysisToShow] = useState<RiskAnalysisValue | undefined>(
    undefined
  )

  const resetStates = () => {
    setShowRiskAnalisys(false)
    setSelectedRiskAnalysis({ label: '', value: '' })
  }

  const handleClick = () => {
    setShowRiskAnalisys(true)
    setRiskAnalysisToShow(selectedRiskAnalysis)
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
            onValueChange={(value) =>
              value === null ? resetStates() : setSelectedRiskAnalysis(value)
            }
            rules={{ required: true }}
          />
          <Button
            variant="contained"
            disabled={selectedRiskAnalysis.value === ''}
            onClick={handleClick}
          >
            {tCommon('actions.inspect')}
          </Button>
        </Stack>
      </SectionContainer>
      {showRiskAnalysis && riskAnalysisToShow && (
        <SectionContainer title={riskAnalysisToShow.label}>
          <EServiceRiskAnalysisInfoSummary
            eserviceId={descriptor?.eservice.id as string}
            riskAnalysisId={riskAnalysisToShow.value}
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
