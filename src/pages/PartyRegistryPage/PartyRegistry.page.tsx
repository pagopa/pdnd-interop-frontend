import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { PartyContactsSection, PartyAttributesSection } from './components'
import { AuthHooks } from '@/api/auth'

const PartyRegistryPage: React.FC = () => {
  const { jwt } = AuthHooks.useJwt()
  const pageTitle = jwt?.organization.name ?? ''

  return (
    <PageContainer isLoading={!jwt} title={pageTitle}>
      <PartyContactsSection />
      <PartyAttributesSection />
    </PageContainer>
  )
}

export default PartyRegistryPage
