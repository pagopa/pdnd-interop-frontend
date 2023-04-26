import { ClientQueries, ClientQueryKeys } from '@/api/client'
import ClientServices from '@/api/client/client.services'
import { useDialog } from '@/stores'
import { useJwt } from '@/hooks/useJwt'
import { useQueries } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import identity from 'lodash/identity'
import { Button, Stack } from '@mui/material'
import { InfoTooltip, InfoTooltipSkeleton } from '@/components/shared/InfoTooltip'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'

interface ClientAddPublicKeyButtonProps {
  clientId: string
}

export const ClientAddPublicKeyButton: React.FC<ClientAddPublicKeyButtonProps> = ({ clientId }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('key')
  const { openDialog } = useDialog()
  const { jwt, isOperatorSecurity, isAdmin } = useJwt()
  const { data: users = [] } = ClientQueries.useGetOperatorsList(clientId)

  const userQueries = useQueries({
    queries: users.map(({ relationshipId }) => {
      return {
        queryKey: [ClientQueryKeys.GetSingleOperator, relationshipId],
        queryFn: () => ClientServices.getSingleOperator(relationshipId),
      }
    }),
  })

  const usersId = userQueries.map(({ data }) => data?.from).filter(identity)

  const openAddKeyDialog = () => {
    openDialog({ type: 'addSecurityOperatorKey', clientId })
  }

  const isAdminInClient = Boolean(isAdmin && usersId.includes(jwt?.uid))
  const canAddKey = isOperatorSecurity || isAdminInClient

  return (
    <Stack sx={{ mb: 2 }} direction="row" justifyContent="end" alignItems="center" spacing={2}>
      {!isAdminInClient && <InfoTooltip label={t('list.adminEnableInfo')} />}
      <Button variant="contained" size="small" onClick={openAddKeyDialog} disabled={!canAddKey}>
        {tCommon('addBtn')}
      </Button>
    </Stack>
  )
}

export const ClientAddPublicKeyButtonSkeleton: React.FC = () => {
  return (
    <Stack sx={{ mb: 2 }} direction="row" justifyContent="end" alignItems="center" spacing={2}>
      <InfoTooltipSkeleton />
      <ButtonSkeleton size="small" width={103} />
    </Stack>
  )
}
