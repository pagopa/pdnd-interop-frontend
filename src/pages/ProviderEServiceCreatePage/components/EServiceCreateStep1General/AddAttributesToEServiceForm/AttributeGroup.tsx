import React from 'react'
import { AttributeContainerRow, AttributeGroupContainer } from '@/components/layout/containers'
import type { AttributeKey, FrontendAttribute } from '@/types/attribute.types'
import { Box, Divider, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
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
  const { t: tCommon } = useTranslation('common')
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
    <AttributeGroupContainer
      groupNum={groupIndex + 1}
      headerContent={
        <ButtonNaked disabled={readOnly} onClick={handleDeleteAttributesGroup}>
          <DeleteIcon
            color={readOnly ? 'disabled' : 'error'}
            aria-label={t('deleteGroupSrLabel')}
          />
        </ButtonNaked>
      }
    >
      {group.attributes.length > 0 && (
        <Stack sx={{ my: 3, mx: 0, listStyle: 'none', px: 0 }} component="ul">
          {group.attributes.map((attribute, i) => (
            <Box component="li" key={attribute.id}>
              <AttributeContainerRow
                attribute={attribute}
                showOrLabel={i !== group.attributes.length - 1}
                hiddenTooltipSpacing={false}
                actions={[
                  {
                    label: <DeleteIcon fontSize="small" color={readOnly ? 'disabled' : 'error'} />,
                    action: handleDeleteAttributeFromGroup,
                    disabled: readOnly,
                  },
                ]}
              />
            </Box>
          ))}
        </Stack>
      )}
      {!readOnly && (
        <>
          {group.attributes.length > 0 && <Divider />}
          <Box sx={{ mb: 3, mt: 2.5 }}>
            {isAttributeAutocompleteShown ? (
              <AttributeAutocomplete
                groupIndex={groupIndex}
                attributeKey={attributeKey}
                handleHideAutocomplete={handleHideAutocomplete}
              />
            ) : (
              <ButtonNaked
                size="small"
                color="primary"
                type="button"
                sx={{ fontWeight: 700 }}
                readOnly={readOnly}
                onClick={() => setIsAttributeAutocompleteShown(true)}
              >
                {tCommon('addBtn')}
              </ButtonNaked>
            )}
          </Box>
        </>
      )}
    </AttributeGroupContainer>
  )
}
