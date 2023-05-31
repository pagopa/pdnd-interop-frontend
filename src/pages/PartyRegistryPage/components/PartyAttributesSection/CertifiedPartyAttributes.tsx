import React from 'react'
import { PartyQueries } from '@/api/party/party.hooks'
import { useTranslation } from 'react-i18next'
import { AttributesContainer } from './AttributesContainer'
import { EmptyAttributesAlert } from './EmptyAttributesAlert'
import { Stack } from '@mui/material'
import { AttributeContainer, AttributeContainerSkeleton } from '@/components/layout/containers'

export const CertifiedAttributes = () => {
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'certified' })

  return (
    <AttributesContainer title={tAttribute('label')} description={tAttribute('description')}>
      <React.Suspense fallback={<CertifiedAttributesListSkeleton />}>
        <CertifiedAttributesList />
      </React.Suspense>
    </AttributesContainer>
  )
}

const CertifiedAttributesList: React.FC = () => {
  const { data } = PartyQueries.useGetActiveUserParty()
  const CertifiedAttributes = data?.attributes.certified ?? []

  if (CertifiedAttributes.length === 0) {
    return <EmptyAttributesAlert type="certified" />
  }

  return (
    <Stack sx={{ listStyleType: 'none', pl: 0 }} component="ul" spacing={1}>
      {CertifiedAttributes.map((attribute) => (
        <li key={attribute.id}>
          <AttributeContainer checked attribute={attribute} />
        </li>
      ))}
    </Stack>
  )
}

const CertifiedAttributesListSkeleton: React.FC = () => {
  return (
    <Stack spacing={1}>
      <AttributeContainerSkeleton checked />
      <AttributeContainerSkeleton checked />
      <AttributeContainerSkeleton checked />
    </Stack>
  )
}