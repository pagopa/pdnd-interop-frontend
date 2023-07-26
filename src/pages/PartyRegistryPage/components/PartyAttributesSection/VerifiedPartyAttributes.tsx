import React from 'react'
import { PartyQueries } from '@/api/party/party.hooks'
import { Trans, useTranslation } from 'react-i18next'
import { AttributesContainer } from './AttributesContainer'
import { EmptyAttributesAlert } from './EmptyAttributesAlert'
import { Link, Stack } from '@mui/material'
import { AttributeContainer, AttributeContainerSkeleton } from '@/components/layout/containers'
import { attributesHelpLink } from '@/config/constants'
import { isAttributeRevoked } from '@/utils/attribute.utils'
import type { VerifiedTenantAttribute } from '@/api/api.generatedTypes'

export const VerifiedAttributes = () => {
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'verified' })

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
      <React.Suspense fallback={<VerifiedAttributesListSkeleton />}>
        <VerifiedAttributesList />
      </React.Suspense>
    </AttributesContainer>
  )
}

const VerifiedAttributesList: React.FC = () => {
  const { data } = PartyQueries.useGetActiveUserParty()
  const verifiedAttributes = data?.attributes.verified ?? []

  if (verifiedAttributes.length === 0) {
    return <EmptyAttributesAlert type="verified" />
  }

  return (
    <Stack sx={{ listStyleType: 'none', pl: 0 }} component="ul" spacing={1}>
      {verifiedAttributes.map((attribute) => {
        // if it is verified and revoked by some provider then we need to show both
        if (attribute.revokedBy.length > 0 && attribute.verifiedBy.length > 0) {
          return (
            <React.Fragment key={attribute.id}>
              <VerifiedAttributesListItem attribute={attribute} isRevoked={true} />
              <VerifiedAttributesListItem attribute={attribute} isRevoked={false} />
            </React.Fragment>
          )
        }
        const isRevoked = isAttributeRevoked('verified', attribute)
        return (
          <VerifiedAttributesListItem
            key={attribute.id}
            attribute={attribute}
            isRevoked={isRevoked}
          />
        )
      })}
    </Stack>
  )
}

const VerifiedAttributesListItem: React.FC<{
  attribute: VerifiedTenantAttribute
  isRevoked: boolean
}> = ({ attribute, isRevoked }) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group.manage' })

  const chipLabel = isRevoked ? t('revokedByProducer') : undefined

  return (
    <li>
      <AttributeContainer chipLabel={chipLabel} checked={!isRevoked} attribute={attribute} />
    </li>
  )
}

const VerifiedAttributesListSkeleton: React.FC = () => {
  return (
    <Stack spacing={1}>
      <AttributeContainerSkeleton />
      <AttributeContainerSkeleton checked />
      <AttributeContainerSkeleton />
    </Stack>
  )
}
