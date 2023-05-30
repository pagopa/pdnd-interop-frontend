import React from 'react'
import {
  _AttributeContainer,
  _AttributeContainerSkeleton,
  _AttributeGroupContainer,
} from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PartyQueries } from '@/api/party/party.hooks'
import { useJwt } from '@/hooks/useJwt'
import { AttributeMutations } from '@/api/attribute'
import { AttributesContainer } from './AttributesContainer'
import { EmptyAttributesAlert } from './EmptyAttributesAlert'
import type { DeclaredTenantAttribute } from '@/api/api.generatedTypes'
import { isAttributeRevoked } from '@/utils/attribute.utils'

export const DeclaredAttributes = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.declared' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'declared' })

  return (
    <AttributesContainer title={tAttribute('label')} description={t('description')}>
      <React.Suspense fallback={<DeclaredAttributesListSkeleton />}>
        <DeclaredAttributesList />
      </React.Suspense>
    </AttributesContainer>
  )
}

const DeclaredAttributesList: React.FC = () => {
  const { isAdmin } = useJwt()
  const { t } = useTranslation('party', { keyPrefix: 'attributes.declared' })

  const { data } = PartyQueries.useGetActiveUserParty()
  const declaredAttributes = data?.attributes.declared ?? []

  const { mutate: revokeDeclaredAttribute } = AttributeMutations.useRevokeDeclaredPartyAttribute()
  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute()

  function getAttributeActions(
    attribute: DeclaredTenantAttribute
  ): Parameters<typeof _AttributeContainer>[0]['actions'] {
    if (!isAdmin) return []

    const isRevoked = isAttributeRevoked('declared', attribute)

    if (!isRevoked)
      return [
        {
          label: t('revokeActionLabel'),
          action: (attributeId: string) => {
            revokeDeclaredAttribute({ attributeId })
          },
          color: 'error',
        },
      ]
    if (isRevoked)
      return [
        {
          label: t('declareActionLabel'),
          action: (id: string) => {
            declareAttribute({ id })
          },
        },
      ]
    return []
  }

  if (declaredAttributes.length === 0) {
    return <EmptyAttributesAlert type="declared" />
  }

  return (
    <Stack sx={{ listStyleType: 'none', pl: 0 }} component="ul" spacing={1}>
      {declaredAttributes.map((attribute) => (
        <li key={attribute.id}>
          <_AttributeContainer
            checked={!isAttributeRevoked('declared', attribute)}
            actions={getAttributeActions(attribute)}
            attribute={attribute}
          />
        </li>
      ))}
    </Stack>
  )
}

const DeclaredAttributesListSkeleton: React.FC = () => {
  return (
    <Stack spacing={1}>
      <_AttributeContainerSkeleton checked />
      <_AttributeContainerSkeleton checked />
      <_AttributeContainerSkeleton />
    </Stack>
  )
}
