import React from 'react'
import { AttributeQueries } from '@/api/attribute'
import { useJwt } from '@/hooks/useJwt'
import { PartyAttributesList, PartyAttributesListSkeleton } from './PartyAttributesList'
import { useTranslation } from 'react-i18next'

export const CertifiedPartyAttributesList = () => {
  const { jwt } = useJwt()
  const { t } = useTranslation('party', { keyPrefix: 'attributes.certified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'certified' })
  const { data: attributes = [] } = AttributeQueries.useGetPartyCertifiedList(jwt?.organizationId)

  return (
    <PartyAttributesList
      title={tAttribute('label')}
      description={t('description')}
      noAttributesLabel={t('noAttributesLabel')}
      attributes={attributes}
    />
  )
}

export const CertifiedPartyAttributesListSkeleton = () => {
  const { t } = useTranslation('party', { keyPrefix: 'attributes.certified' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'certified' })
  return <PartyAttributesListSkeleton title={tAttribute('label')} description={t('description')} />
}
