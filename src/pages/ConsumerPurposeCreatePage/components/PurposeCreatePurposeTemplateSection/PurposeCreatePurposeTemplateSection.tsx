import { SectionContainer } from '@/components/layout/containers'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { PurposeCreatePurposeTemplateAutocomplete } from './PurposeCreatePurposeTemplateAutocomplete'
import { useFormContext, useWatch } from 'react-hook-form'

export type PurposeCreatePurposeTemplateSectionProps = {
  eserviceId: string
}

export const PurposeCreatePurposeTemplateSection: React.FC<
  PurposeCreatePurposeTemplateSectionProps
> = ({ eserviceId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create.purposeTemplateField' })

  const { control } = useFormContext()
  const usePurposeTemplate = useWatch({
    control,
    name: 'usePurposeTemplate',
    defaultValue: false,
  })

  const innerSectionTitle = (
    <>
      <Stack direction="row" alignItems="center">
        <MenuBookIcon fontSize="small" sx={{ mr: 1 }} />{' '}
        {t('usePurposeTemplateSwitch.selectPurposeTemplate.title')}
      </Stack>
    </>
  ) as unknown as string

  return (
    <Stack spacing={3}>
      <RHFSwitch
        name="usePurposeTemplate"
        label={t('usePurposeTemplateSwitch.label')}
        sx={{ pl: 2, pt: 2 }}
      />
      {usePurposeTemplate && (
        <Stack spacing={2}>
          <SectionContainer
            innerSection
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, padding: 4 }}
            title={innerSectionTitle}
          >
            <Stack spacing={3} sx={{ p: 2 }}>
              <RHFSwitch
                name="showOnlyLinkedPurposeTemplates"
                label={t(
                  'usePurposeTemplateSwitch.selectPurposeTemplate.showOnlyLinkedPurposeTemplates'
                )}
                sx={{ pl: 2, pt: 2 }}
              />
              <PurposeCreatePurposeTemplateAutocomplete eserviceId={eserviceId} />
            </Stack>
          </SectionContainer>
          <RHFSwitch
            name="acknowledgeInfoResponsibility"
            label={t('usePurposeTemplateSwitch.acknowledgeInfoResponsibility.label')}
            sx={{ pl: 2, pt: 2 }}
            rules={{
              required: true,
            }}
          />
        </Stack>
      )}
    </Stack>
  )
}
