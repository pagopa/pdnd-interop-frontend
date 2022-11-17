import React from 'react'
import { AttributeMutations, AttributeQueries } from '@/api/attribute'
import { useJwt } from '@/hooks/useJwt'
import { PartyAttributesList, PartyAttributesListSkeleton } from './PartyAttributesList'
import { useTranslation } from 'react-i18next'

export const DeclaredPartyAttributesList = () => {
  const { jwt } = useJwt()
  const { t } = useTranslation('party', { keyPrefix: 'attributes.activeDeclared' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'declared' })
  const { data: attributes = [] } = AttributeQueries.useGetPartyDeclaredList(jwt?.organizationId)
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

  const activeAttributes = attributes.filter((attribute) => attribute.state === 'ACTIVE')

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
