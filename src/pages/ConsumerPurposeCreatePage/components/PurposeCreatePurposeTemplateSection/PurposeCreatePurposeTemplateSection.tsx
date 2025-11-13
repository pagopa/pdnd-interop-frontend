import { SectionContainer } from '@/components/layout/containers'
import { RHFSwitch } from '@/components/shared/react-hook-form-inputs'
import { Box, Stack, Tooltip, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { PurposeCreatePurposeTemplateAutocomplete } from './PurposeCreatePurposeTemplateAutocomplete'
import { useFormContext } from 'react-hook-form'

export type PurposeCreatePurposeTemplateSectionProps = {
  eserviceId: string
  handlesPersonalData?: boolean
  purposeTemplateId?: string
}

export const PurposeCreatePurposeTemplateSection: React.FC<
  PurposeCreatePurposeTemplateSectionProps
> = ({ eserviceId, handlesPersonalData, purposeTemplateId }) => {
  const { t } = useTranslation('purpose', { keyPrefix: 'create.purposeTemplateField' })

  const { watch, setValue } = useFormContext()
  const usePurposeTemplate = watch('usePurposeTemplate')

  const innerSectionTitle = (
    <>
      <Stack direction="row" alignItems="center">
        <MenuBookIcon fontSize="small" sx={{ mr: 1 }} />{' '}
        {t('usePurposeTemplateSwitch.selectPurposeTemplate.title')}
      </Stack>
    </>
  ) as unknown as string

  const isUsePurposeTemplateDisabled = Boolean(eserviceId && handlesPersonalData === undefined)

  useEffect(() => {
    if (isUsePurposeTemplateDisabled) {
      setValue('usePurposeTemplate', false)
    }
  }, [isUsePurposeTemplateDisabled, setValue])

  const tooltipLabel = t('usePurposeTemplateSwitch.disabledTooltip')
    .split('\n')
    .map((line, idx) => (
      <span key={idx}>
        {line}
        <br />
      </span>
    ))

  return (
    <Stack spacing={3}>
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Tooltip title={isUsePurposeTemplateDisabled ? tooltipLabel : ''} arrow placement="bottom">
          <span>
            <RHFSwitch
              name="usePurposeTemplate"
              label={t('usePurposeTemplateSwitch.label')}
              sx={{ pl: 2, pt: 2 }}
              disabled={isUsePurposeTemplateDisabled}
            />
          </span>
        </Tooltip>
      </Box>

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
              <PurposeCreatePurposeTemplateAutocomplete
                eserviceId={eserviceId}
                handlesPersonalData={handlesPersonalData}
                purposeTemplateId={purposeTemplateId}
              />
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
