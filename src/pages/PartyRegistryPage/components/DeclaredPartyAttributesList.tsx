import React from 'react'
import { AttributeMutations } from '@/api/attribute'
import { PartyAttributesList, PartyAttributesListSkeleton } from './PartyAttributesList'
import { useTranslation } from 'react-i18next'
import { PartyQueries } from '@/api/party/party.hooks'

export const DeclaredPartyAttributesList = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.activeDeclared' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'declared' })
  const { data } = PartyQueries.useGetActiveUser()
  const declaredAttributes = data?.attributes.declared ?? []
  const { mutate: revokeDeclaredAttribute } = AttributeMutations.useRevokeDeclaredPartyAttribute()

  const handleRevokeDeclaredAttribute = (attributeId: string) => {
    revokeDeclaredAttribute({ attributeId })
  }

  const actions = [
    {
      label: t('revokeActionLabel'),
      action: handleRevokeDeclaredAttribute,
    },
  ]

  const activeAttributes = declaredAttributes.filter((attribute) => attribute.state === 'ACTIVE')

  return (
    <PartyAttributesList
      title={tAttribute('label')}
      description={t('description')}
      noAttributesLabel={t('noAttributesLabel')}
      attributes={activeAttributes}
      actions={actions}
    />
  )
}

export const DeclaredPartyAttributesListSkeleton = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.activeDeclared' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'declared' })
  return <PartyAttributesListSkeleton title={tAttribute('label')} description={t('description')} />
}
