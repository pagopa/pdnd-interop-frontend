import type { EServiceTemplateDetails } from '@/api/api.generatedTypes'
import { useTranslation } from 'react-i18next'
import { EServiceDetailsSectionBase } from './EServiceDetailsSectionBase'

type EServiceTemplateDetailsSectionProps = {
  eserviceTemplate: EServiceTemplateDetails
}

export const EServiceTemplateDetailsSection: React.FC<EServiceTemplateDetailsSectionProps> = ({
  eserviceTemplate,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.detailsSection' })

  return (
    <EServiceDetailsSectionBase
      isEditable={false}
      eserviceMode={eserviceTemplate.mode}
      details={eserviceTemplate}
      description={t('description')}
      missingPersonalDataTenantName={eserviceTemplate.creator.name}
    />
  )
}
