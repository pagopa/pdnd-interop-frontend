import type { EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

type EServiceTemplateInfoSectionProps = {
  eserviceTemplate: EServiceTemplateDetails
}

export const EServiceTemplateInfoSection: React.FC<EServiceTemplateInfoSectionProps> = ({
  eserviceTemplate,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.templateInfoSection' })

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <InformationContainer label={t('nameLabel')} content={eserviceTemplate.name} />
        <InformationContainer
          label={t('addressedToLabel')}
          content={eserviceTemplate.intendedTarget}
        />
        <InformationContainer label={t('allowWhatLabel')} content={eserviceTemplate.description} />
      </Stack>
    </SectionContainer>
  )
}
