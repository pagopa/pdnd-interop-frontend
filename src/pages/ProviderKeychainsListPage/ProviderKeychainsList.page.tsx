import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useTranslation } from 'react-i18next'
import { useNavigate } from '@/router'
import { AuthHooks } from '@/api/auth'
import type { ActionItemButton } from '@/types/common.types'
import PlusOneIcon from '@mui/icons-material/PlusOne'
import { KeychainsTable } from '@/components/shared/KeychainsTable'

const ProviderKeychainsListPage: React.FC = () => {
  const { t } = useTranslation('pages', { keyPrefix: 'providerKeychainsList' })
  const { t: tCommon } = useTranslation('common')
  const navigate = useNavigate()
  const { isAdmin } = AuthHooks.useJwt()

  const topSideActions: Array<ActionItemButton> = [
    {
      action: () => navigate('SUBSCRIBE_INTEROP_M2M_CLIENT_CREATE'), //puntare a crea nuovo portachiavi
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
      <KeychainsTable />
    </PageContainer>
  )
}

export default ProviderKeychainsListPage
