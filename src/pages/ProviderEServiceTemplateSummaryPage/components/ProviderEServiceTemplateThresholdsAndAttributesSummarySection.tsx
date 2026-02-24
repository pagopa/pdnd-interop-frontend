import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Stack, Box, Divider, Link, Typography } from '@mui/material'
import { InformationContainer } from '@pagopa/interop-fe-commons'
import { formatThousands } from '@/utils/format.utils'
import { useParams } from '@/router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EServiceTemplateQueries } from '@/api/eserviceTemplate'
import {
  SectionContainer,
  AttributeContainer,
  AttributeGroupContainer,
} from '@/components/layout/containers'
import type { DescriptorAttribute, DescriptorAttributes } from '@/api/api.generatedTypes'
import type { AttributeKey } from '@/types/attribute.types'
import { attributesHelpLink } from '@/config/constants'

export const ProviderEServiceTemplateThresholdsAndAttributesSummarySection: React.FC = () => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'summary.thresholdsAndAttributesSummary',
  })
  const params = useParams<'PROVIDE_ESERVICE_TEMPLATE_SUMMARY'>()

  const { data: eserviceTemplate } = useSuspenseQuery(
    EServiceTemplateQueries.getSingle(params.eServiceTemplateId, params.eServiceTemplateVersionId)
  )

  return (
    <Stack spacing={2}>
      <Typography variant="body2" fontWeight={600}>
        {t('thresholdsTitle')}
      </Typography>
      <InformationContainer
        label={t('dailyCallsPerConsumer.label')}
        content={t('dailyCallsPerConsumer.value', {
          value: eserviceTemplate.dailyCallsPerConsumer
            ? formatThousands(eserviceTemplate.dailyCallsPerConsumer)
            : 'n/a',
        })}
      />
      <InformationContainer
        label={t('dailyCallsTotal.label')}
        content={t('dailyCallsTotal.value', {
          value: eserviceTemplate.dailyCallsTotal
            ? formatThousands(eserviceTemplate.dailyCallsTotal)
            : 'n/a',
        })}
      />
      <TemplateSummaryAttributes descriptorAttributes={eserviceTemplate.attributes} />
    </Stack>
  )
}

type TemplateSummaryAttributesProps = {
  descriptorAttributes: DescriptorAttributes
}

const TemplateSummaryAttributes: React.FC<TemplateSummaryAttributesProps> = ({
  descriptorAttributes,
}) => {
  return (
    <>
      <TemplateSummaryAttributeSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="certified"
      />
      <Divider sx={{ my: 3 }} />
      <TemplateSummaryAttributeSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="verified"
      />
      <Divider sx={{ my: 3 }} />
      <TemplateSummaryAttributeSection
        descriptorAttributes={descriptorAttributes}
        attributeKey="declared"
      />
    </>
  )
}

type TemplateSummaryAttributeSectionProps = {
  descriptorAttributes: DescriptorAttributes
  attributeKey: AttributeKey
}

const TemplateSummaryAttributeSection: React.FC<TemplateSummaryAttributeSectionProps> = ({
  descriptorAttributes,
  attributeKey,
}) => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'summary.thresholdsAndAttributesSummary.attributes',
  })

  const attributeGroups = descriptorAttributes[attributeKey]

  return (
    <SectionContainer
      innerSection
      title={t(`${attributeKey}.label`)}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {t(`${attributeKey}.description`)}
        </Trans>
      }
    >
      {attributeGroups.length > 0 && (
        <Stack spacing={3}>
          {attributeGroups.map((attributeGroup, index) => (
            <TemplateSummaryAttributeGroup
              key={index}
              attributes={attributeGroup}
              index={index}
              attributeKey={attributeKey}
              totalGroups={attributeGroups.length}
            />
          ))}
        </Stack>
      )}
      {attributeGroups.length === 0 && (
        <AttributeGroupContainer title={t(`${attributeKey}.noAttributesAlert`)} color="gray" />
      )}
    </SectionContainer>
  )
}

type TemplateSummaryAttributeGroupProps = {
  attributes: Array<DescriptorAttribute>
  index: number
  attributeKey: AttributeKey
  totalGroups: number
}

const TemplateSummaryAttributeGroup: React.FC<TemplateSummaryAttributeGroupProps> = ({
  attributes,
  index,
  attributeKey,
}) => {
  const { t } = useTranslation('eserviceTemplate', {
    keyPrefix: 'summary.thresholdsAndAttributesSummary.attributes',
  })

  return (
    <AttributeGroupContainer
      title={t('requirementTitle', {
        index: index + 1,
        attributeType: t(`${attributeKey}.label`),
      })}
      subheader={
        <Typography variant="body2" sx={{ px: 2, py: 1 }}>
          {t('requirementDescription')}
        </Typography>
      }
      color="gray"
    >
      <Stack spacing={1.2} sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
        {attributes.map((attribute) => (
          <Box key={attribute.id} component="li">
            <AttributeContainer attribute={attribute} />
          </Box>
        ))}
      </Stack>
    </AttributeGroupContainer>
  )
}
