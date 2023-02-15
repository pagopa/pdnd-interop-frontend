import React from 'react'
import { PartyAttributesList, PartyAttributesListSkeleton } from './PartyAttributesList'
import { useTranslation } from 'react-i18next'
import { PartyQueries } from '@/api/party/party.hooks'

export const VerifiedPartyAttributesList = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.verified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'verified' })
  const { data } = PartyQueries.useGetActiveUserParty()
  const verifiedAttributes = data?.attributes.verified ?? []

  return (
    <PartyAttributesList
      title={tAttribute('label')}
      description={t('description')}
      noAttributesLabel={t('noAttributesLabel')}
      attributes={verifiedAttributes}
    />
  )
}

export const VerifiedPartyAttributesListSkeleton = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.verified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'verified' })
  return <PartyAttributesListSkeleton title={tAttribute('label')} description={t('description')} />
}
