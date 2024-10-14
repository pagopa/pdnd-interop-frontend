import { AuthHooks } from '@/api/auth'
import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { Button, Stack, Tooltip } from '@mui/material'
import { keepPreviousData, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { ButtonSkeleton } from '@/components/shared/MUI-skeletons'
import { useDrawerState } from '@/hooks/useDrawerState'
import { KeychainAddPublicKeyDrawer } from './KeychainAddPublicKeyDrawer'
import { match } from 'ts-pattern'

type KeychainAddPublicKeyButtonProps = {
  keychainId: string
}

export const KeychainAddPublicKeyButton: React.FC<KeychainAddPublicKeyButtonProps> = ({
  keychainId,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('keychain')
  const { jwt, isSupport } = AuthHooks.useJwt()

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const { data: usersIds } = useSuspenseQuery({
    ...KeychainQueries.getProducerKeychainUsersList(keychainId),
    select: (users) => users.map((user) => user.userId),
  })

  const isInKeychain = Boolean(jwt && usersIds.includes(jwt.uid))

  const { data: keys } = useQuery({
    ...KeychainQueries.getProducerKeychainKeysList({ producerKeychainId: keychainId }),
    placeholderData: keepPreviousData,
    select: (data) => data.keys,
  })

  const publicKeys = keys || []
  const publicKeysLimit = 30
  const hasReachedPublicKeysLimit = publicKeys.length >= publicKeysLimit

  const canNotAddKey = isSupport || !isInKeychain || hasReachedPublicKeysLimit

  const tooltipProps = match({ hasReachedPublicKeysLimit, isSupport, isInKeychain })
    .with({ hasReachedPublicKeysLimit: true }, () => ({
      open: undefined,
      title: t('publicKey.list.publicKeyLimitInfo'),
    }))
    .with({ isSupport: true }, () => ({
      open: undefined,
      title: t('publicKey.list.supportDisableInfo'),
    }))
    .with({ isInKeychain: false }, () => ({
      open: undefined,
      title: t('publicKey.list.userEnableInfo'),
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
        <KeychainAddPublicKeyDrawer isOpen={isOpen} onClose={closeDrawer} keychainId={keychainId} />
      )}
    </>
  )
}

export const KeychainAddPublicKeyButtonSkeleton: React.FC = () => {
  return (
    <Stack sx={{ mb: 2 }} direction="row" justifyContent="end" alignItems="center" spacing={2}>
      <ButtonSkeleton size="small" width={116} />
    </Stack>
  )
}
