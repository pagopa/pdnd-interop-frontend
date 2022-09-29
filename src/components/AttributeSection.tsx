import React, { useContext } from 'react'
import { AttributeGroup } from './AttributeGroup'
import {
  AttributeKey,
  CatalogAttribute,
  FrontendAttribute,
  FrontendAttributes,
  NewAttributeFormInputValues,
} from '../../types'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Add } from '@mui/icons-material'
import { mixed, object, string } from 'yup'
import { useFeedback } from '../hooks/useFeedback'
import { DialogContext } from '../lib/context'
import noop from 'lodash/noop'
import StyledSection from './Shared/StyledSection'
import { StyledLink } from './Shared/StyledLink'
import { attributesHelpLink } from '../lib/constants'

type AttributeSectionProps = {
  attributeKey: AttributeKey
  description: string
  attributesSubtitle: string
  attributes: Array<FrontendAttribute>
  setAttributes?: React.Dispatch<React.SetStateAction<FrontendAttributes>>
  readOnly?: boolean
  showDisabledAlert?: boolean
}

export function AttributeSection({
  attributeKey,
  description,
  attributesSubtitle,
  attributes,
  setAttributes = noop,
  readOnly = false,
  showDisabledAlert = false,
}: AttributeSectionProps) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.attributes' })
  const { setDialog } = useContext(DialogContext)
  const { runAction } = useFeedback()

  const alreadySelectedAttributesIds = attributes.reduce<Array<string>>((acc, next) => {
    const ids = next.attributes.map((a) => a.id)
    return [...acc, ...ids]
  }, [])

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

  const handleRemoveAttributesGroup = (groupIndex: number) => {
    setAttributes((prev) => {
      const attributesGroups = [...prev[attributeKey]]
      attributesGroups.splice(groupIndex, 1)

      return {
        ...prev,
        [attributeKey]: attributesGroups,
      }
    })
  }

  const handleAddAttributeToGroup = (groupIndex: number, attribute: CatalogAttribute) => {
    setAttributes((prev) => {
      const attributesGroups = [...prev[attributeKey]]
      attributesGroups[groupIndex].attributes.push(attribute)
      return { ...prev, [attributeKey]: attributesGroups }
    })
  }

  const handleRemoveAttributeFromGroup = (groupIndex: number, attributeId: string) => {
    setAttributes((prev) => {
      const attributesGroups = [...prev[attributeKey]]
      attributesGroups[groupIndex].attributes = attributesGroups[groupIndex].attributes.filter(
        (attributeFilter) => attributeFilter.id !== attributeId
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
    <StyledSection>
      <StyledSection.Title>{t(`${attributeKey}.label`)}</StyledSection.Title>
      <StyledSection.Subtitle>
        {description}{' '}
        <StyledLink component={'a'} underline="hover" target="_blank" href={attributesHelpLink}>
          {t('howLink')}
        </StyledLink>
      </StyledSection.Subtitle>
      <StyledSection.Content>
        <Stack spacing={2}>
          {attributes.length > 0 && (
            <Box>
              <Typography sx={{ mb: 2 }} variant="subtitle1">
                {attributesSubtitle}
              </Typography>
              <Stack spacing={3}>
                {attributes.map((attributesGroup, index) => (
                  <AttributeGroup
                    key={index}
                    index={index}
                    readOnly={readOnly}
                    attributesGroup={attributesGroup}
                    attributeKey={attributeKey}
                    alreadySelectedAttributesIds={alreadySelectedAttributesIds}
                    handleRemoveAttributesGroup={handleRemoveAttributesGroup}
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

          {!readOnly && (
            <Stack direction="row" spacing={2}>
              <ButtonNaked
                startIcon={<Add />}
                size="medium"
                color="primary"
                type="button"
                onClick={handleAddAttributesGroup}
              >
                {t('addBtn')}
              </ButtonNaked>

              {attributeKey !== 'certified' && (
                <ButtonNaked
                  type="button"
                  size="medium"
                  color="primary"
                  onClick={openCreateNewAttributeDialog}
                >
                  {t('createBtn')}
                </ButtonNaked>
              )}
            </Stack>
          )}

          {!showDisabledAlert && attributes.length === 0 && readOnly && (
            <Alert severity="info">
              Non ci sono attributi dichiarati richiesti per l’iscrizione a questo e-service
            </Alert>
          )}

          {showDisabledAlert && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              L&lsquo;inserimento di attributi verificati e dichiarati è temporaneamente
              disabilitato per un test su una nuova feature
            </Alert>
          )}
        </Stack>
      </StyledSection.Content>
    </StyledSection>
  )
}
