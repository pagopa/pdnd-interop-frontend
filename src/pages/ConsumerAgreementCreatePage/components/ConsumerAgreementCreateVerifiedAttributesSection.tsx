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

type ConsumerAgreementCreateVerifiedAttributesSectionProps = {
  agreementId: string
  consumerNotes: string
  onConsumerNotesChange: (value: string) => void
}

const ConsumerAgreementCreateVerifiedAttributesSection: React.FC<
  ConsumerAgreementCreateVerifiedAttributesSectionProps
> = ({ agreementId, consumerNotes, onConsumerNotesChange }) => {
  const { t: tAttribute } = useTranslation('attribute')

  const { descriptorAttributes } = useConsumerAgreementCreateContentContext()

  const verifiedAttributeGroups = descriptorAttributes?.verified ?? []

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
            {verifiedAttributeGroups.map((group, i) => (
              <AttributeGroupContainer
                key={i}
                title={tAttribute(`group.manage.warning.verified.consumer`)}
                color="warning"
              >
                <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
                  {group.map((attribute) => (
                    <AttributeContainer key={attribute.id} attribute={attribute} checked={false} />
                  ))}
                </Stack>
              </AttributeGroupContainer>
            ))}
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
