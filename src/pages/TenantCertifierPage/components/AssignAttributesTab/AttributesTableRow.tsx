import type { RequesterCertifiedAttribute } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { useDrawerState } from '@/hooks/useDrawerState'
import { useDialog } from '@/stores'
import { formatThousands } from '@/utils/format.utils'
import type { ActionItem } from '@/types/common.types'
import { Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ChangeAttributeValueDrawer from './ChangeAttributeValueDrawer'

type AttributesTableRowProps = {
  attribute: RequesterCertifiedAttribute
}

export const AttributesTableRow: React.FC<AttributesTableRowProps> = ({ attribute }) => {
  const { t } = useTranslation('party', { keyPrefix: 'tenantCertifier.assignTab' })

  const { openDialog } = useDialog()
  const { isAdmin } = AuthHooks.useJwt()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const handleRevoke = () => {
    openDialog({
      type: 'revokeCertifiedAttribute',
      attribute: attribute,
    })
  }

  const attributeValue = attribute.discreteValue ? formatThousands(attribute.discreteValue) : '-'

  const revokeAction: ActionItem = {
    action: handleRevoke,
    label: t(`revokeAttributeBtn`),
  }

  const changeValueAction: ActionItem = {
    action: openDrawer,
    label: t('changeAttributeValueBtn'),
  }

  return (
    <>
      <TableRow cellData={[attribute.tenantName, attribute.attributeName, attributeValue]}>
        {isAdmin && (
          <ActionMenu
            actions={
              attribute.kind === 'CERTIFIED_DISCRETE'
                ? [revokeAction, changeValueAction]
                : [revokeAction]
            }
          />
        )}
      </TableRow>
      {attribute.kind === 'CERTIFIED_DISCRETE' && (
        <ChangeAttributeValueDrawer isOpen={isOpen} onClose={closeDrawer} attribute={attribute} />
      )}
    </>
  )
}

export const AttributesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={220} />, <Skeleton key={1} width={220} />]}>
      <ActionMenuSkeleton />
    </TableRow>
  )
}
