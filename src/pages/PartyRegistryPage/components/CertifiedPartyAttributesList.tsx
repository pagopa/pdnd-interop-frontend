import React from 'react'
import { PartyAttributesList, PartyAttributesListSkeleton } from './PartyAttributesList'
import { useTranslation } from 'react-i18next'
import { PartyQueries } from '@/api/party/party.hooks'

export const CertifiedPartyAttributesList = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.certified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'certified' })
  const { data } = PartyQueries.useGetActiveUserParty()

  const certifiedAttributes = data?.attributes.certified ?? []

  return (
    <PartyAttributesList
      title={tAttribute('label')}
      description={t('description')}
      noAttributesLabel={t('noAttributesLabel')}
      attributes={certifiedAttributes}
    />
  )
}

export const CertifiedPartyAttributesListSkeleton = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.certified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'certified' })
  return <PartyAttributesListSkeleton title={tAttribute('label')} description={t('description')} />
}
