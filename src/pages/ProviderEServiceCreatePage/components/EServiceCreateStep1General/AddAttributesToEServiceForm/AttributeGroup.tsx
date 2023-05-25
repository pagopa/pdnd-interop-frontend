import React from 'react'
import { _AttributeContainer, _AttributeGroupContainer } from '@/components/layout/containers'
import type { AttributeKey, FrontendAttribute } from '@/types/attribute.types'
import { Box, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import { AttributeAutocomplete } from './AttributeAutocomplete'

export type AttributeGroupProps = {
  group: FrontendAttribute
  groupIndex: number
  attributeKey: AttributeKey
  readOnly: boolean
  onRemoveAttributesGroup: (groupIndex: number) => void
  onRemoveAttributeFromGroup: (attributeId: string, groupIndex: number) => void
}

export const AttributeGroup: React.FC<AttributeGroupProps> = ({
  group,
  groupIndex,
  attributeKey,
  readOnly,
  onRemoveAttributesGroup,
  onRemoveAttributeFromGroup,
}) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
  const [isAttributeAutocompleteShown, setIsAttributeAutocompleteShown] = React.useState(false)

  const handleDeleteAttributesGroup = () => {
    onRemoveAttributesGroup(groupIndex)
  }

  const handleDeleteAttributeFromGroup = (attributeId: string) => {
    onRemoveAttributeFromGroup(attributeId, groupIndex)
  }

  const handleHideAutocomplete = () => {
    setIsAttributeAutocompleteShown(false)
  }

  return (
    <_AttributeGroupContainer
      title={t('title')}
      onRemove={!readOnly ? handleDeleteAttributesGroup : undefined}
    >
      {group.attributes.length > 0 && (
        <Stack sx={{ listStyleType: 'none', pl: 0, mt: 1, mb: 4 }} component="ul" spacing={1.2}>
          {group.attributes.map((attribute) => (
            <Box component="li" key={attribute.id}>
              <_AttributeContainer
                attribute={attribute}
                onRemove={
                  !readOnly ? handleDeleteAttributeFromGroup.bind(null, attribute.id) : undefined
                }
              />
            </Box>
          ))}
        </Stack>
      )}
      {!readOnly && (
        <>
          {isAttributeAutocompleteShown ? (
            <AttributeAutocomplete
              groupIndex={groupIndex}
              attributeKey={attributeKey}
              handleHideAutocomplete={handleHideAutocomplete}
            />
          ) : (
            <ButtonNaked
              color="primary"
              type="button"
              sx={{ fontWeight: 700 }}
              readOnly={readOnly}
              startIcon={<AddIcon fontSize="small" />}
              onClick={() => setIsAttributeAutocompleteShown(true)}
            >
              {t('addBtn')}
            </ButtonNaked>
          )}
        </>
      )}
    </_AttributeGroupContainer>
  )
}
