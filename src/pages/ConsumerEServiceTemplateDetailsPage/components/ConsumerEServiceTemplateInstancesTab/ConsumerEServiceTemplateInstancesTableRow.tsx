import type {
  CompactEServiceTemplateVersion,
  EServiceDescriptorState,
  EServiceTemplateInstance,
} from '@/api/api.generatedTypes'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ConsumerEServiceTemplateInstancesTableRowProps = {
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
  instance: EServiceTemplateInstance
}

export const ConsumerEServiceTemplateInstancesTableRow: React.FC<
  ConsumerEServiceTemplateInstancesTableRowProps
> = ({ instance, eserviceTemplateVersions }) => {
  const { t: tCommon } = useTranslation('common')

  return (
    <TableRow
      key={instance.latestDescriptor?.id}
      cellData={[
        instance.instanceLabel || '-',
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
    >
      {instance.latestDescriptor && (
        <Link
          as="button"
          variant="outlined"
          size="small"
          to="PROVIDE_ESERVICE_MANAGE"
          params={{
            eserviceId: instance.id,
            descriptorId: instance.latestDescriptor.id,
          }}
        >
          {tCommon('actions.inspect')}
        </Link>
      )}
    </TableRow>
  )
}

export const ConsumerEServiceTemplateInstancesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={80} />,
        <Skeleton key={1} width={60} />,
        <Skeleton key={2} width={80} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
    </TableRow>
  )
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
