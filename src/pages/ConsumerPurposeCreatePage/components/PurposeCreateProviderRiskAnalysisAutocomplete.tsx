import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateForm'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import type { EServiceRiskAnalysis } from '@/api/api.generatedTypes'

export const PurposeCreateProviderRiskAnalysisAutocomplete: React.FC<{
  eserviceRiskAnalysis: EServiceRiskAnalysis[]
}> = ({ eserviceRiskAnalysis }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create.eserviceRiskAnalysisSection' })
  const { setValue, watch } = useFormContext<PurposeCreateFormValues>()

  const selectedEService = watch('eservice')
  const selectedEServiceId = selectedEService?.id

  React.useEffect(() => {
    setValue('providerRiskAnalysisId', null)
  }, [selectedEServiceId, setValue])

  const autocompleteOptions = eserviceRiskAnalysis.map((riskAnalysis) => ({
    label: riskAnalysis.name,
    value: riskAnalysis.id,
  }))

  return (
    <RHFAutocompleteSingle
      key={selectedEServiceId}
      sx={{ my: 0 }}
      name="providerRiskAnalysisId"
      label={t('purposeField.label')}
      options={autocompleteOptions}
    />
  )
}
