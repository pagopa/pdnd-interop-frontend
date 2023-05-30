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
import { useCurrentRoute } from '@/router'
import type { ProviderOrConsumer } from '@/types/common.types'
import { isAttributeOwned, isAttributeGroupFullfilled } from '@/utils/attribute.utils'

export const AgreementCertifiedAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { t: tAttribute } = useTranslation('attribute', { keyPrefix: 'certified' })
  const { mode } = useCurrentRoute()

  const { eserviceAttributes, partyAttributes } = useAgreementDetailsContext()

  const certifiedAttributeGroups = eserviceAttributes?.certified ?? []
  const ownedCertifiedAttributes = partyAttributes?.certified ?? []

  function getGroupContainerProps(
    group: RemappedEServiceAttribute
  ): React.ComponentProps<typeof _AttributeGroupContainer> {
    const isGroupFulfilled = isAttributeGroupFullfilled(
      'certified',
      ownedCertifiedAttributes,
      group
    )
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
        {certifiedAttributeGroups.map((group, i) => (
          <_AttributeGroupContainer {...getGroupContainerProps(group)} key={i}>
            <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
              {group.attributes.map((attribute) => (
                <_AttributeContainer
                  key={attribute.id}
                  attribute={attribute}
                  checked={isAttributeOwned('certified', attribute.id, ownedCertifiedAttributes)}
                />
              ))}
            </Stack>
          </_AttributeGroupContainer>
        ))}
      </Stack>
      {certifiedAttributeGroups.length === 0 && (
        <_AttributeGroupContainer title={t('certified.emptyLabel')} color="gray" />
      )}
    </SectionContainer>
  )
}
