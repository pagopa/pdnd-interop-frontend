import React from 'react'
import { AttributeContainer, AttributeContainerSkeleton } from '@/components/layout/containers'
import { Link, Stack } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import { PartyQueries } from '@/api/party/party.hooks'
import { AttributeMutations } from '@/api/attribute'
import { AttributesContainer } from './AttributesContainer'
import { EmptyAttributesAlert } from './EmptyAttributesAlert'
import { isAttributeRevoked } from '@/utils/attribute.utils'
import { attributesHelpLink } from '@/config/constants'
import type { DeclaredTenantAttribute } from '@/api/api.generatedTypes'
import { AuthHooks } from '@/api/auth'

export const DeclaredAttributes = () => {
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'declared' })

  return (
    <AttributesContainer
      title={tAttribute('label')}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tAttribute('description')}
        </Trans>
      }
    >
      <React.Suspense fallback={<DeclaredAttributesListSkeleton />}>
        <DeclaredAttributesList />
      </React.Suspense>
    </AttributesContainer>
  )
}

const DeclaredAttributesList: React.FC = () => {
  const { data } = PartyQueries.useGetActiveUserParty()
  const declaredAttributes = data?.attributes.declared ?? []

  if (declaredAttributes.length === 0) {
    return <EmptyAttributesAlert type="declared" />
  }

  return (
    <Stack sx={{ listStyleType: 'none', pl: 0 }} component="ul" spacing={1}>
      {declaredAttributes.map((attribute) => (
        <DeclaredAttributesListItem key={attribute.id} attribute={attribute} />
      ))}
    </Stack>
  )
}

const DeclaredAttributesListItem: React.FC<{ attribute: DeclaredTenantAttribute }> = ({
  attribute,
}) => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.declared' })
  const { t: tAttribute } = useTranslation('attribute')

  const { isAdmin } = AuthHooks.useJwt()
  const { mutate: revokeDeclaredAttribute } = AttributeMutations.useRevokeDeclaredPartyAttribute()
  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute()

  const isRevoked = isAttributeRevoked('declared', attribute)

  const actions = React.useMemo<React.ComponentProps<typeof AttributeContainer>['actions']>(() => {
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
  }, [isRevoked, revokeDeclaredAttribute, declareAttribute, t, isAdmin])

  return (
    <li>
      <AttributeContainer
        chipLabel={isRevoked ? tAttribute('group.manage.revokedByOwnParty') : undefined}
        checked={!isRevoked}
        actions={actions}
        attribute={attribute}
      />
    </li>
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
