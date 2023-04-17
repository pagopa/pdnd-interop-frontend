import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack, Typography, Box, Link, Alert } from '@mui/material'
import { useEServiceDetailsContext } from '../EServiceDetailsContext'
import type { FrontendAttribute } from '@/types/attribute.types'
import {
  AttributeContainerRow,
  SectionContainer,
  AttributeGroupContainer,
} from '@/components/layout/containers'
import { attributesHelpLink } from '@/config/constants'
import type { CompactAttribute } from '@/api/api.generatedTypes'

export const EServiceAttributesSections: React.FC = () => {
  const { t } = useTranslation('eservice', {
    keyPrefix: 'read.sections.attributes',
  })
  const { t: tAttribute } = useTranslation('attribute')

  const { eserviceAttributes } = useEServiceDetailsContext()

  return (
    <>
      <AttributeGroupsListSection
        title={tAttribute('certified.label')}
        subtitle={t('certified.description')}
        attributeGroups={eserviceAttributes.certified}
        emptyLabel={tAttribute('noAttributesRequiredAlert', {
          attributeKey: tAttribute(`type.certified_other`),
        })}
      />
      <AttributeGroupsListSection
        title={tAttribute('verified.label')}
        subtitle={t('verified.description')}
        attributeGroups={eserviceAttributes.verified}
        emptyLabel={tAttribute('noAttributesRequiredAlert', {
          attributeKey: tAttribute(`type.verified_other`),
        })}
      />
      <AttributeGroupsListSection
        title={tAttribute('declared.label')}
        subtitle={t('declared.description')}
        attributeGroups={eserviceAttributes.declared}
        emptyLabel={tAttribute('noAttributesRequiredAlert', {
          attributeKey: tAttribute(`type.declared_other`),
        })}
      />
    </>
  )
}

type AttributeGroupsListSectionProps = {
  attributeGroups: Array<FrontendAttribute>
  title: string
  subtitle: string
  emptyLabel: string
}

const AttributeGroupsListSection: React.FC<AttributeGroupsListSectionProps> = ({
  attributeGroups,
  title,
  subtitle,
  emptyLabel,
}) => {
  const { t: tCommon } = useTranslation('common')
  const { t: tAttribute } = useTranslation('attribute')

  return (
    <SectionContainer
      title={title}
      description={
        <>
          {subtitle}{' '}
          <Link component={'a'} underline="hover" target="_blank" href={attributesHelpLink}>
            {tCommon('howLink')}
          </Link>
        </>
      }
    >
      {attributeGroups.length > 0 && (
        <Box>
          <Typography sx={{ mb: 2 }} fontWeight={700}>
            {tAttribute('mustOwn')}
          </Typography>
          <Stack spacing={3}>
            {attributeGroups.map((attributeGroup, index) => (
              <AttributeGroup key={index} attributes={attributeGroup.attributes} index={index} />
            ))}
          </Stack>
        </Box>
      )}

      {attributeGroups.length === 0 && <Alert severity="info">{emptyLabel}</Alert>}
    </SectionContainer>
  )
}

type AttributeGroup = {
  attributes: Array<CompactAttribute>
  index: number
}

const AttributeGroup: React.FC<AttributeGroup> = ({ attributes, index }) => {
  return (
    <AttributeGroupContainer groupNum={index + 1}>
      <Stack sx={{ my: 2, mx: 0, listStyle: 'none', px: 0 }} component="ul">
        {attributes.map((attribute, i) => (
          <Box key={attribute.id} component="li">
            <AttributeContainerRow
              attribute={attribute}
              showOrLabel={i !== attributes.length - 1}
            />
          </Box>
        ))}
      </Stack>
    </AttributeGroupContainer>
  )
}
