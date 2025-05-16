import { AuthHooks } from '@/api/auth'
import { ClientQueries } from '@/api/client'
import { HeadSection, HeadSectionSkeleton } from '@/components/shared/HeadSection'
import { useDrawerState } from '@/hooks/useDrawerState'
import { keepPreviousData, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ClientAddPublicKeyDrawer } from './ClientAddPublicKeyDrawer'
import { match } from 'ts-pattern'
import type { ActionItemButton } from '@/types/common.types'
import PlusOneIcon from '@mui/icons-material/PlusOne'

type ClientPublicKeysHeadSectionProps = {
  clientId: string
}

export const ClientPublicKeysHeadSection: React.FC<ClientPublicKeysHeadSectionProps> = ({
  clientId,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t } = useTranslation('key')
  const { jwt, isSupport } = AuthHooks.useJwt()

  const { data: usersIds } = useSuspenseQuery({
    ...ClientQueries.getOperatorsList(clientId),
    select: (users) => users.map((user) => user.userId),
  })

  const { isOpen, openDrawer, closeDrawer } = useDrawerState()

  const isInClient = Boolean(jwt && usersIds.includes(jwt.uid))

  const { data } = useQuery({
    //TODO: Fix this
    ...ClientQueries.getKeyList({ clientId, limit: 1, offset: 0 }),
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

  const tooltipLabel = match({ hasReachedPublicKeysLimit, isSupport, isInClient })
    .with({ hasReachedPublicKeysLimit: true }, () => t('list.publicKeyLimitInfo'))
    .with({ isSupport: true }, () => t('list.supportDisableInfo'))
    .with({ isInClient: false }, () => t('list.userEnableInfo'))
    .otherwise(() => undefined)

  const addPublicKeyAction: ActionItemButton = {
    action: openDrawer,
    label: tCommon('addBtn'),
    icon: PlusOneIcon,
    disabled: canNotAddKey,
    variant: 'contained',
    tooltip: tooltipLabel,
  }

  return (
    <>
      <HeadSection
        title={t('list.title')}
        description={t('list.description')}
        headVariant="secondary"
        actions={[addPublicKeyAction]}
      />
      {!canNotAddKey && (
        <ClientAddPublicKeyDrawer isOpen={isOpen} onClose={closeDrawer} clientId={clientId} />
      )}
    </>
  )
}

export const ClientPublicKeysHeadSectionSkeleton: React.FC = () => {
  return <HeadSectionSkeleton headVariant="secondary" />
}
