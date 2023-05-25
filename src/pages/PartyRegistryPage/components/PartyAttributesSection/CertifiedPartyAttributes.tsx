import React from 'react'
import { PartyQueries } from '@/api/party/party.hooks'
import { useTranslation } from 'react-i18next'
import { AttributesContainer } from './AttributesContainer'
import { EmptyAttributesAlert } from './EmptyAttributesAlert'
import { Stack } from '@mui/material'
import { _AttributeContainer, _AttributeContainerSkeleton } from '@/components/layout/containers'

export const CertifiedAttributes = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.certified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'certified' })

  return (
    <AttributesContainer title={tAttribute('label')} description={t('description')}>
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
    <Stack component="ul" spacing={1}>
      {CertifiedAttributes.map((attribute) => (
        <li key={attribute.id}>
          <_AttributeContainer checked attribute={attribute} />
        </li>
      ))}
    </Stack>
  )
}

const CertifiedAttributesListSkeleton: React.FC = () => {
  return (
    <Stack spacing={1}>
      <_AttributeContainerSkeleton checked />
      <_AttributeContainerSkeleton checked />
      <_AttributeContainerSkeleton checked />
    </Stack>
  )
}
