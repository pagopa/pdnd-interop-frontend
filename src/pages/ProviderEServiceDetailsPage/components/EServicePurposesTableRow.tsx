import { PurposeMutations } from '@/api/purpose'
import { ActionMenu, ActionMenuSkeleton } from '@/components/shared/ActionMenu'
import { TableRow } from '@/components/shared/Table'
import { useDialog } from '@/stores'
import { DecoratedPurpose, PurposeVersion } from '@/types/purpose.types'
import { formatDateString, formatThousands } from '@/utils/format.utils'
import { Skeleton } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface Props {
  purpose: DecoratedPurpose
}

export const EServicePurposesTableRow: React.FC<Props> = ({ purpose }) => {
  const { t } = useTranslation('purpose')
  const { t: tCommon } = useTranslation('common', { keyPrefix: 'actions' })

  const { openDialog } = useDialog()
  const { mutate: activateVersion } = PurposeMutations.useActivateVersion()

  const mostRecentVersion = purpose.mostRecentVersion as PurposeVersion

  const actions = [
    {
      action: () =>
        openDialog({
          type: 'setPurposeExpectedApprovalDate',
          purposeId: purpose.id,
          versionId: mostRecentVersion.id,
          approvalDate: mostRecentVersion.expectedApprovalDate,
        }),
      label: t('tablePurposeInEService.actions.updateCompletionDate'),
    },
    {
      action: () => activateVersion({ purposeId: purpose.id, versionId: mostRecentVersion.id }),
      label: tCommon('activate'),
    },
  ]

  return (
    <TableRow
      cellData={[
        { label: purpose.title },
        { label: formatThousands(mostRecentVersion.dailyCalls) },
        {
          label: mostRecentVersion.expectedApprovalDate
            ? formatDateString(mostRecentVersion.expectedApprovalDate)
            : t('tablePurposeInEService.awaitingLabel'),
        },
      ]}
    >
      <ActionMenu actions={actions} />
    </TableRow>
  )
}

export const EServicePurposesTableRowSkeleton: React.FC = () => {
  return (
    <TableRow
      cellData={[
        { label: <Skeleton width={120} /> },
        { label: <Skeleton width={50} /> },
        {
          label: <Skeleton width={100} />,
        },
      ]}
    >
      <ActionMenuSkeleton />
    </TableRow>
  )
}
