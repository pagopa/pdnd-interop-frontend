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

type ConsumerEServiceTemplateInstancesTableRowProps = {
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
  instance: EServiceTemplateInstance
}

export const ConsumerEServiceTemplateInstancesTableRow: React.FC<
  ConsumerEServiceTemplateInstancesTableRowProps
> = ({ instance, eserviceTemplateVersions }) => {
  const { jwt } = AuthHooks.useJwt()

  // An instance is delegated when its producer differs from the logged-in
  // organization, meaning it was created on behalf of another party.
  const isOwn = instance.producerId === jwt?.organizationId

  const getNavigationLink = () => {
    if (!isOwn) {
      return 'SUBSCRIBE_CATALOG_VIEW'
    }

    // If the instance is in DRAFT state, it means the producer is still working on it and the consumer should be redirected to the edit page. In all other states, the consumer should be redirected to the manage page.
    if (instance.latestDescriptor?.state === 'DRAFT') {
      return 'PROVIDE_ESERVICE_EDIT'
    }

    return 'PROVIDE_ESERVICE_MANAGE'
  }

  return (
    <TableRow
      key={instance.latestDescriptor?.id}
      cellData={[
        isOwn ? (
          `${instance.producerName}`
        ) : (
          <Stack direction="row" spacing={1} alignItems="center">
            {instance.producerName}
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

export const ConsumerEServiceTemplateInstancesTableRowSkeleton: React.FC = () => {
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
