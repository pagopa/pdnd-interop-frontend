import React from 'react'
import type { AttributeKey } from '@/types/attribute.types'
import { useFormContext } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { SectionContainer } from '@/components/layout/containers'
import { Box, Button, Link, Stack } from '@mui/material'
import { attributesHelpLink } from '@/config/constants'
import { useDialog } from '@/stores'
import { AttributeGroup } from './AttributeGroup'
import type { EServiceCreateStep3FormValues } from '../../EServiceCreateStep3Attributes'

export type AddAttributesToEServiceFormProps = {
  attributeKey: AttributeKey
  readOnly: boolean
}

export const AddAttributesToEServiceForm: React.FC<AddAttributesToEServiceFormProps> = ({
  attributeKey,
  readOnly,
}) => {
  const { t } = useTranslation('eservice', { keyPrefix: `create.step3` })
  const { t: tAttribute } = useTranslation('attribute')
  const { openDialog } = useDialog()

  const { watch, setValue } = useFormContext<EServiceCreateStep3FormValues>()

  const attributeGroups = watch(`attributes.${attributeKey}`)

  const handleOpenCreateNewAttributeDialog = () => {
    openDialog({ type: 'createNewAttribute', attributeKey })
  }

  const handleRemoveAttributesGroup = (groupIndex: number) => {
    const newAttributeGroups = attributeGroups.filter((_, i) => i !== groupIndex)
    setValue(`attributes.${attributeKey}`, newAttributeGroups, {
      shouldValidate: false,
    })
  }

  const handleAddAttributesGroup = () => {
    setValue(
      `attributes.${attributeKey}`,
      [...attributeGroups, { explicitAttributeVerification: false, attributes: [] }],
      { shouldValidate: false }
    )
  }

  const handleRemoveAttributeFromGroup = (attributeId: string, groupIndex: number) => {
    const newAttributeGroups = [...attributeGroups]
    newAttributeGroups[groupIndex].attributes = newAttributeGroups[groupIndex].attributes.filter(
      (attributeFilter) => attributeFilter.id !== attributeId
    )
    setValue(`attributes.${attributeKey}`, newAttributeGroups, {
      shouldValidate: false,
    })
  }

  return (
    <SectionContainer
      newDesign
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
      <Box>
        <Stack spacing={3}>
          {attributeGroups.map((group, i) => (
            <AttributeGroup
              key={i}
              groupIndex={i}
              group={group}
              attributeKey={attributeKey}
              readOnly={readOnly}
              onRemoveAttributesGroup={handleRemoveAttributesGroup}
              onRemoveAttributeFromGroup={handleRemoveAttributeFromGroup}
            />
          ))}
        </Stack>
      </Box>
      <Stack spacing={3}>
        <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
          <Button
            sx={{ fontWeight: 700 }}
            color="primary"
            type="button"
            variant="outlined"
            onClick={handleAddAttributesGroup}
            disabled={readOnly}
          >
            {t('attributesAddBtn')}
          </Button>

          {attributeKey !== 'certified' && (
            <Button
              sx={{ fontWeight: 700 }}
              color="primary"
              type="button"
              variant="outlined"
              onClick={handleOpenCreateNewAttributeDialog}
              disabled={readOnly}
            >
              {t('attributesCreateBtn')}
            </Button>
          )}
        </Stack>
      </Stack>
    </SectionContainer>
  )
}
