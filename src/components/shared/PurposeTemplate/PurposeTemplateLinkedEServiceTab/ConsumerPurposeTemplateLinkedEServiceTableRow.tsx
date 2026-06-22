import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TableRow } from '@pagopa/interop-fe-commons'
import type { EServiceDescriptorPurposeTemplateWithCompactEServiceAndDescriptor } from '@/api/api.generatedTypes'

interface ConsumerPurposeTemplateLinkedEServiceTableRowProps {
  compactEServiceWithCompactDescriptor: EServiceDescriptorPurposeTemplateWithCompactEServiceAndDescriptor
}

export const ConsumerPurposeTemplateLinkedEServiceTableRow: React.FC<
  ConsumerPurposeTemplateLinkedEServiceTableRowProps
> = ({ compactEServiceWithCompactDescriptor }) => {
  const { t: tCommon } = useTranslation('common')

  return (
    <TableRow
      cellData={[
        `${compactEServiceWithCompactDescriptor.eservice.name}`,
        `${compactEServiceWithCompactDescriptor.eservice.producer.name}`,
      ]}
    >
      <Link
        as="button"
        to={'SUBSCRIBE_CATALOG_VIEW'}
        params={{
          eserviceId: compactEServiceWithCompactDescriptor.eservice.id,
          descriptorId: compactEServiceWithCompactDescriptor.descriptor.id,
        }}
        variant="outlined"
        size="small"
      >
        {tCommon('actions.inspect')}
      </Link>
    </TableRow>
  )
}

export const ConsumerPurposeTemplateLinkedEServiceTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={120} />]}>
      <ButtonSkeleton size="small" width={103} />
    </TableRow>
  )
}
