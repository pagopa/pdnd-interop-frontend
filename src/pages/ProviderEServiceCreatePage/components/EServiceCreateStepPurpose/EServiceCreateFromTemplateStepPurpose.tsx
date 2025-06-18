import { SectionContainer, SectionContainerSkeleton } from '@/components/layout/containers'
import { Box, Button, Stack } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEServiceCreateContext } from '../EServiceCreateContext'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { FormProvider, useForm } from 'react-hook-form'
import { StepActions } from '@/components/shared/StepActions'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { EServiceRiskAnalysisInfoSummary } from '@/components/shared/RiskAnalysisInfoSummary'

export const EServiceCreateFromTemplateStepPurpose: React.FC = () => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create' })
  const { t: tCommon } = useTranslation('common')

  const { descriptor, forward, back } = useEServiceCreateContext()

  const methods = useForm<{ riskAnalysisId: string | null }>({
    defaultValues: { riskAnalysisId: null },
  })

  const riskAnalysisList = descriptor?.eservice.riskAnalysis ?? []

  const autocompleteOptions = (riskAnalysisList ?? []).map((riskAnalysis) => ({
    label: riskAnalysis.name,
    value: riskAnalysis.id,
  }))

  const [selectedRiskAnalysisId, setSelectedRiskAnalysisId] = useState<string | null>(null)

  const selectedRiskAnalysis = descriptor?.eservice.riskAnalysis.find(
    (r) => r.id === selectedRiskAnalysisId
  )

  const handleSubmit = methods.handleSubmit(({ riskAnalysisId }) => {
    setSelectedRiskAnalysisId(riskAnalysisId)
  })

  return (
    <Box>
      <SectionContainer
        title={t('stepPurpose.purposeTableSection.title')}
        description={t('stepPurpose.purposeTableSection.descriptionEServiceFromTemplate')}
      >
        <FormProvider {...methods}>
          <Stack
            spacing={2}
            alignItems="flex-start"
            component="form"
            noValidate
            onSubmit={handleSubmit}
          >
            <RHFAutocompleteSingle
              sx={{ my: 0 }}
              name="riskAnalysisId"
              label={t('stepPurpose.purposeTableSection.labelAutocompleteEServiceFromTemplate')}
              options={autocompleteOptions}
            />
            <Button
              variant="contained"
              disabled={methods.watch('riskAnalysisId') === null}
              type="submit"
            >
              {tCommon('actions.inspect')}
            </Button>
          </Stack>
        </FormProvider>
      </SectionContainer>

      {selectedRiskAnalysisId && (
        <SectionContainer title={selectedRiskAnalysis?.name}>
          <EServiceRiskAnalysisInfoSummary
            eserviceId={descriptor?.eservice.id as string}
            riskAnalysisId={selectedRiskAnalysisId}
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
    </Box>
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
