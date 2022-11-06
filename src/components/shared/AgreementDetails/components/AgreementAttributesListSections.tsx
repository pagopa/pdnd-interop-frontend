import { AttributeMutations, AttributeQueries } from '@/api/attribute'
import {
  AttributeContainerRow,
  AttributeGroupContainer,
  SectionContainer,
} from '@/components/layout/containers'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { FrontendAttribute } from '@/types/attribute.types'
import { Alert, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

const AgreementAttributesListSections: React.FC = () => {
  return (
    <>
      <AgreementCertifiedAttributesSection />
      <AgreementVerifiedAttributesSection />
      <AgreementDeclaredAttributesSection />
    </>
  )
}

const AgreementCertifiedAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes.certified' })

  const { mode } = useCurrentRoute()
  const { eserviceAttributes, isAgreementEServiceMine, agreement } = useAgreementDetailsContext()
  const { jwt } = useJwt()

  const partyId = mode === 'provider' ? agreement?.consumer.id : jwt?.organizationId
  const { data: ownedCertifiedAttributes = [] } = AttributeQueries.useGetPartyCertifiedList(partyId)

  const certifiedAttributeGroups = eserviceAttributes.certified
  const ownedCertifiedAttributesIds = ownedCertifiedAttributes.map(({ id }) => id)

  const isAttributeOwned = (attributeId: string) => {
    return ownedCertifiedAttributesIds.includes(attributeId)
  }

  const isGroupFullfilled = (group: FrontendAttribute) => {
    return group.attributes.some(({ id }) => isAttributeOwned(id))
  }

  return (
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Subtitle>{t('subtitle')}</SectionContainer.Subtitle>
      <SectionContainer.Content>
        <Stack spacing={2}>
          {certifiedAttributeGroups.map((group, i) => (
            <AttributeGroupContainer
              key={i}
              groupNum={i + 1}
              headerContent={
                !isAgreementEServiceMine && (
                  <StatusChip
                    for="attribute"
                    kind="CERTIFIED"
                    state={isGroupFullfilled(group) ? 'ACTIVE' : undefined}
                  />
                )
              }
            >
              <Stack sx={{ m: 0, listStyle: 'none', px: 0 }} component="ul">
                {group.attributes.map((attribute, i) => (
                  <AttributeContainerRow
                    key={attribute.id}
                    attribute={attribute}
                    state={
                      isAttributeOwned(attribute.id) && !isAgreementEServiceMine
                        ? 'ACTIVE'
                        : undefined
                    }
                    kind="CERTIFIED"
                    showOrLabel={i !== group.attributes.length - 1}
                  />
                ))}
              </Stack>
            </AttributeGroupContainer>
          ))}
        </Stack>
        {certifiedAttributeGroups.length === 0 && <Alert severity="info">{t('emptyLabel')}</Alert>}
      </SectionContainer.Content>
    </SectionContainer>
  )
}

const AgreementVerifiedAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes.verified' })

  const { agreement, eserviceAttributes, isAgreementEServiceMine } = useAgreementDetailsContext()
  const { mode } = useCurrentRoute()
  const { jwt } = useJwt()
  const partyId = mode === 'provider' ? agreement?.consumer.id : jwt?.organizationId
  const { data: ownedVerifiedAttributes = [] } = AttributeQueries.useGetPartyVerifiedList(partyId)

  const { mutate: verifyAttribute } = AttributeMutations.useVerifyPartyAttribute()
  const { mutate: revokeAttibute } = AttributeMutations.useRevokeVerifiedPartyAttribute()

  const verifiedAttributeGroups = eserviceAttributes.verified
  const ownedVerifiedAttributesIds = ownedVerifiedAttributes.map(({ id }) => id)

  const isAttributeOwned = (attributeId: string) => {
    return ownedVerifiedAttributesIds.includes(attributeId)
  }

  const isGroupFullfilled = (group: FrontendAttribute) => {
    return group.attributes.some(({ id }) => isAttributeOwned(id))
  }

  const handleVerifyAttribute = (attributeId: string) => {
    if (!agreement?.consumer.id) return
    verifyAttribute({
      partyId: agreement.consumer.id,
      id: attributeId,
      renewal: 'AUTOMATIC_RENEWAL',
    })
  }

  const handleRevokeAttribute = (attributeId: string) => {
    if (!agreement?.consumer.id) return
    revokeAttibute({
      partyId: agreement.consumer.id,
      attributeId,
    })
  }

  const getAttributeActions = (attributeId: string) => {
    if (mode === 'consumer') return []
    if (isAgreementEServiceMine) return []
    const isOwned = isAttributeOwned(attributeId)
    const attributeActions = [
      {
        label: 'Verifica',
        action: handleVerifyAttribute,
        ...(isOwned ? { sx: { visibility: 'hidden' } } : {}),
      },
      {
        label: 'Revoca',
        action: handleRevokeAttribute,
        ...(!isOwned ? { sx: { visibility: 'hidden' } } : {}),
      },
    ]

    return attributeActions
  }

  return (
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Subtitle>{t('subtitle')}</SectionContainer.Subtitle>
      <SectionContainer.Content>
        <Stack spacing={2}>
          {verifiedAttributeGroups.map((group, i) => (
            <AttributeGroupContainer
              key={i}
              groupNum={i + 1}
              headerContent={
                !isAgreementEServiceMine && (
                  <StatusChip
                    for="attribute"
                    kind="VERIFIED"
                    state={isGroupFullfilled(group) ? 'ACTIVE' : undefined}
                  />
                )
              }
            >
              <Stack sx={{ m: 0, listStyle: 'none', px: 0 }} component="ul">
                {group.attributes.map((attribute, i) => (
                  <AttributeContainerRow
                    key={attribute.id}
                    attribute={attribute}
                    state={
                      isAttributeOwned(attribute.id) && !isAgreementEServiceMine
                        ? 'ACTIVE'
                        : undefined
                    }
                    kind="VERIFIED"
                    showOrLabel={i !== group.attributes.length - 1}
                    buttons={getAttributeActions(attribute.id)}
                  />
                ))}
              </Stack>
            </AttributeGroupContainer>
          ))}
        </Stack>

        {verifiedAttributeGroups.length === 0 && <Alert severity="info">{t('emptyLabel')}</Alert>}
      </SectionContainer.Content>
    </SectionContainer>
  )
}

const AgreementDeclaredAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes.declared' })

  const { mode } = useCurrentRoute()
  const { eserviceAttributes, isAgreementEServiceMine, agreement } = useAgreementDetailsContext()
  const { jwt } = useJwt()

  const partyId = mode === 'provider' ? agreement?.consumer.id : jwt?.organizationId
  const { data: ownedDeclaredAttributes = [] } = AttributeQueries.useGetPartyDeclaredList(partyId)

  const declaredAttributeGroups = eserviceAttributes.declared
  const ownedDeclaredAttributesIds = ownedDeclaredAttributes.map(({ id }) => id)

  const isAttributeOwned = (attributeId: string) => {
    return ownedDeclaredAttributesIds.includes(attributeId)
  }

  const isGroupFullfilled = (group: FrontendAttribute) => {
    return group.attributes.some(({ id }) => isAttributeOwned(id))
  }

  return (
    <SectionContainer>
      <SectionContainer.Title>{t('title')}</SectionContainer.Title>
      <SectionContainer.Subtitle>{t('subtitle')}</SectionContainer.Subtitle>
      <SectionContainer.Content>
        <Stack spacing={2}>
          {declaredAttributeGroups.map((group, i) => (
            <AttributeGroupContainer
              key={i}
              groupNum={i + 1}
              headerContent={
                !isAgreementEServiceMine && (
                  <StatusChip
                    for="attribute"
                    kind="DECLARED"
                    state={isGroupFullfilled(group) ? 'ACTIVE' : undefined}
                  />
                )
              }
            >
              <Stack sx={{ m: 0, listStyle: 'none', px: 0 }} component="ul">
                {group.attributes.map((attribute, i) => (
                  <AttributeContainerRow
                    key={attribute.id}
                    attribute={attribute}
                    state={
                      isAttributeOwned(attribute.id) && !isAgreementEServiceMine
                        ? 'ACTIVE'
                        : undefined
                    }
                    showOrLabel={i !== group.attributes.length - 1}
                    kind="DECLARED"
                  />
                ))}
              </Stack>
            </AttributeGroupContainer>
          ))}
        </Stack>
        {declaredAttributeGroups.length === 0 && <Alert severity="info">{t('emptyLabel')}</Alert>}
      </SectionContainer.Content>
    </SectionContainer>
  )
}

export default AgreementAttributesListSections
