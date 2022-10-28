import React from 'react'
import { AttributeQueries } from '@/api/attribute'
import { useJwt } from '@/hooks/useJwt'
import { PartyAttributesList, PartyAttributesListSkeleton } from './PartyAttributesList'
import { useTranslation } from 'react-i18next'

export const VerifiedPartyAttributesList = () => {
  const { jwt } = useJwt()
  const { t } = useTranslation('party', { keyPrefix: 'attributes.verified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'verified' })
  const { data: attributes = [] } = AttributeQueries.useGetPartyVerifiedList(jwt?.organizationId)

  return (
    <PartyAttributesList
      title={tAttribute('label')}
      description={t('description')}
      noAttributesLabel={t('noAttributesLabel')}
      attributes={attributes}
    />
  )
}

export const VerifiedPartyAttributesListSkeleton = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.verified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'verified' })
  return <PartyAttributesListSkeleton title={tAttribute('label')} description={t('description')} />
}
