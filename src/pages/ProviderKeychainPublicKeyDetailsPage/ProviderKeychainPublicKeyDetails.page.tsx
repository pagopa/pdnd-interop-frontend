import { KeychainQueries } from '@/api/keychain/keychain.queries'
import { useParams } from '@/router'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import useGetProducerKeychainKeyActions from '../ProviderKeychainDetailsPage/hooks/useGetProducerKeychainKeyActions'
import { PageContainer } from '@/components/layout/containers'
import { Alert, Link as MUILink } from '@mui/material'
import {
  ProviderKeychainPublicKeyDetailsGeneralInfoSection,
  ProviderKeychainPublicKeyDetailsGeneralInfoSectionSkeleton,
} from './components/ProviderKeychainPublicKeyDetailsGeneralInfoSection'

const ProviderKeychainPublicKeyDetailsPage: React.FC = () => {
  const { t } = useTranslation('keychain')
  const { keychainId, keyId } = useParams<'PROVIDE_KEYCHAIN_PUBLIC_KEY_DETAILS'>()

  const { data: publicKey, isLoading } = useQuery(
    KeychainQueries.getProducerKeychainKey({ producerKeychainId: keychainId, keyId })
  )

  const { actions } = useGetProducerKeychainKeyActions({
    keychainId,
    keyId,
    parentId: publicKey?.user.userId,
  })

  return (
    <PageContainer
      isLoading={isLoading}
      title={publicKey?.name}
      topSideActions={actions}
      backToAction={{
        label: t('actions.backToKeychainsListLabel'),
        to: 'PROVIDE_KEYCHAIN_DETAILS',
        params: { keychainId },
        urlParams: { tab: 'publicKeys' },
      }}
    >
      <React.Suspense fallback={<ProviderKeychainPublicKeyDetailsGeneralInfoSectionSkeleton />}>
        {publicKey?.isOrphan && (
          <Alert severity="warning">
            <Trans components={{ 1: <MUILink href={'TODO'} target="_blank" /> }}>
              {t('publicKey.orphanKeyAlertLabel')}
            </Trans>
          </Alert>
        )}
        <ProviderKeychainPublicKeyDetailsGeneralInfoSection keychainId={keychainId} keyId={keyId} />
      </React.Suspense>
    </PageContainer>
  )
}

export default ProviderKeychainPublicKeyDetailsPage
