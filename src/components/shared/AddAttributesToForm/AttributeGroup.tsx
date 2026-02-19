import React from 'react'
import { AttributeContainer, AttributeGroupContainer } from '@/components/layout/containers'
import type { AttributeKey } from '@/types/attribute.types'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import { ButtonNaked } from '@pagopa/mui-italia'
import { AttributeAutocomplete } from '../AttributeAutocomplete'
import type { DescriptorAttribute, DescriptorAttributes } from '@/api/api.generatedTypes'
import { useFormContext } from 'react-hook-form'
import { useCustomizeThresholdDrawer } from '../CustomizeThresholdDrawer'

export type AttributeGroupProps = {
  group: Array<DescriptorAttribute>
  groupIndex: number
  attributeKey: AttributeKey
  readOnly: boolean
  withThreshold?: boolean
  onRemoveAttributesGroup: (groupIndex: number) => void
  onRemoveAttributeFromGroup: (attributeId: string, groupIndex: number) => void
}

export const AttributeGroup: React.FC<AttributeGroupProps> = ({
  group,
  groupIndex,
  attributeKey,
  readOnly,
  withThreshold,
  onRemoveAttributesGroup,
  onRemoveAttributeFromGroup,
}) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
  const { t: tAttribute } = useTranslation('attribute')
  const [isAttributeAutocompleteShown, setIsAttributeAutocompleteShown] = React.useState(
    group.length === 0
  )
  const { open } = useCustomizeThresholdDrawer()

  const handleDeleteAttributesGroup = () => {
    onRemoveAttributesGroup(groupIndex)
  }

  const handleDeleteAttributeFromGroup = (attributeId: string) => {
    onRemoveAttributeFromGroup(attributeId, groupIndex)
    if (group.length === 1) {
      setIsAttributeAutocompleteShown(true)
    }
  }

  const { watch, setValue } = useFormContext<{ attributes: DescriptorAttributes }>()
  const attributeGroups = watch(`attributes.${attributeKey}`)

  const handleAddAttributeToGroup = (attribute: DescriptorAttribute) => {
    const newAttributeGroups = [...attributeGroups]
    newAttributeGroups[groupIndex].push(attribute)
    setValue(`attributes.${attributeKey}`, newAttributeGroups)
    setIsAttributeAutocompleteShown(false)
  }

  return (
    <AttributeGroupContainer
      color={readOnly ? 'gray' : 'primary'}
      title={t('title', {
        number: groupIndex + 1,
        attributeLabel: tAttribute(`${attributeKey}.label`),
      })}
      subheader={
        <Typography variant="body2" color="text.primary" sx={{ px: 2, pt: 1.5 }}>
          {t('subtitle')}
        </Typography>
      }
      onRemove={!readOnly ? handleDeleteAttributesGroup : undefined}
    >
      {group.length > 0 && (
        <Stack sx={{ listStyleType: 'none', pl: 0, mt: 1, mb: 4 }} component="ul" spacing={0}>
          {group.map((attribute, index) => (
            <React.Fragment key={attribute.id}>
              {index > 0 && (
                <Divider
                  component="li"
                  sx={{ my: 1.5, '&::before, &::after': { borderColor: 'divider' } }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
                    {t('orSeparator')}
                  </Typography>
                </Divider>
              )}
              <Box component="li">
                <AttributeContainer
                  attribute={attribute}
                  onRemove={
                    !readOnly ? handleDeleteAttributeFromGroup.bind(null, attribute.id) : undefined
                  }
                  onCustomizeThreshold={
                    withThreshold ? () => open(attribute, groupIndex) : undefined
                  }
                />
              </Box>
            </React.Fragment>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ButtonNaked
                color="primary"
                type="button"
                sx={{ fontWeight: 700 }}
                readOnly={readOnly}
                startIcon={<AddIcon fontSize="small" />}
                onClick={() => setIsAttributeAutocompleteShown(true)}
              >
                {t('addAnotherBtn')}
              </ButtonNaked>
            </Box>
          )}
        </>
      )}
    </AttributeGroupContainer>
  )
}
