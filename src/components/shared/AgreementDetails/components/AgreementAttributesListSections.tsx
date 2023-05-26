import { AttributeMutations } from '@/api/attribute'
import {
  AttributeContainerRow,
  AttributeGroupContainer,
  SectionContainer,
  SectionContainerSkeleton,
} from '@/components/layout/containers'
import { attributesHelpLink } from '@/config/constants'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { Alert, Link, Stack } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusChip } from '../../StatusChip'
import { getAttributeState, isGroupFullfilled } from '../agreement-details.utils'
import { useAgreementDetailsContext } from '../AgreementDetailsContext'

export const AgreementCertifiedAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes.certified' })
  const { t: tCommon } = useTranslation('common')

  const { eserviceAttributes, isAgreementEServiceMine, partyAttributes } =
    useAgreementDetailsContext()

  const certifiedAttributeGroups = eserviceAttributes?.certified
  const ownedCertifiedAttributes = partyAttributes?.certified

  if (!certifiedAttributeGroups || !ownedCertifiedAttributes)
    return <AgreementAttributesListSectionSkeleton />

  return (
    <SectionContainer
      title={t('title')}
      description={
        <>
          {t('subtitle')}{' '}
          <Link component={'a'} underline="hover" target="_blank" href={attributesHelpLink}>
            {tCommon('howLink')}
          </Link>
        </>
      }
    >
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
                  state={isGroupFullfilled(ownedCertifiedAttributes, group) ? 'ACTIVE' : undefined}
                />
              )
            }
          >
            <Stack sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute, i) => (
                <AttributeContainerRow
                  key={attribute.id}
                  attribute={attribute}
                  state={
                    !isAgreementEServiceMine
                      ? getAttributeState(ownedCertifiedAttributes, attribute.id)
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
    </SectionContainer>
  )
}

export const AgreementVerifiedAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes.verified' })
  const { t: tCommon } = useTranslation('common')
  const { mode } = useCurrentRoute()
  const { isAdmin } = useJwt()

  const { agreement, eserviceAttributes, partyAttributes, isAgreementEServiceMine } =
    useAgreementDetailsContext()

  const { mutate: verifyAttribute } = AttributeMutations.useVerifyPartyAttribute()
  const { mutate: revokeAttibute } = AttributeMutations.useRevokeVerifiedPartyAttribute()

  const verifiedAttributeGroups = eserviceAttributes?.verified
  const ownedVerifiedAttributes = partyAttributes?.verified

  if (!verifiedAttributeGroups || !ownedVerifiedAttributes)
    return <AgreementAttributesListSectionSkeleton />

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
    // The user can certify verified attributes in this view only if it is a provider...
    if (mode === 'consumer' || !isAdmin) return []
    // ... And only if the e-service does not belong to itself
    if (isAgreementEServiceMine) return []
    const isOwned = getAttributeState(ownedVerifiedAttributes, attributeId) === 'ACTIVE'

    const attributeActions = [
      {
        label: tCommon('actions.verify'),
        action: handleVerifyAttribute,
      },
      {
        label: tCommon('actions.revoke'),
        action: handleRevokeAttribute,
        ...(!isOwned ? { sx: { visibility: 'hidden' } } : {}),
        color: 'error' as const,
      },
    ]

    return attributeActions
  }

  return (
    <SectionContainer
      title={t('title')}
      description={
        <>
          {t('subtitle')}{' '}
          <Link component={'a'} underline="hover" target="_blank" href={attributesHelpLink}>
            {tCommon('howLink')}
          </Link>
        </>
      }
    >
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
                  state={isGroupFullfilled(ownedVerifiedAttributes, group) ? 'ACTIVE' : undefined}
                />
              )
            }
          >
            <Stack sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute, i) => (
                <AttributeContainerRow
                  key={attribute.id}
                  attribute={attribute}
                  state={
                    !isAgreementEServiceMine
                      ? getAttributeState(ownedVerifiedAttributes, attribute.id)
                      : undefined
                  }
                  kind="VERIFIED"
                  showOrLabel={i !== group.attributes.length - 1}
                  actions={getAttributeActions(attribute.id)}
                />
              ))}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>

      {verifiedAttributeGroups.length === 0 && <Alert severity="info">{t('emptyLabel')}</Alert>}
    </SectionContainer>
  )
}

export const AgreementDeclaredAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes.declared' })
  const { t: tCommon } = useTranslation('common')
  const { isAdmin } = useJwt()
  const { routeKey } = useCurrentRoute()
  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute()

  const { eserviceAttributes, partyAttributes, isAgreementEServiceMine } =
    useAgreementDetailsContext()

  const declaredAttributeGroups = eserviceAttributes?.declared
  const ownedDeclaredAttributes = partyAttributes?.declared

  if (!declaredAttributeGroups || !ownedDeclaredAttributes)
    return <AgreementAttributesListSectionSkeleton />

  const handleDeclareAttribute = (attributeId: string) => {
    declareAttribute({
      id: attributeId,
    })
  }

  const getAttributeActions = (attributeId: string) => {
    // The user can declare his own attributes only in the agreement create/edit view...
    if (routeKey !== 'SUBSCRIBE_AGREEMENT_EDIT' || !isAdmin) return []
    if (isAgreementEServiceMine) return []
    const isDeclared = getAttributeState(ownedDeclaredAttributes, attributeId) === 'ACTIVE'
    // ... and only if it is not alread declared
    if (isDeclared) return []

    return [
      {
        label: tCommon('actions.confirm'),
        action: handleDeclareAttribute,
      },
    ]
  }

  return (
    <SectionContainer
      title={t('title')}
      description={
        <>
          {t('subtitle')}{' '}
          <Link component={'a'} underline="hover" target="_blank" href={attributesHelpLink}>
            {tCommon('howLink')}
          </Link>
        </>
      }
    >
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
                  state={isGroupFullfilled(ownedDeclaredAttributes, group) ? 'ACTIVE' : undefined}
                />
              )
            }
          >
            <Stack sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute, i) => (
                <AttributeContainerRow
                  key={attribute.id}
                  attribute={attribute}
                  state={
                    !isAgreementEServiceMine
                      ? getAttributeState(ownedDeclaredAttributes, attribute.id)
                      : undefined
                  }
                  showOrLabel={i !== group.attributes.length - 1}
                  kind="DECLARED"
                  actions={getAttributeActions(attribute.id)}
                />
              ))}
            </Stack>
          </AttributeGroupContainer>
        ))}
      </Stack>
      {declaredAttributeGroups.length === 0 && <Alert severity="info">{t('emptyLabel')}</Alert>}
    </SectionContainer>
  )
}

export const AgreementAttributesListSectionSkeleton: React.FC = () => {
  return <SectionContainerSkeleton height={260} />
}
