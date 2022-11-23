import React from 'react'
import { AttributeContainerRow, AttributeGroupContainer } from '@/components/layout/containers'
import { AttributeKey, FrontendAttribute } from '@/types/attribute.types'
import { Box, Divider, Stack } from '@mui/material'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EServiceCreateStep1FormValues } from '../EServiceCreateStep1General'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import { ButtonNaked } from '@pagopa/mui-italia'
import { AddAttributesToEServiceFormAttributeAutocomplete } from './AddAttributesToEServiceFormAttributeAutocomplete'

type AddAttributesToEServiceFormAttributeGroupProps = {
  group: FrontendAttribute
  groupIndex: number
  attributeKey: AttributeKey
  readOnly: boolean
}

export const AddAttributesToEServiceFormAttributeGroup: React.FC<
  AddAttributesToEServiceFormAttributeGroupProps
> = ({ group, groupIndex, attributeKey, readOnly }) => {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
  const { t: tCommon } = useTranslation('common')
  const { watch, setValue } = useFormContext<EServiceCreateStep1FormValues>()
  const attributeGroups = watch(`attributes.${attributeKey}`)

  const [isAttributeAutocompleteShown, setIsAttributeAutocompleteShown] = React.useState(false)

  const handleDeleteAttributesGroup = () => {
    const newAttributeGroups = [...attributeGroups]
    newAttributeGroups.splice(groupIndex, 1)
    setValue(`attributes.${attributeKey}`, newAttributeGroups, {
      shouldValidate: false,
    })
  }

  const handleDeleteAttributeFromGroup = (attributeId: string) => {
    const newAttributeGroups = [...attributeGroups]
    newAttributeGroups[groupIndex].attributes = newAttributeGroups[groupIndex].attributes.filter(
      (attributeFilter) => attributeFilter.id !== attributeId
    )
    setValue(`attributes.${attributeKey}`, newAttributeGroups, {
      shouldValidate: false,
    })
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
              <AddAttributesToEServiceFormAttributeAutocomplete
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
