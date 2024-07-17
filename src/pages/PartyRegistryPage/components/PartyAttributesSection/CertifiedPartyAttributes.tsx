import React from 'react'
import { PartyQueries } from '@/api/tenant/party.hooks'
import { Trans, useTranslation } from 'react-i18next'
import { AttributesContainer } from './AttributesContainer'
import { EmptyAttributesAlert } from './EmptyAttributesAlert'
import { Link, Stack } from '@mui/material'
import { AttributeContainer, AttributeContainerSkeleton } from '@/components/layout/containers'
import { attributesHelpLink } from '@/config/constants'
import { isAttributeRevoked } from '@/utils/attribute.utils'

export const CertifiedAttributes = () => {
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'certified' })

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
      <React.Suspense fallback={<CertifiedAttributesListSkeleton />}>
        <CertifiedAttributesList />
      </React.Suspense>
    </AttributesContainer>
  )
}

const CertifiedAttributesList: React.FC = () => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group.manage' })

  const { data } = PartyQueries.useGetActiveUserParty()
  const CertifiedAttributes = data?.attributes.certified ?? []
  if (CertifiedAttributes.length === 0) {
    return <EmptyAttributesAlert type="certified" />
  }

  return (
    <Stack sx={{ listStyleType: 'none', pl: 0 }} component="ul" spacing={1}>
      {CertifiedAttributes.map((attribute) => {
        const isRevoked = isAttributeRevoked('certified', attribute)
        const chipLabel = isRevoked ? t('revokedByCertifier') : undefined
        return (
          <li key={attribute.id}>
            <AttributeContainer checked={!isRevoked} attribute={attribute} chipLabel={chipLabel} />
          </li>
        )
      })}
    </Stack>
  )
}

const CertifiedAttributesListSkeleton: React.FC = () => {
  return (
    <Stack spacing={1}>
      <AttributeContainerSkeleton checked />
      <AttributeContainerSkeleton checked />
      <AttributeContainerSkeleton checked />
    </Stack>
  )
}
