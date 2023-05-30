import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../AgreementDetailsContext'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import {
  SectionContainer,
  _AttributeGroupContainer,
  _AttributeContainer,
} from '@/components/layout/containers'
import { Stack } from '@mui/material'
import { useJwt } from '@/hooks/useJwt'
import { useCurrentRoute } from '@/router'
import { AttributeMutations } from '@/api/attribute'
import type { ProviderOrConsumer } from '@/types/common.types'
import { isAttributeOwned, isAttributeGroupFullfilled } from '@/utils/attribute.utils'

export const AgreementDeclaredAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'declared' })
  const { isAdmin } = useJwt()
  const { mode, routeKey } = useCurrentRoute()
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
    if (routeKey !== 'SUBSCRIBE_AGREEMENT_EDIT' || !isAdmin) return []
    if (isAgreementEServiceMine) return []
    const isDeclared = isAttributeOwned('declared', attributeId, ownedDeclaredAttributes)
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
    group: RemappedEServiceAttribute
  ): React.ComponentProps<typeof _AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled('declared', ownedDeclaredAttributes, group)
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
      title={tAttribute('label')}
      description={tAttribute('description')}
    >
      <Stack spacing={2}>
        {declaredAttributeGroups.map((group, i) => (
          <_AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute) => (
                <_AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  checked={isAttributeOwned('declared', attribute.id, ownedDeclaredAttributes)}
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
