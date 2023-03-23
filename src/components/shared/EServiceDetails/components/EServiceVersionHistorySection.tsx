import { SectionContainer } from '@/components/layout/containers'
import { useCurrentRoute, useNavigateRouter } from '@/router'
import { Box, Button } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFSelect } from '../../react-hook-form-inputs'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'

type VersionHistoryFormValues = {
  selectedDescriptorId: string | undefined
}

export const EServiceVersionHistorySection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.versionHistory',
  })
  const { mode } = useCurrentRoute()
  const { descriptor } = useEServiceDetailsContext()
  const { navigate } = useNavigateRouter()

  const formMethods = useForm<VersionHistoryFormValues>({
    defaultValues: {
      selectedDescriptorId: descriptor.id,
    },
  })

  const onSubmit = ({ selectedDescriptorId }: VersionHistoryFormValues) => {
    if (!descriptor || !selectedDescriptorId) return
    const path = mode === 'provider' ? 'PROVIDE_ESERVICE_MANAGE' : 'SUBSCRIBE_CATALOG_VIEW'
    navigate(path, {
      params: { eserviceId: descriptor.eservice.id, descriptorId: selectedDescriptorId },
    })
  }

  const shouldNotRender =
    !descriptor.eservice?.descriptors || descriptor.eservice?.descriptors.length <= 1

  if (shouldNotRender) return null

  const descriptorsOptions = descriptor.eservice.descriptors.map((descriptor) => ({
    label: t('historyField.option', { version: descriptor.version }),
    value: descriptor.id,
  }))

  return (
    <SectionContainer title={t('title')}>
      <InformationContainer
        label={t('historyField.title')}
        content={
          <FormProvider {...formMethods}>
            <Box onSubmit={formMethods.handleSubmit(onSubmit)} component="form" noValidate>
              <RHFSelect
                sx={{ my: 0 }}
                label={t('historyField.label')}
                MenuProps={{ sx: { maxHeight: '160px' } }}
                options={descriptorsOptions}
                name="selectedDescriptorId"
              />
              <Button sx={{ mt: 2 }} size="large" variant="outlined" type="submit">
                {t('submitBtn')}
              </Button>
            </Box>
          </FormProvider>
        }
      />
    </SectionContainer>
  )
}
