import React, { Suspense } from 'react'
import { PageContainer } from '@/components/layout/containers'
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
      <Suspense fallback={<PartyContactsSkeleton />}>
        <PartyContacts />
      </Suspense>
      <Suspense fallback={<CertifiedPartyAttributesListSkeleton />}>
        <CertifiedPartyAttributesList />
      </Suspense>
      <Suspense fallback={<VerifiedPartyAttributesListSkeleton />}>
        <VerifiedPartyAttributesList />
      </Suspense>
      <Suspense fallback={<DeclaredPartyAttributesListSkeleton />}>
        <DeclaredPartyAttributesList />
      </Suspense>
      <Suspense fallback={<RevokedDeclaredPartyAttributesListSkeleton />}>
        <RevokedDeclaredPartyAttributesList />
      </Suspense>
    </PageContainer>
  )
}

export default PartyRegistryPage
