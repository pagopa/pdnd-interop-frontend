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

  if (!jwt) return <PartyRegistryPageSkeleton />

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
    <>
      <PartyContactsSkeleton />
      <CertifiedPartyAttributesListSkeleton />
      <VerifiedPartyAttributesListSkeleton />
      <DeclaredPartyAttributesListSkeleton />
      <RevokedDeclaredPartyAttributesListSkeleton />
    </>
  )
}

export default PartyRegistryPage
