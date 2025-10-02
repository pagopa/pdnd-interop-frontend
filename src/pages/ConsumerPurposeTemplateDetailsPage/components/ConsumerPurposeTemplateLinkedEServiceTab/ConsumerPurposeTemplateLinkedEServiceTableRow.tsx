import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TableRow } from '@pagopa/interop-fe-commons'
import { PurposeTemplateEService } from '@/api/purposeTemplate/mockedResponses'

interface ConsumerPurposeTemplateLinkedEServiceTableRowProps {
  eservice: PurposeTemplateEService
}

export const ConsumerPurposeTemplateLinkedEServiceTableRow: React.FC<
  ConsumerPurposeTemplateLinkedEServiceTableRowProps
> = ({ eservice }) => {
  const { t: tCommon } = useTranslation('common')

  return (
    <TableRow cellData={[`${eservice.eserviceName}`, `${eservice.producerName}`]}>
      <Link
        as="button"
        to={'SUBSCRIBE_CATALOG_VIEW'}
        params={{ eserviceId: eservice.eserviceId, descriptorId: eservice.descriptorId }}
        variant="outlined"
        size="small"
        // onPointerEnter={handlePrefetchOperator}
        // onFocusVisible={handlePrefetchOperator}
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
