import type { CompactAttribute } from '@/api/api.generatedTypes'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useDialog } from '@/stores'
import { Button, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type AttributesTableRowProps = {
  tenant: { id: string; name: string }
  attribute: CompactAttribute
}

export const AttributesTableRow: React.FC<AttributesTableRowProps> = ({ tenant, attribute }) => {
  const { t } = useTranslation('common')

  const { openDialog } = useDialog()

  const handleRevoke = () => {
    openDialog({
      type: 'revokeCertifiedAttribute',
      tenant: tenant,
      attribute: attribute,
    })
    console.log('REVOKE', attribute.id)
  }

  return (
    <TableRow cellData={[tenant.name, attribute.name]}>
      <Button variant="outlined" color="error" size="small" onClick={handleRevoke}>
        {t(`actions.revoke`)}
      </Button>
    </TableRow>
  )
}

export const AttributesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={220} />, <Skeleton key={1} width={220} />]}>
      <ButtonSkeleton size="small" width={100} />
    </TableRow>
  )
}
