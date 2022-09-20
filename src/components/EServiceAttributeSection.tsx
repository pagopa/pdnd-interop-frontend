import React, { useContext } from 'react'
import { EServiceAttributeGroup } from './EServiceAttributeGroup'
import { StyledIntro } from './Shared/StyledIntro'
import {
  AttributeKey,
  CatalogAttribute,
  FrontendAttribute,
  FrontendAttributes,
  NewAttributeFormInputValues,
} from '../../types'
import { Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { StyledPaper } from './StyledPaper'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Add } from '@mui/icons-material'
import { mixed, object, string } from 'yup'
import { useFeedback } from '../hooks/useFeedback'
import { DialogContext } from '../lib/context'

type EServiceAttributeSectionProps = {
  attributeKey: AttributeKey
  attributes: Array<FrontendAttribute>
  setAttributes: React.Dispatch<React.SetStateAction<FrontendAttributes>>
  disabled: boolean
}

export function EServiceAttributeSection({
  attributeKey,
  attributes,
  setAttributes,
}: EServiceAttributeSectionProps) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.attributes' })
  const { setDialog } = useContext(DialogContext)
  const { runAction } = useFeedback()

  const openCreateNewAttributeDialog = () => {
    const createNewAttributeInitialValues = {
      name: '',
      code: '',
      origin: '',
      description: '',
      kind: attributeKey.toUpperCase(),
    }
    const createNewAttributeValidationSchema = object({
      name: string().required(),
      code: string().required(),
      origin: string().required(),
      description: string().required(),
      kind: mixed().oneOf(['CERTIFIED', 'VERIFIED', 'DECLARED']).required(),
    })

    const createNewAttribute = async (data: NewAttributeFormInputValues) => {
      const dataToPost = { ...data }

      await runAction({ path: { endpoint: 'ATTRIBUTE_CREATE' }, config: { data: dataToPost } })
    }

    setDialog({
      type: 'createNewAttribute',
      attributeKey,
      onSubmit: createNewAttribute,
      initialValues: createNewAttributeInitialValues,
      validationSchema: createNewAttributeValidationSchema,
    })
  }

  const handleAddAttributesGroup = () => {
    setAttributes((prev) => ({
      ...prev,
      [attributeKey]: [
        ...prev[attributeKey],
        { attributes: [], explicitAttributeVerification: false },
      ],
    }))
  }

  const handleAddAttributeToGroup = (groupIndex: number, attribute: CatalogAttribute) => {
    setAttributes((prev) => {
      const attributesGroups = [...prev[attributeKey]]
      attributesGroups[groupIndex].attributes.push(attribute)
      return { ...prev, [attributeKey]: attributesGroups }
    })
  }

  const handleRemoveAttributeFromGroup = (groupIndex: number, attribute: CatalogAttribute) => {
    setAttributes((prev) => {
      const attributesGroups = [...prev[attributeKey]]
      attributesGroups[groupIndex].attributes = attributesGroups[groupIndex].attributes.filter(
        (attributeFilter) => attributeFilter.id !== attribute.id
      )
      return { ...prev, [attributeKey]: attributesGroups }
    })
  }

  const handleExplicitAttributeVerificationChange = (
    groupIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAttributes((prev) => {
      const attributesGroups = [...prev[attributeKey]]
      attributesGroups[groupIndex].explicitAttributeVerification = e.target.checked
      return { ...prev, [attributeKey]: attributesGroups }
    })
  }

  return (
    <StyledPaper>
      <StyledIntro component="h2">
        {{
          title: `${t('title')} ${t(`${attributeKey}.label`)}`,
          description: t(`${attributeKey}.description`),
        }}
      </StyledIntro>
      {attributes.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Il fruitore deve possedere:</Typography>
          <Stack sx={{ mt: 2 }} spacing={3}>
            {attributes.map((attributesGroup, index) => (
              <EServiceAttributeGroup
                key={index}
                index={index}
                attributesGroup={attributesGroup}
                attributeKey={attributeKey}
                handleAddAttributeToGroup={handleAddAttributeToGroup}
                handleRemoveAttributeFromGroup={handleRemoveAttributeFromGroup}
                handleExplicitAttributeVerificationChange={
                  handleExplicitAttributeVerificationChange
                }
              />
            ))}
          </Stack>
        </Box>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <ButtonNaked
          startIcon={<Add />}
          size="medium"
          color="primary"
          type="button"
          onClick={handleAddAttributesGroup}
        >
          test1
        </ButtonNaked>

        {attributeKey !== 'certified' && (
          <ButtonNaked
            type="button"
            size="medium"
            color="primary"
            onClick={openCreateNewAttributeDialog}
          >
            test2
          </ButtonNaked>
        )}
      </Stack>
    </StyledPaper>
  )
}
