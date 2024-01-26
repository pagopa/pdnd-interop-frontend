import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import {
  PartyContactsSection,
  PartyAttributesSection,
  PartyContactsSectionSkeleton,
} from './components'
import { AuthHooks } from '@/api/auth'
import { PartyGeneralInfoSection } from './components/PartyGeneralInfoSection'

const PartyRegistryPage: React.FC = () => {
  const { jwt } = AuthHooks.useJwt()
  const pageTitle = jwt?.organization.name ?? ''

  return (
    <PageContainer title={pageTitle}>
      <React.Suspense fallback={<PartyContactsSectionSkeleton />}>
        <PartyGeneralInfoSection />
        <PartyContactsSection />
      </React.Suspense>
      <PartyAttributesSection />
    </PageContainer>
  )
}

export default PartyRegistryPage
