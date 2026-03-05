import type { EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { SectionContainer } from '@/components/layout/containers'
import { Alert, Stack } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { useTranslation } from 'react-i18next'

type EServiceTemplateDetailsSectionProps = {
  eserviceTemplate: EServiceTemplateDetails
}

export const EServiceTemplateDetailsSection: React.FC<EServiceTemplateDetailsSectionProps> = ({
  eserviceTemplate,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.detailsSection' })

  return (
    <SectionContainer title={t('title')} description={t('description')}>
      <Stack spacing={2}>
        <InformationContainer
          label={t('technologyField.readOnlyLabel')}
          content={eserviceTemplate.technology}
        />
        <InformationContainer
          label={t('modeField.label')}
          content={t(`modeField.options.${eserviceTemplate.mode}`)}
        />
        {eserviceTemplate.personalData !== undefined ? (
          <InformationContainer
            label={t(`personalDataField.${eserviceTemplate.mode}.readOnlyLabel`)}
            content={t(
              `personalDataField.${eserviceTemplate.mode}.readOnlyOptions.${eserviceTemplate.personalData}`
            )}
          />
        ) : (
          <Alert severity="error" variant="outlined">
            {t('personalDataField.alertMissingPersonalData', {
              tenantName: eserviceTemplate?.creator.name,
            })}
          </Alert>
        )}
      </Stack>
    </SectionContainer>
  )
}
