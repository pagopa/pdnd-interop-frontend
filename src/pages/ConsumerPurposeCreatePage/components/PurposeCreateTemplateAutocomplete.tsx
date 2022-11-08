import { PurposeQueries } from '@/api/purpose'
import { AutocompleteSingle } from '@/components/shared/ReactHookFormInputs'
import { Spinner } from '@/components/shared/Spinner'
import { Alert } from '@mui/material'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { PurposeCreateFormValues } from '../ConsumerPurposeCreate.page'

export const PurposeCreateTemplateAutocomplete: React.FC = () => {
  const { t } = useTranslation('purpose')
  const { watch, setValue } = useFormContext<PurposeCreateFormValues>()

  const shouldRenderTemplateAutocomplete = watch('useTemplate')
  const selectedEServiceId = watch('eserviceId')

  React.useEffect(() => {
    setValue('template', null)
  }, [selectedEServiceId, setValue])

  const {
    data: purposes,
    isFetching,
    isFetched,
  } = PurposeQueries.useGetList(
    {
      eserviceId: selectedEServiceId ?? undefined,
      states: ['ACTIVE', 'SUSPENDED', 'ARCHIVED'],
    },
    { enabled: !!(shouldRenderTemplateAutocomplete && selectedEServiceId), suspense: false }
  )

  const options = React.useMemo(() => {
    return (purposes ?? []).map((purpose) => ({
      label: t('create.purposeField.compiledBy', {
        title: purpose.title,
        consumerName: purpose.consumer.name,
      }),
      value: purpose,
    }))
  }, [purposes, t])

  if (!shouldRenderTemplateAutocomplete) return null
  if (isFetched && (!purposes || purposes.length === 0)) {
    return <Alert severity="warning">{t('create.purposeField.noDataLabel')}</Alert>
  }

  if (isFetching) {
    return <Spinner label={t('create.purposeField.loadingLabel')} />
  }

  return (
    <AutocompleteSingle
      // Key is given to force unmount/remount on eserviceId change
      key={selectedEServiceId}
      defaultValue={options[0]}
      name="template"
      label={t('create.purposeField.label')}
      sx={{ mt: 4, mb: 0 }}
      options={options}
    />
  )
}
