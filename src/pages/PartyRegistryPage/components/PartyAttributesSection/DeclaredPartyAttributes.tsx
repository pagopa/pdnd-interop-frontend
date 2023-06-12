import React from 'react'
import { AttributeContainer, AttributeContainerSkeleton } from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { PartyQueries } from '@/api/party/party.hooks'
import { useJwt } from '@/hooks/useJwt'
import { AttributeMutations } from '@/api/attribute'
import { AttributesContainer } from './AttributesContainer'
import { EmptyAttributesAlert } from './EmptyAttributesAlert'
import { isAttributeRevoked } from '@/utils/attribute.utils'

export const DeclaredAttributes = () => {
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'declared' })

  return (
    <AttributesContainer title={tAttribute('label')} description={tAttribute('description')}>
      <React.Suspense fallback={<DeclaredAttributesListSkeleton />}>
        <DeclaredAttributesList />
      </React.Suspense>
    </AttributesContainer>
  )
}

const DeclaredAttributesList: React.FC = () => {
  const { isAdmin } = useJwt()
  const { t } = useTranslation('party', { keyPrefix: 'attributes.declared' })
  const { t: tAttribute } = useTranslation('attribute')

  const { data } = PartyQueries.useGetActiveUserParty()
  const declaredAttributes = data?.attributes.declared ?? []

  const { mutate: revokeDeclaredAttribute } = AttributeMutations.useRevokeDeclaredPartyAttribute()
  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute()

  function getAttributeActions(
    isRevoked: boolean
  ): Parameters<typeof AttributeContainer>[0]['actions'] {
    if (!isAdmin) return []

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
      {declaredAttributes.map((attribute) => {
        const isRevoked = isAttributeRevoked('declared', attribute)
        return (
          <li key={attribute.id}>
            <AttributeContainer
              chipLabel={isRevoked ? tAttribute('group.manage.revokedByOwnParty') : undefined}
              checked={!isAttributeRevoked('declared', attribute)}
              actions={getAttributeActions(isRevoked)}
              attribute={attribute}
            />
          </li>
        )
      })}
    </Stack>
  )
}

const DeclaredAttributesListSkeleton: React.FC = () => {
  return (
    <Stack spacing={1}>
      <AttributeContainerSkeleton checked />
      <AttributeContainerSkeleton checked />
      <AttributeContainerSkeleton />
    </Stack>
  )
}
