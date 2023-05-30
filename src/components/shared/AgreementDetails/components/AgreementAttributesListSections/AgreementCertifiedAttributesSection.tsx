import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAgreementDetailsContext } from '../../AgreementDetailsContext'
import type { RemappedEServiceAttribute } from '@/types/attribute.types'
import {
  SectionContainer,
  _AttributeGroupContainer,
  _AttributeContainer,
} from '@/components/layout/containers'
import { Link, Stack } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { useCurrentRoute } from '@/router'
import type { ProviderOrConsumer } from '@/types/common.types'
import { isAttributeOwned, isAttributeGroupFullfilled } from '@/utils/attribute.utils'

export const AgreementCertifiedAttributesSection: React.FC = () => {
  const { t } = useTranslation('agreement', { keyPrefix: 'read.attributes' })
  const { t: tCommon } = useTranslation('common')
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
      title={t('certified.title')}
      description={
        <>
          {t('certified.subtitle')}{' '}
          <Link component={'a'} underline="hover" target="_blank" href={attributesHelpLink}>
            {tCommon('howLink')}
          </Link>
        </>
      }
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
