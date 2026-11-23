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
import { formatHierarchyWithoutParentRoot, getRootTenantFromHierarchy } from '@/utils/tenant.utils'

const PartyRegistryPage: React.FC = () => {
  const { jwt } = AuthHooks.useJwt()
  const { data: user } = TenantHooks.useGetActiveUserParty()
  const pageTitle =
    (formatHierarchyWithoutParentRoot(user, user?.parentTenants) || jwt?.organization.name) ?? ''
  const pageDescription = getRootTenantFromHierarchy(user?.parentTenants)

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
