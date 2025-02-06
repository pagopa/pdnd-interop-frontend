import { DescriptorAttribute } from '@/api/api.generatedTypes'
import { AttributeGroupContainer, AttributeContainer } from '@/components/layout/containers'
import { AttributeAutocomplete } from '@/components/shared/AttributeAutocomplete'
import AddIcon from '@mui/icons-material/Add'
import { AttributeKey } from '@/types/attribute.types'
import { Stack, Box } from '@mui/system'
import { ButtonNaked } from '@pagopa/mui-italia'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CreateStepAttributesFormValues } from '../CreateStepAttributes'

export type AttributeGroupProps = {
  group: Array<DescriptorAttribute>
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

  const { watch, setValue } = useFormContext<CreateStepAttributesFormValues>()
  const attributeGroups = watch(`attributes.${attributeKey}`)

  const handleAddAttributeToGroup = (attribute: DescriptorAttribute) => {
    const newAttributeGroups = [...attributeGroups]
    newAttributeGroups[groupIndex].push(attribute)
    setValue(`attributes.${attributeKey}`, newAttributeGroups)
    setIsAttributeAutocompleteShown(false)
  }

  return (
    <AttributeGroupContainer
      title={t('read.provider')}
      onRemove={!readOnly ? handleDeleteAttributesGroup : undefined}
    >
      {group.length > 0 && (
        <Stack sx={{ listStyleType: 'none', pl: 0, mt: 1, mb: 4 }} component="ul" spacing={1.2}>
          {group.map((attribute) => (
            <Box component="li" key={attribute.id}>
              <AttributeContainer
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
              attributeKey={attributeKey}
              onAddAttribute={handleAddAttributeToGroup}
              alreadySelectedAttributeIds={attributeGroups.reduce(
                (acc, group) => [...acc, ...group.map(({ id }) => id)],
                [] as Array<string>
              )}
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
    </AttributeGroupContainer>
  )
}
