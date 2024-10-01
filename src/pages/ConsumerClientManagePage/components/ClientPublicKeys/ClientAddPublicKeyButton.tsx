import { ClientQueries } from '@/api/client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Stack, Tooltip } from '@mui/material'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { AuthHooks } from '@/api/auth'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { ClientAddPublicKeyDrawer } from './ClientAddPublicKeyDrawer'
import { useDrawerState } from '@/hooks/useDrawerState'
import { useSuspenseQuery } from '@tanstack/react-query'

interface ClientAddPublicKeyButtonProps {
  clientId: string
}

export const ClientAddPublicKeyButton: React.FC<ClientAddPublicKeyButtonProps> = ({ clientId }) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('key')
  const { jwt, isSupport, isAdmin } = AuthHooks.useJwt()
  const { data: usersIds } = useSuspenseQuery({
    ...ClientQueries.getOperatorsList(clientId),
    select: (users) => users.map((user) => user.userId),
  })

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const isAdminInClient = Boolean(jwt && usersIds.includes(jwt.uid))

  const { data } = useQuery({
    ...ClientQueries.getKeyList({ clientId }),
    placeholderData: keepPreviousData,
  })

  const publicKeys = data?.keys || []
  const publicKeysLimit = 100
  const hasReachedPublicKeysLimit = publicKeys.length >= publicKeysLimit

  /**
   * There are no conditions about operator API because it doesn't have the necessary router permissions to navigate to this page
   * The conditions to add keys are:
   * - do not be support
   * - be admin and be added in the client
   * - you have not reached the limit of keys that can be added (it is fixed to 100)
   */
  const canNotAddKey = isSupport || (isAdmin && !isAdminInClient) || hasReachedPublicKeysLimit

  const getTooltipProps = () => {
    let tooltipProps: { open: boolean | undefined; title: string } = {
      open: false,
      title: '',
    }

    if (hasReachedPublicKeysLimit) {
      tooltipProps = {
        open: undefined,
        title: t('list.publicKeyLimitInfo'),
      }

      return tooltipProps
    }

    if (isAdmin && !isAdminInClient) {
      tooltipProps = {
        open: undefined,
        title: t('list.adminEnableInfo'),
      }

      return tooltipProps
    }

    if (isSupport) {
      tooltipProps = {
        open: undefined,
        title: t('list.supportDisableInfo'),
      }

      return tooltipProps
    }

    return tooltipProps
  }

  return (
    <>
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="end" alignItems="center">
        <Tooltip {...getTooltipProps()}>
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
