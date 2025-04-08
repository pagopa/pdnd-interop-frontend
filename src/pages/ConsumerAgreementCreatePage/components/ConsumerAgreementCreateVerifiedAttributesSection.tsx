import {
  AttributeContainer,
  AttributeGroupContainer,
  SectionContainer,
} from '@/components/layout/containers'
import { attributesHelpLink } from '@/config/constants'
import { Divider, Link, Stack } from '@mui/material'
import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { ConsumerAgreementDocsInputSection } from './ConsumerAgreementDocsInputSection'
import { ConsumerNotesInputSection } from './ConsumerNotesInputSection'
import { useConsumerAgreementCreateContentContext } from '../ConsumerAgreementCreateContentContext'
import { TenantHooks } from '@/api/tenant'
import { isAttributeOwned } from '@/utils/attribute.utils'
import type { DescriptorAttribute, VerifiedTenantAttribute } from '@/api/api.generatedTypes'

type ConsumerAgreementCreateVerifiedAttributesSectionProps = {
  agreementId: string
  consumerNotes: string
  onConsumerNotesChange: (value: string) => void
}

const ConsumerAgreementCreateVerifiedAttributesSection: React.FC<
  ConsumerAgreementCreateVerifiedAttributesSectionProps
> = ({ agreementId, consumerNotes, onConsumerNotesChange }) => {
  const { t: tAttribute } = useTranslation('attribute')

  const { descriptorAttributes,agreement } = useConsumerAgreementCreateContentContext()

  const verifiedAttributeGroups = descriptorAttributes?.verified ?? []

  /**
   * To check if the consumer already has verified attributes from the active party
   */
  const { data: activeParty } = TenantHooks.useGetActiveUserParty()
  const ownedVerifiedAttributes = activeParty.attributes.verified

  return (
    <SectionContainer
      sx={{ borderRadius: 2 }}
      title={tAttribute('verified.label')}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tAttribute(`verified.description`)}
        </Trans>
      }
    >
      {verifiedAttributeGroups.length === 0 ? (
        <AttributeGroupContainer
          title={tAttribute(`noAttributesRequiredAlert.consumer`, {
            attributeKey: tAttribute(`type.verified_other`),
          })}
          color="gray"
        />
      ) : (
        <>
          <Stack spacing={2}>
            {verifiedAttributeGroups.map((attributesGroup, i) => {
              return (
                <VerifiedAttributesGroup
                  key={i}
                  attributesGroup={attributesGroup}
                  ownedVerifiedAttributes={ownedVerifiedAttributes}
                  verifiedId={agreement?.producer.id as string}
                  index={i}
                />
              )
            })}
          </Stack>
          <Divider sx={{ my: 3 }} />
          <ConsumerAgreementDocsInputSection agreementId={agreementId} />
          <Divider sx={{ my: 3 }} />
          <ConsumerNotesInputSection
            agreementId={agreementId}
            consumerNotes={consumerNotes}
            onConsumerNotesChange={onConsumerNotesChange}
          />
        </>
      )}
    </SectionContainer>
  )
}

export default ConsumerAgreementCreateVerifiedAttributesSection

type VerifiedAttributesGroupProps = {
  ownedVerifiedAttributes: VerifiedTenantAttribute[]
  attributesGroup: DescriptorAttribute[]
  index: number
  verifiedId: string
}
const VerifiedAttributesGroup: React.FC<VerifiedAttributesGroupProps> = ({
  attributesGroup,
  index,
  ownedVerifiedAttributes,
  verifiedId: verifierId,
}) => {
  const { t: tAttribute } = useTranslation('attribute')

  const hasAtLeastOneVerifiedAttribute = attributesGroup.some((group) =>
    isAttributeOwned('verified', group.id, ownedVerifiedAttributes, verifierId)
  )
  return (
    <AttributeGroupContainer
      key={index}
      title={
        hasAtLeastOneVerifiedAttribute
          ? tAttribute('group.manage.success.consumer')
          : tAttribute('group.manage.warning.verified.consumer')
      }
      color={hasAtLeastOneVerifiedAttribute ? 'success' : 'warning'}
    >
      <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
        {attributesGroup.map((attribute) => (
          <AttributeContainer key={attribute.id} attribute={attribute} checked={false} />
        ))}
      </Stack>
    </AttributeGroupContainer>
  )
}
