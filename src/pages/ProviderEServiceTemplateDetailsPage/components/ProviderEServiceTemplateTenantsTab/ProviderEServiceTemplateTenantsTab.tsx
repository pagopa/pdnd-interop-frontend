import React from 'react'
import { useParams } from '@/router'
import { ProviderEServiceTemplateUsingTenantsTable } from './ProviderEServiceTemplateUsingTenantsTable'

export const ProviderEServiceTemplateTenantsTab: React.FC = () => {
  const { eServiceTemplateId } = useParams<'PROVIDE_ESERVICE_TEMPLATE_DETAILS'>()

  return <ProviderEServiceTemplateUsingTenantsTable eserviceTemplateId={eServiceTemplateId} />
}
