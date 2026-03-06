import type {
  CompactEServiceTemplateVersion,
  EServiceDescriptorState,
  EServiceTemplateInstance,
} from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { ByDelegationChip } from '@/components/shared/ByDelegationChip'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { getTemplateVersionNumber } from '@/components/shared/EserviceTemplate/eserviceTemplate.utils'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Skeleton, Stack } from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'

type EServiceTemplateInstancesTableRowProps = {
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
  instance: EServiceTemplateInstance
  type: 'provider' | 'consumer'
}

export const EServiceTemplateInstancesTableRow: React.FC<
  EServiceTemplateInstancesTableRowProps
> = ({ instance, eserviceTemplateVersions, type }) => {
  const { jwt } = AuthHooks.useJwt()

  const isOwn = instance.producerId === jwt?.organizationId

  const getNavigationLink = () => {
    if (!isOwn) return 'SUBSCRIBE_CATALOG_VIEW'
    if (instance.latestDescriptor?.state === 'DRAFT') {
      return 'PROVIDE_ESERVICE_SUMMARY'
    }

    return 'PROVIDE_ESERVICE_MANAGE'
  }

  return (
    <TableRow
      key={instance.latestDescriptor?.id}
      cellData={[
        isOwn || type === 'provider' ? (
          `${instance.producerName}`
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            <span>{instance.producerName}</span>
            <ByDelegationChip />
          </Stack>
        ),
        instance.instanceLabel || '-',
        `${
          getTemplateVersionNumber(
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
          variant="naked"
          size="small"
          to={getNavigationLink()}
          params={{
            eserviceId: instance.id,
            descriptorId: instance.latestDescriptor.id,
          }}
        >
          <ChevronRightIcon />
        </Link>
      )}
    </TableRow>
  )
}

export const EServiceTemplateInstancesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={120} />,
        <Skeleton key={1} width={80} />,
        <Skeleton key={2} width={60} />,
        <Skeleton key={3} width={80} />,
      ]}
    >
      <ButtonSkeleton size="small" width={100} />
    </TableRow>
  )
}
