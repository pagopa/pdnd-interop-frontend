import React from 'react'
import { useParams } from '@/router'
import { ConsumerEServiceTemplateInstancesTable } from './ConsumerEServiceTemplateInstancesTable'
import type { CompactEServiceTemplateVersion } from '@/api/api.generatedTypes'

type ConsumerEServiceTemplateInstancesTabProps = {
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
}
export const ConsumerEServiceTemplateInstancesTab: React.FC<
  ConsumerEServiceTemplateInstancesTabProps
> = ({ eserviceTemplateVersions }) => {
  const { eServiceTemplateId } = useParams<'SUBSCRIBE_ESERVICE_TEMPLATE_DETAILS'>()

  return (
    <ConsumerEServiceTemplateInstancesTable
      eserviceTemplateId={eServiceTemplateId}
      eserviceTemplateVersions={eserviceTemplateVersions}
    />
  )
}
