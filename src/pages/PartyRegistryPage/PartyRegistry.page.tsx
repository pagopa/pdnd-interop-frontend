import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import {
  PartyContactsSection,
  PartyAttributesSection,
  PartyContactsSectionSkeleton,
} from './components'
import { AuthHooks } from '@/api/auth'
import { TenantHooks } from '@/api/tenant'
import { PartyGeneralInfoSection } from './components/PartyGeneralInfoSection'
import { getTenantPageTitle, getTenantPageDescription } from '@/utils/tenant.utils'

const PartyRegistryPage: React.FC = () => {
  const { jwt } = AuthHooks.useJwt()
  const { data: user } = TenantHooks.useGetActiveUserParty()
  const pageTitle = (getTenantPageTitle(user, user?.parentTenants) || jwt?.organization.name) ?? ''
  const pageDescription = getTenantPageDescription(user?.parentTenants)

  return (
    <PageContainer title={pageTitle} description={pageDescription}>
      <React.Suspense fallback={<PartyContactsSectionSkeleton />}>
        <PartyGeneralInfoSection />
        <PartyContactsSection />
      </React.Suspense>
      <PartyAttributesSection />
    </PageContainer>
  )
}

export default PartyRegistryPage
