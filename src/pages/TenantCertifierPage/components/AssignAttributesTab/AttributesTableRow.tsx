import type { RequesterCertifiedAttribute } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useDialog } from '@/stores'
import { Button, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'

type AttributesTableRowProps = {
  attribute: RequesterCertifiedAttribute
}

export const AttributesTableRow: React.FC<AttributesTableRowProps> = ({ attribute }) => {
  const { t } = useTranslation('common')

  const { openDialog } = useDialog()
  const { isAdmin } = AuthHooks.useJwt()

  const handleRevoke = () => {
    openDialog({
      type: 'revokeCertifiedAttribute',
      attribute: attribute,
    })
  }

  return (
    <TableRow cellData={[attribute.tenantName, attribute.attributeName]}>
      {isAdmin && (
        <Button variant="outlined" color="error" size="small" onClick={handleRevoke}>
          {t(`actions.revoke`)}
        </Button>
      )}
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
