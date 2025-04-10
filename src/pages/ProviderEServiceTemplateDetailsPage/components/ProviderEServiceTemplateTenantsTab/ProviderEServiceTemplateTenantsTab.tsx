import React from 'react'
import { useParams } from '@/router'
import { ProviderEServiceTemplateUsingTenantsTable } from './ProviderEServiceTemplateUsingTenantsTable'
import type { CompactEServiceTemplateVersion } from '@/api/api.generatedTypes'

type ProviderEServiceTemplateTenantsTabProps = {
  templateVersions: CompactEServiceTemplateVersion[]
}
export const ProviderEServiceTemplateTenantsTab: React.FC<
  ProviderEServiceTemplateTenantsTabProps
> = ({ templateVersions }) => {
  const { eServiceTemplateId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  return (
    <ProviderEServiceTemplateUsingTenantsTable
      eserviceTemplateId={eServiceTemplateId}
      templateVersions={templateVersions}
    />
  )
}
