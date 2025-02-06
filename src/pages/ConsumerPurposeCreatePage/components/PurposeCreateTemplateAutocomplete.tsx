import { PurposeQueries } from '@/api/purpose'
import { RHFAutocompleteSingle } from '@/components/shared/react-hook-form-inputs'
import { Alert } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateForm'
import { Spinner } from '@pagopa/interop-fe-commons'
import { useQuery } from '@tanstack/react-query'

export const PurposeCreateTemplateAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { watch, setValue } = useFormContext<PurposeCreateFormValues>()

  const shouldRenderTemplateAutocomplete = watch('useTemplate')
  const selectedEServiceId = watch('eservice')?.id

  React.useEffect(() => {
    setValue('templateId', null)
  }, [selectedEServiceId, setValue])

  const { data, isLoading, isFetched } = useQuery({
    ...PurposeQueries.getConsumersList({
      eservicesIds: [selectedEServiceId!],
      states: ['ACTIVE', 'SUSPENDED', 'ARCHIVED'],
      offset: 0,
      limit: 50,
    }),
    enabled: Boolean(shouldRenderTemplateAutocomplete && selectedEServiceId),
  })
  const purposes = data?.results ?? []

  const options = purposes.map((purpose) => ({
    label: purpose.title,
    value: purpose.id,
  }))

  if (!shouldRenderTemplateAutocomplete) return null

  if (isFetched && (!purposes || data?.pagination.totalCount === 0)) {
    return <Alert severity="warning">{t('create.purposeField.noDataLabel')}</Alert>
  }

  if (isLoading) {
    return <Spinner label={t('create.purposeField.loadingLabel')} />
  }

  return (
    <RHFAutocompleteSingle
      // Key is given to force unmount/remount on eserviceId change
      key={selectedEServiceId}
      defaultValue={options[0]}
      name="templateId"
      label={t('create.purposeField.label')}
      sx={{ mt: 4, mb: 0 }}
      options={options}
    />
  )
}
