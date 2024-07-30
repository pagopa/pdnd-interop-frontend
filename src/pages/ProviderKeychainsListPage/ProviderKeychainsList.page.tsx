import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { ClientTable } from '@/components/shared/ClientTable'
import { useNavigate } from '@/router'
import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { KeychainsTable } from '@/components/shared/KeychainsTable'

const ProviderKeychainsList: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerKeychainsList' })
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const { isAdmin } = AuthHooks.useJwt()

  const topSideActions: Array<ActionItemButton> = [
    {
      action: () => navigate('SUBSCRIBE_CLIENT_CREATE'),
      label: tCommon('createNewBtn'),
      variant: 'contained',
      icon: PlusOneIcon,
    },
  ]

  return (
    <PageContainer
      title={t('title')}
      description={t('description')}
      topSideActions={isAdmin ? topSideActions : undefined}
    >
      <KeychainsTable clientKind="CONSUMER" />
    </PageContainer>
  )
}

export default ProviderKeychainsList
