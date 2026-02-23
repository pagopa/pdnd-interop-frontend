import React from 'react'
import type { AttributeKey } from '@/types/attribute.types'
import { useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Button, Link, Stack } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { AttributeGroup } from './AttributeGroup'
import type { DescriptorAttributes } from '@/api/api.generatedTypes'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'

export type CreateAttributeAction = {
  label: string
  openDrawer: VoidFunction
}

export type AddAttributesToFormProps = {
  attributeKey: AttributeKey
  readOnly: boolean
  addGroupLabel: string
  hideTitle?: boolean
  withThreshold?: boolean
  createAttributeAction?: CreateAttributeAction
}

export const AddAttributesToForm: React.FC<AddAttributesToFormProps> = ({
  attributeKey,
  readOnly,
  addGroupLabel,
  hideTitle,
  withThreshold,
  createAttributeAction,
}) => {
  const { t: tAttribute } = useTranslation('attribute')

  const { watch, setValue } = useFormContext<{ attributes: DescriptorAttributes }>()

  const attributeGroups = watch(`attributes.${attributeKey}`)

  const handleRemoveAttributesGroup = (groupIndex: number) => {
    const newAttributeGroups = attributeGroups.filter((_, i) => i !== groupIndex)
    setValue(`attributes.${attributeKey}`, newAttributeGroups, {
      shouldValidate: false,
    })
  }

  const handleAddAttributesGroup = () => {
    setValue(`attributes.${attributeKey}`, [...attributeGroups, []], { shouldValidate: false })
  }

  const handleRemoveAttributeFromGroup = (attributeId: string, groupIndex: number) => {
    const newAttributeGroups = [...attributeGroups]
    newAttributeGroups[groupIndex] = newAttributeGroups[groupIndex].filter(
      (attributeFilter) => attributeFilter.id !== attributeId
    )
    setValue(`attributes.${attributeKey}`, newAttributeGroups, {
      shouldValidate: false,
    })
  }

  const content = (
    <>
      {!readOnly && createAttributeAction && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <ButtonNaked
            color="primary"
            type="button"
            sx={{ fontWeight: 700 }}
            startIcon={<AddIcon fontSize="small" />}
            onClick={createAttributeAction.openDrawer}
          >
            {createAttributeAction.label}
          </ButtonNaked>
        </Box>
      )}
      <Stack spacing={3}>
        {attributeGroups.map((group, i) => (
          <AttributeGroup
            key={i}
            groupIndex={i}
            group={group}
            attributeKey={attributeKey}
            readOnly={readOnly}
            withThreshold={withThreshold}
            onRemoveAttributesGroup={handleRemoveAttributesGroup}
            onRemoveAttributeFromGroup={handleRemoveAttributeFromGroup}
          />
        ))}
        {!readOnly && (
          <Box>
            <Button
              sx={{ fontWeight: 700 }}
              color="primary"
              type="button"
              variant="outlined"
              disabled={attributeGroups.some((group) => group.length === 0)}
              onClick={handleAddAttributesGroup}
            >
              {addGroupLabel}
            </Button>
          </Box>
        )}
      </Stack>
    </>
  )

  if (hideTitle) return content

  return (
    <SectionContainer
      innerSection
      title={tAttribute(`${attributeKey}.label`)}
      description={
        <Trans
          components={{ 1: <Link underline="hover" href={attributesHelpLink} target="_blank" /> }}
        >
          {tAttribute(`${attributeKey}.description`)}
        </Trans>
      }
    >
      {content}
    </SectionContainer>
  )
}
