import { PurposeQueries } from '@/api/purpose'
import { AutocompleteSingle } from '@/components/shared/ReactHookFormInputs'
import { Spinner } from '@/components/shared/Spinner'
import { useJwt } from '@/hooks/useJwt'
import { Alert } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import type { PurposeCreateFormValues } from './PurposeCreateEServiceForm'

export const PurposeCreateTemplateAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { jwt } = useJwt()
  const { watch, setValue } = useFormContext<PurposeCreateFormValues>()

  const shouldRenderTemplateAutocomplete = watch('useTemplate')
  const selectedEServiceId = watch('eserviceId')

  React.useEffect(() => {
    setValue('templateId', null)
  }, [selectedEServiceId, setValue])

  const { data, isInitialLoading, isFetched } = PurposeQueries.useGetList(
    {
      consumersIds: [jwt?.organizationId] as Array<string>,
      eservicesIds: [selectedEServiceId!],
      states: ['ACTIVE', 'SUSPENDED', 'ARCHIVED'],
      offset: 0,
      limit: 50,
    },
    {
      enabled: !!(shouldRenderTemplateAutocomplete && selectedEServiceId),
      suspense: false,
    }
  )
  const purposes = data?.results ?? []

  const options = purposes.map((purpose) => ({
    label: purpose.title,
    value: purpose.id,
  }))

  if (!shouldRenderTemplateAutocomplete) return null
  if (isFetched && (!purposes || data?.pagination.totalCount === 0)) {
    return <Alert severity="warning">{t('create.purposeField.noDataLabel')}</Alert>
  }

  if (isInitialLoading) {
    return <Spinner label={t('create.purposeField.loadingLabel')} />
  }

  return (
    <AutocompleteSingle
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
