import React, { Suspense } from 'react'
import { PageContainer, PageContainerSkeleton } from '@/components/layout/containers'
import { useJwt } from '@/hooks/useJwt'
import {
  CertifiedPartyAttributesList,
  CertifiedPartyAttributesListSkeleton,
  DeclaredPartyAttributesList,
  DeclaredPartyAttributesListSkeleton,
  PartyContacts,
  PartyContactsSkeleton,
  RevokedDeclaredPartyAttributesList,
  RevokedDeclaredPartyAttributesListSkeleton,
  VerifiedPartyAttributesList,
  VerifiedPartyAttributesListSkeleton,
} from './components'

const PartyRegistryPage: React.FC = () => {
  const { jwt } = useJwt()
  const pageTitle = jwt?.organization.name ?? ''

  return (
    <PageContainer title={pageTitle}>
      <Suspense fallback={<PartyRegistryPageSkeleton />}>
        <PartyContacts />
        <CertifiedPartyAttributesList />
        <VerifiedPartyAttributesList />
        <DeclaredPartyAttributesList />
        <RevokedDeclaredPartyAttributesList />
      </Suspense>
    </PageContainer>
  )
}

const PartyRegistryPageSkeleton: React.FC = () => {
  return (
    <PageContainerSkeleton>
      <PartyContactsSkeleton />
      <CertifiedPartyAttributesListSkeleton />
      <VerifiedPartyAttributesListSkeleton />
      <DeclaredPartyAttributesListSkeleton />
      <RevokedDeclaredPartyAttributesListSkeleton />
    </PageContainerSkeleton>
  )
}

export default PartyRegistryPage
