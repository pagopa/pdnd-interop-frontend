import React from 'react'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { RHFTextField } from '@/components/shared/react-hook-form-inputs'

type InstanceLabelSectionProps = {
  templateName: string
  instanceLabel: string
}

export const InstanceLabelSection: React.FC<InstanceLabelSectionProps> = ({
  templateName,
  instanceLabel,
}) => {
  const { t } = useTranslation('eservice')

  return (
    <SectionContainer
      title={t('create.step1.instanceLabelField.title')}
      description={t('create.step1.instanceLabelField.description')}
      component="div"
    >
      <RHFTextField
        label={t('create.step1.instanceLabelField.label')}
        infoLabel={t('create.step1.instanceLabelField.infoLabel')}
        name="instanceLabel"
        rules={{ maxLength: 12 }}
        inputProps={{ maxLength: 12 }}
        size="small"
        sx={{ my: 0, mt: 1 }}
      />
      {instanceLabel && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t('create.step1.instanceLabelField.catalogPreviewLabel')}
          </Typography>
          <Typography variant="body2" fontWeight={700}>
            {templateName} - {instanceLabel}
          </Typography>
        </Box>
      )}
    </SectionContainer>
  )
}
