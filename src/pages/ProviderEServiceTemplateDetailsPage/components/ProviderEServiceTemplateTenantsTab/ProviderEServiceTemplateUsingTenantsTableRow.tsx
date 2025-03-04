import type { EServiceTemplateInstance } from '@/api/api.generatedTypes'
import { StatusChip } from '@/components/shared/StatusChip'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'

type ProviderEServiceTemplateUsingTenantsTableRowProps = {
  eserviceTemplateId: string
  instance: EServiceTemplateInstance
}

export const ProviderEServiceTemplateUsingTenantsTableRow: React.FC<
  ProviderEServiceTemplateUsingTenantsTableRowProps
> = ({ instance }) => {
  return (
    <TableRow
      cellData={[
        `${instance.producerName}`,
        `${instance.instanceId}`,
        `${instance.version}`,
        <StatusChip for="template" state={instance.state} />,
      ]}
    />
  )
}

export const ProviderEServiceTemplateUsingTenantsTableRowSkeleton: React.FC = () => {
  return <TableRow cellData={[<Skeleton key={0} width={120} />]}></TableRow>
}
