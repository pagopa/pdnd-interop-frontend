import { InformationContainer, SectionContainer } from '@/components/layout/containers'
import { useCurrentRoute, useNavigateRouter } from '@/router'
import { Box, Button } from '@mui/material'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Select } from '../../ReactHookFormInputs'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'

type VersionHistoryFormValues = {
  selectedDescriptorId: string | undefined
}

export const EServiceVersionHistorySection: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.versionHistory',
  })
  const { mode } = useCurrentRoute()
  const { eservice } = useEServiceDetailsContext()
  const { navigate } = useNavigateRouter()

  const formMethods = useForm<VersionHistoryFormValues>({
    defaultValues: {
      selectedDescriptorId: eservice?.viewingDescriptor?.id,
    },
  })

  const onSubmit = ({ selectedDescriptorId }: VersionHistoryFormValues) => {
    if (!eservice || !selectedDescriptorId) return
    const path = mode === 'provider' ? 'PROVIDE_ESERVICE_MANAGE' : 'SUBSCRIBE_CATALOG_VIEW'
    navigate(path, {
      params: { eserviceId: eservice.id, descriptorId: selectedDescriptorId },
    })
  }

  const shouldNotRender = !eservice?.descriptors || eservice?.descriptors.length <= 1

  if (shouldNotRender) return null

  const descriptorsOptions = eservice.descriptors.map((descriptor) => ({
    label: t('historyField.option', { version: descriptor.version }),
    value: descriptor.id,
  }))

  return (
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Content>
        <InformationContainer label={t('historyField.title')}>
          <FormProvider {...formMethods}>
            <Box onSubmit={formMethods.handleSubmit(onSubmit)} component="form">
              <Select
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
        </InformationContainer>
      </SectionContainer.Content>
    </SectionContainer>
  )
}
