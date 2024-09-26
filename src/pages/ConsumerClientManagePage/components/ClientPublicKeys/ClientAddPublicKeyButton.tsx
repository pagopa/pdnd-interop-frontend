import { ClientQueries } from '@/api/client'
import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import identity from 'lodash/identity'
import { Button, Stack, Tooltip } from '@mui/material'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { AuthHooks } from '@/api/auth'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { ClientAddPublicKeyDrawer } from './ClientAddPublicKeyDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { useSuspenseQuery } from '@tanstack/react-query'
import { match } from 'ts-pattern'

interface ClientAddPublicKeyButtonProps {
  clientId: string
}

export const ClientAddPublicKeyButton: React.FC<ClientAddPublicKeyButtonProps> = ({ clientId }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('key')
  const { jwt, isSupport } = AuthHooks.useJwt()
  const { data: users } = useSuspenseQuery(ClientQueries.getOperatorsList(clientId))

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const userQueries = useQueries({
    queries: users.map(({ userId }) => ClientQueries.getSingleOperator(userId)),
  })

  const usersId = userQueries.map(({ data }) => data?.userId).filter(identity)

  const isInClient = Boolean(jwt && usersId.includes(jwt.uid))

  const { data } = useQuery({
    ...ClientQueries.getKeyList({ clientId }),
    placeholderData: keepPreviousData,
  })

  const publicKeys = data?.keys || []
  const publicKeysLimit = 100
  const hasReachedPublicKeysLimit = publicKeys.length >= publicKeysLimit

  /**
   * The conditions to add keys are:
   * - do not be support
   * - be admin or security operator (this is implicit since the only users that can access the page have those roles) and be added in the client
   * - you have not reached the limit of keys that can be added (it is fixed to 100)
   */
  const canNotAddKey = isSupport || !isInClient || hasReachedPublicKeysLimit

  const tooltipProps = match({ hasReachedPublicKeysLimit, isSupport, isInClient })
    .with({ hasReachedPublicKeysLimit: true }, () => ({
      open: undefined,
      title: t('list.publicKeyLimitInfo'),
    }))
    .with({ isSupport: true }, () => ({
      open: undefined,
      title: t('list.supportDisableInfo'),
    }))
    .with({ isInClient: false }, () => ({
      open: undefined,
      title: t('list.userEnableInfo'),
    }))
    .otherwise(() => ({
      open: false,
      title: '',
    }))

  return (
    <>
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="end" alignItems="center">
        <Tooltip {...tooltipProps}>
          <span>
            <Button
              startIcon={<PlusOneIcon />}
              variant="contained"
              size="small"
              disabled={canNotAddKey}
              onClick={openDrawer}
            >
              {tCommon('addBtn')}
            </Button>
          </span>
        </Tooltip>
      </Stack>
      {!canNotAddKey && (
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
