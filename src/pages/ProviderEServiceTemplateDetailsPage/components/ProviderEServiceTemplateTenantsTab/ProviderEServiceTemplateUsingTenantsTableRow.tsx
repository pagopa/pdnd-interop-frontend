import type { EServiceDescriptorState, EServiceTemplateInstance } from '@/api/api.generatedTypes'
import { StatusChip } from '@/components/shared/StatusChip'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'

type ProviderEServiceTemplateUsingTenantsTableRowProps = {
  instance: EServiceTemplateInstance
}

export const ProviderEServiceTemplateUsingTenantsTableRow: React.FC<
  ProviderEServiceTemplateUsingTenantsTableRowProps
> = ({ instance }) => {
  return (
    <TableRow
      key={instance.activeDescriptor?.id}
      cellData={[
        `${instance.producerName}`,
        `${instance.instanceLabel}`,
        `${instance.activeDescriptor?.version}`,
        <StatusChip
          for="eservice"
          key={instance.instanceLabel}
          state={instance.activeDescriptor?.state as EServiceDescriptorState}
        />,
      ]}
    />
  )
}

export const ProviderEServiceTemplateUsingTenantsTableRowSkeleton: React.FC = () => {
  return <TableRow cellData={[<Skeleton key={0} width={120} />]}></TableRow>
}
