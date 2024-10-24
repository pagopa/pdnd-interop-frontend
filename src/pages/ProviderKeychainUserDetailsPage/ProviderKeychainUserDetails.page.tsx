import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useParams } from '@/router'
import { useTranslation } from 'react-i18next'
import { Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useGetProducerKeychainUserActions } from '../ProviderKeychainDetailsPage/hooks/useGetProducerKeychainUserActions'
import {
  ProviderKeychainUserDetailsGeneralInfoSection,
  ProviderKeychainUserDetailsGeneralInfoSectionSkeleton,
} from './components/ProviderKeychainUserDetailsGeneralInfoSection'
import { SelfcareQueries } from '@/api/selfcare'

const ProviderKeychainUserDetailsPage: React.FC = () => {
  const { t } = useTranslation('keychain')

  const { keychainId, userId } = useParams<'PROVIDE_KEYCHAIN_USER_DETAILS'>()
  const { data: user, isLoading } = useQuery(SelfcareQueries.getSingleUser(userId))
  const operatorFullname = `${user?.name} ${user?.familyName}`

  const { actions } = useGetProducerKeychainUserActions({ keychainId, userId })

  return (
    <PageContainer
      isLoading={isLoading}
      title={operatorFullname}
      topSideActions={actions}
      backToAction={{
        label: t('actions.backToMemberListLabel'),
        to: 'PROVIDE_KEYCHAIN_DETAILS',
        urlParams: { tab: 'members' },
        params: { keychainId },
      }}
    >
      <Grid spacing={2} container>
        <Grid item xs={7}>
          <React.Suspense fallback={<ProviderKeychainUserDetailsGeneralInfoSectionSkeleton />}>
            <ProviderKeychainUserDetailsGeneralInfoSection
              keychainId={keychainId}
              userId={userId}
            />
          </React.Suspense>
        </Grid>
      </Grid>
    </PageContainer>
  )
}

export default ProviderKeychainUserDetailsPage
