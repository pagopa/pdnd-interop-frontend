import React from 'react'
import { AttributeMutations, AttributeQueries } from '@/api/attribute'
import { useJwt } from '@/hooks/useJwt'
import { PartyAttributesList, PartyAttributesListSkeleton } from './PartyAttributesList'
import { useTranslation } from 'react-i18next'

export const RevokedDeclaredPartyAttributesList = () => {
  const { jwt } = useJwt()
  const { t } = useTranslation('party', { keyPrefix: 'attributes.revokedDeclared' })
  const { data: attributes = [] } = AttributeQueries.useGetPartyDeclaredList(jwt?.organizationId)
  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute()

  const handleDeclareAttribute = (id: string) => {
    declareAttribute({ id })
  }

  const actions = [
    {
      label: t('declareActionLabel'),
      action: handleDeclareAttribute,
    },
  ]

  const revokedAttributes = attributes.filter((attribute) => attribute.state === 'REVOKED')

  return (
    <PartyAttributesList
      title={t('title')}
      description={t('description')}
      noAttributesLabel={t('noAttributesLabel')}
      attributes={revokedAttributes}
      actions={actions}
      showRedBorder
    />
  )
}

export const RevokedDeclaredPartyAttributesListSkeleton = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.revokedDeclared' })
  return (
    <PartyAttributesListSkeleton title={t('title')} description={t('description')} showRedBorder />
  )
}
