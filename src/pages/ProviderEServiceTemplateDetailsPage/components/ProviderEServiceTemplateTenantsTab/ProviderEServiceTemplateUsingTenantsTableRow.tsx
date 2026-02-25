import type {
  CompactEServiceTemplateVersion,
  EServiceDescriptorState,
  EServiceTemplateInstance,
} from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { StatusChip } from '@/components/shared/StatusChip'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type ProviderEServiceTemplateUsingTenantsTableRowProps = {
  eserviceTemplateVersions: CompactEServiceTemplateVersion[]
  instance: EServiceTemplateInstance
}

export const ProviderEServiceTemplateUsingTenantsTableRow: React.FC<
  ProviderEServiceTemplateUsingTenantsTableRowProps
> = ({ instance, eserviceTemplateVersions }) => {
  const { t: tCommon } = useTranslation('common')
  const { jwt } = AuthHooks.useJwt()

  const isOwn = instance.producerId === jwt?.organizationId

  return (
    <TableRow
      key={instance.latestDescriptor?.id}
      cellData={[
        `${instance.producerName}`,
        instance.instanceLabel ?? '-',
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
      <Link
        as="button"
        variant="outlined"
        size="small"
        to={isOwn ? 'PROVIDE_ESERVICE_MANAGE' : 'SUBSCRIBE_CATALOG_VIEW'}
        params={{
          eserviceId: instance.id,
          descriptorId: instance.latestDescriptor?.id ?? '',
        }}
      >
        {tCommon('actions.inspect')}
      </Link>
    </TableRow>
  )
}

export const ProviderEServiceTemplateUsingTenantsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        <Skeleton key={0} width={120} />,
        <Skeleton key={1} width={80} />,
        <Skeleton key={2} width={60} />,
        <Skeleton key={3} width={80} />,
      ]}
    />
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
