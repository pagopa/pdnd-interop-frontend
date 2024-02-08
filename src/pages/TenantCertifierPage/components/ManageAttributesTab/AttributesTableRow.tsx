import type { CompactAttribute } from '@/api/api.generatedTypes'
import { AttributeQueries } from '@/api/attribute'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { Link } from '@/router'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type AttributesTableRowProps = {
  attribute: CompactAttribute
}

export const AttributesTableRow: React.FC<AttributesTableRowProps> = ({ attribute }) => {
  const { t } = useTranslation('common')

  const prefetchAttribute = AttributeQueries.usePrefetchSingle()

  const handlePrefetch = () => {
    prefetchAttribute(attribute.id)
  }

  return (
    <TableRow cellData={[attribute.name]}>
      <Link
        as="button"
        onPointerEnter={handlePrefetch}
        onFocusVisible={handlePrefetch}
        variant="outlined"
        size="small"
        to={'TENANT_CERTIFIER_ATTRIBUTE_DETAILS'}
        params={{
          attributeId: attribute.id,
        }}
      >
        {t(`actions.inspect`)}
      </Link>
    </TableRow>
  )
}

export const AttributesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={220} />]}>
      <ButtonSkeleton size="small" width={100} />
    </TableRow>
  )
}
