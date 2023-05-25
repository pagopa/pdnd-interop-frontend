import React from 'react'
import { PageContainer } from '@/components/layout/containers'
import { useJwt } from '@/hooks/useJwt'
import { PartyContactsSection, PartyAttributesSection } from './components'

const PartyRegistryPage: React.FC = () => {
  const { jwt } = useJwt()
  const pageTitle = jwt?.organization.name ?? ''

  return (
    <PageContainer isLoading={!jwt} title={pageTitle}>
      <PartyContactsSection />
      <PartyAttributesSection />
    </PageContainer>
  )
}

export default PartyRegistryPage
