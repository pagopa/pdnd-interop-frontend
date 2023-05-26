import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../AgreementDetailsContext'
import type { FrontendAttribute } from '@/types/attribute.types'
import { getAttributeState, isGroupFullfilled } from '../../agreement-details.utils'
import {
  SectionContainer,
  _AttributeGroupContainer,
  _AttributeContainer,
} from '@/components/layout/containers'
import { Link, Stack } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { AttributeMutations } from '@/api/attribute'
import type { ProviderOrConsumer } from '@/types/common.types'

export const AgreementDeclaredAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { isAdmin } = useJwt()
  const { isEditPath, mode } = useCurrentRoute()
  const { mutate: declareAttribute } = AttributeMutations.useDeclarePartyAttribute()

  const { eserviceAttributes, partyAttributes, isAgreementEServiceMine } =
    useAgreementDetailsContext()

  const declaredAttributeGroups = eserviceAttributes?.declared ?? []
  const ownedDeclaredAttributes = partyAttributes?.declared ?? []

  const handleDeclareAttribute = (attributeId: string) => {
    declareAttribute({
      id: attributeId,
    })
  }

  const getAttributeActions = (attributeId: string) => {
    // The user can declare his own attributes only in the agreement create/edit view...
    if (!isEditPath || !isAdmin) return []
    if (isAgreementEServiceMine) return []
    const isDeclared = getAttributeState(ownedDeclaredAttributes, attributeId) === 'ACTIVE'
    // ... and only if it is not alread declared
    if (isDeclared) return []

    return [
      {
        label: t('declared.actions.declare'),
        action: handleDeclareAttribute,
      },
    ]
  }

  function getGroupContainerProps(
    group: FrontendAttribute
  ): React.ComponentProps<typeof _AttributeGroupContainer> {
    const isGroupFulfilled = isGroupFullfilled(ownedDeclaredAttributes, group)
    const state = isGroupFulfilled ? 'fullfilled' : 'unfullfilled'
    const providerOrConsumer = mode as ProviderOrConsumer

    return {
      title: t(`states.${providerOrConsumer}.${state}`),
      color: isGroupFulfilled ? 'success' : 'error',
    }
  }

  return (
    <SectionContainer
      newDesign
      innerSection
      title={t('declared.title')}
      description={
        <>
          {t('declared.subtitle')}{' '}
          <Link component={'a'} underline="hover" target="_blank" href={attributesHelpLink}>
            {t('howLink')}
          </Link>
        </>
      }
    >
      <Stack spacing={2}>
        {declaredAttributeGroups.map((group, i) => (
          <_AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute) => (
                <_AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  checked={getAttributeState(ownedDeclaredAttributes, attribute.id) === 'ACTIVE'}
                  actions={getAttributeActions(attribute.id)}
                />
              ))}
            </Stack>
          </_AttributeGroupContainer>
        ))}
      </Stack>
      {declaredAttributeGroups.length === 0 && (
        <_AttributeGroupContainer title={t('declared.emptyLabel')} color="gray" />
      )}
    </SectionContainer>
  )
}
