import React from 'react'
import { PartyQueries } from '@/api/party/party.hooks'
import { useTranslation } from 'react-i18next'
import { AttributesContainer } from './AttributesContainer'
import { EmptyAttributesAlert } from './EmptyAttributesAlert'
import { Stack } from '@mui/material'
import { _AttributeContainer, _AttributeContainerSkeleton } from '@/components/layout/containers'

export const VerifiedAttributes = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.verified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'verified' })

  return (
    <AttributesContainer title={tAttribute('label')} description={t('description')}>
      <React.Suspense fallback={<VerifiedAttributesListSkeleton />}>
        <VerifiedAttributesList />
      </React.Suspense>
    </AttributesContainer>
  )
}

const VerifiedAttributesList: React.FC = () => {
  const { data } = PartyQueries.useGetActiveUserParty()
  const verifiedAttributes = data?.attributes.verified ?? []

  if (verifiedAttributes.length === 0) {
    return <EmptyAttributesAlert type="verified" />
  }

  return (
    <Stack spacing={1}>
      {verifiedAttributes.map((attribute) => (
        <_AttributeContainer key={attribute.id} checked attribute={attribute} />
      ))}
    </Stack>
  )
}

const VerifiedAttributesListSkeleton: React.FC = () => {
  return (
    <Stack spacing={1}>
      <_AttributeContainerSkeleton checked />
      <_AttributeContainerSkeleton checked />
      <_AttributeContainerSkeleton checked />
    </Stack>
  )
}
