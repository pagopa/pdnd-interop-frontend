import React, { useContext } from 'react'
import { AttributeGroup } from './AttributeGroup'
import {
  AttributeKey,
  CatalogAttribute,
  ConsumerAttribute,
  FrontendAttribute,
  FrontendAttributes,
  NewAttributeFormInputValues,
} from '../../types'
import { Alert, Box, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { ButtonNaked } from '@pagopa/mui-italia'
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
  ownedAttributes?: Array<ConsumerAttribute>
  handleConfirmDeclaredAttribute?: (attributeId: string) => void
  handleVerifyAttribute?: (attributeId: string) => void
  handleRevokeAttribute?: (attributeId: string) => void
  handleRefuseAttribute?: (attributeId: string) => void
  setAttributes?: React.Dispatch<React.SetStateAction<FrontendAttributes>>
  readOnly?: boolean
  shouldProviderVerify?: boolean
  showDisabledAlert?: boolean
}

export function AttributeSection({
  attributeKey,
  description,
  attributesSubtitle,
  attributes,
  ownedAttributes,
  handleConfirmDeclaredAttribute,
  handleVerifyAttribute,
  handleRevokeAttribute,
  handleRefuseAttribute,
  setAttributes = noop,
  readOnly = false,
  shouldProviderVerify = false,
  showDisabledAlert = false,
}: AttributeSectionProps) {
  const { t } = useTranslation('attribute')
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
        <Stack spacing={3}>
          {attributes.length > 0 && (
            <Box>
              <Typography sx={{ mb: 2 }} fontWeight={700}>
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
                    ownedAttributes={ownedAttributes}
                    alreadySelectedAttributesIds={alreadySelectedAttributesIds}
                    handleRemoveAttributesGroup={handleRemoveAttributesGroup}
                    handleAddAttributeToGroup={handleAddAttributeToGroup}
                    handleRemoveAttributeFromGroup={handleRemoveAttributeFromGroup}
                    handleExplicitAttributeVerificationChange={
                      handleExplicitAttributeVerificationChange
                    }
                    handleConfirmDeclaredAttribute={handleConfirmDeclaredAttribute}
                    handleVerifyAttribute={shouldProviderVerify ? handleVerifyAttribute : undefined}
                    handleRefuseAttribute={shouldProviderVerify ? handleRefuseAttribute : undefined}
                    handleRevokeAttribute={shouldProviderVerify ? handleRevokeAttribute : undefined}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {!readOnly && (
            <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
              <ButtonNaked
                size="small"
                sx={{ fontWeight: 700 }}
                color="primary"
                type="button"
                onClick={handleAddAttributesGroup}
              >
                {t('addBtn')}
              </ButtonNaked>

              {attributeKey !== 'certified' && (
                <ButtonNaked
                  type="button"
                  size="small"
                  sx={{ fontWeight: 700 }}
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
              {t('noAttributesRequiredAlert', { attributeKey: t(`type.${attributeKey}_other`) })}
            </Alert>
          )}

          {showDisabledAlert && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              {t('disabledAlert')}
            </Alert>
          )}
        </Stack>
      </StyledSection.Content>
    </StyledSection>
  )
}
