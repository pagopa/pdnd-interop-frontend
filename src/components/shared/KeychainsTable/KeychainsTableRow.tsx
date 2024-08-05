import { Link } from '@/router'
import { Box, Skeleton } from '@mui/material'
import { TableRow } from '@pagopa/interop-fe-commons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActionMenu, ActionMenuSkeleton } from '../ActionMenu'
import { ButtonSkeleton } from '../MUI-skeletons'
import useGetKeychainActions from '@/hooks/useGetKeychainActions'

type KeychainsTableRow = {}

export const KeychainsTableRow: React.FC<KeychainsTableRow> = () => {
  const { t } = useTranslation('common', { keyPrefix: 'actions' })

  const { actions } = useGetKeychainActions()

  return (
    <TableRow cellData={['MY MOCK KEYCHAIN ']}>
      <Link
        as="button"
        variant="outlined"
        size="small"
        to={'SUBSCRIBE_INTEROP_M2M_CLIENT_EDIT'}
        params={{ clientId: '' }}
      >
        {t('inspect')}
      </Link>

      <Box component="span" sx={{ ml: 2, display: 'inline-block' }}>
        <ActionMenu actions={actions} />
      </Box>
    </TableRow>
  )
}

export const KeychainsTableRowSkeleton: React.FC = () => {
  return (
    <TableRow cellData={[<Skeleton key={0} width={440} />]}>
      <ButtonSkeleton size="small" width={100} />
      <ActionMenuSkeleton />
    </TableRow>
  )
}
