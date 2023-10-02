import { ClientQueries, ClientQueryKeys } from '@/api/client'
import ClientServices from '@/api/client/client.services'
import { useQueries } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import identity from 'lodash/identity'
import { Button, Stack, Tooltip } from '@mui/material'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { AuthHooks } from '@/api/auth'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { ClientAddPublicKeyDrawer } from './ClientAddPublicKeyDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'

interface ClientAddPublicKeyButtonProps {
  clientId: string
}

export const ClientAddPublicKeyButton: React.FC<ClientAddPublicKeyButtonProps> = ({ clientId }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('key')
  const { jwt, isOperatorSecurity, isAdmin } = AuthHooks.useJwt()
  const { data: users = [] } = ClientQueries.useGetOperatorsList(clientId)

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const userQueries = useQueries({
    queries: users.map(({ relationshipId }) => {
      return {
        queryKey: [ClientQueryKeys.GetSingleOperator, relationshipId],
        queryFn: () => ClientServices.getSingleOperator(relationshipId),
      }
    }),
  })

  const usersId = userQueries.map(({ data }) => data?.from).filter(identity)

  const isAdminInClient = Boolean(jwt && usersId.includes(jwt.uid))
  const canAddKey = isOperatorSecurity || (isAdmin && isAdminInClient)

  return (
    <>
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="end" alignItems="center">
        <Tooltip
          open={isAdmin && !isAdminInClient ? undefined : false}
          title={t('list.adminEnableInfo')}
        >
          <span>
            <Button
              startIcon={<PlusOneIcon />}
              variant="contained"
              size="small"
              disabled={!canAddKey}
              onClick={openDrawer}
            >
              {tCommon('addBtn')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
      {canAddKey && (
        <ClientAddPublicKeyDrawer isOpen={isOpen} onClose={closeDrawer} clientId={clientId} />
      )}
    </>
  )
}

export const ClientAddPublicKeyButtonSkeleton: React.FC = () => {
  return (
    <Stack sx={{ mb: 2 }} direction="row" justifyContent="end" alignItems="center" spacing={2}>
      <ButtonSkeleton size="small" width={116} />
    </Stack>
  )
}
