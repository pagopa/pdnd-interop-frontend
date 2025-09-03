import type {
  CompactEServiceTemplateVersion,
  EServiceDescriptorState,
  EServiceTemplateInstance,
} from '@/api/api.generatedTypes'
import { StatusChip } from '@/components/shared/StatusChip'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'

type ProviderEServiceTemplateUsingTenantsTableRowProps = {
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
  instance: EServiceTemplateInstance
}

export const ProviderEServiceTemplateUsingTenantsTableRow: React.FC<
  ProviderEServiceTemplateUsingTenantsTableRowProps
> = ({ instance, eserviceTemplateVersions }) => {
  return (
    <TableRow
      key={instance.latestDescriptor?.id}
      cellData={[
        `${instance.producerName}`,
        `${
          getStateByTemplateVersion(
            instance.latestDescriptor?.templateVersionId as string,
            eserviceTemplateVersions
          ) ?? '-'
        }`,
        instance.latestDescriptor?.state ? (
          <StatusChip
            for="eservice"
            key={instance.latestDescriptor.id}
            state={instance.latestDescriptor?.state as EServiceDescriptorState}
          />
        ) : (
          <></>
        ),
      ]}
    />
  )
}

export const ProviderEServiceTemplateUsingTenantsTableRowSkeleton: React.FC = () => {
  return <TableRow cellData={[<Skeleton key={0} width={120} />]}></TableRow>
}

const getStateByTemplateVersion = (
  templateVersionId: string,
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
) => {
  const templateVersion = eserviceTemplateVersions.find(
    (templateVersion) => templateVersion.id === templateVersionId
  )
  return templateVersion?.version
}
