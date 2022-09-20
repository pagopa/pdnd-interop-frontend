import React, { useContext, useState } from 'react'
import { Box, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { AttributeKey, CatalogAttribute, FrontendAttribute } from '../../types'
import { StyledButton } from './Shared/StyledButton'
import { StyledInputControlledAsyncAutocomplete } from './Shared/StyledInputControlledAsyncAutocomplete'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Add, DeleteOutline, InfoRounded } from '@mui/icons-material'
import { DialogContext } from '../lib/context'
import { useTranslation } from 'react-i18next'

type EServiceAttributeGroupProps = {
  index: number
  disabled: boolean
  attributesGroup: FrontendAttribute
  attributeKey: AttributeKey
  alreadySelectedAttributesIds: Array<string>
  handleAddAttributeToGroup: (groupIndex: number, attribute: CatalogAttribute) => void
  handleRemoveAttributeFromGroup: (groupIndex: number, attribute: CatalogAttribute) => void
  handleExplicitAttributeVerificationChange: (
    groupIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
}

export function EServiceAttributeGroup({
  index,
  disabled,
  attributesGroup,
  attributeKey,
  alreadySelectedAttributesIds,
  handleAddAttributeToGroup,
  handleRemoveAttributeFromGroup,
  handleExplicitAttributeVerificationChange,
}: EServiceAttributeGroupProps) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.attributes.group' })

  const [addButtonPressed, setAddButtonPressed] = useState(false)
  const hasExplicitAttributeVerification = attributeKey !== 'certified'

  const isAttributeAutocompleteShown =
    (addButtonPressed || attributesGroup.attributes.length === 0) && !disabled

  const handleAddToAttributeGroupWrapper = () => {
    return (attribute: CatalogAttribute) => {
      setAddButtonPressed(false)
      handleAddAttributeToGroup(index, attribute)
    }
  }

  return (
    <Box sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="subtitle1">{t('title', { num: index + 1 })}</Typography>

      <Box sx={{ mb: 4, ml: 2 }}>
        <AttributesList
          disabled={disabled}
          attributes={attributesGroup.attributes}
          onRemove={handleRemoveAttributeFromGroup.bind(null, index)}
        />

        {isAttributeAutocompleteShown ? (
          <AttributesAutocomplete
            attributeKey={attributeKey}
            alreadySelectedAttributesIds={alreadySelectedAttributesIds}
            onAdd={handleAddToAttributeGroupWrapper()}
          />
        ) : (
          <ButtonNaked
            startIcon={<Add />}
            size="medium"
            color="primary"
            type="button"
            disabled={disabled}
            onClick={() => setAddButtonPressed(true)}
          >
            {t('addBtn')}
          </ButtonNaked>
        )}
      </Box>

      {hasExplicitAttributeVerification && (
        <Box sx={{ backgroundColor: 'background.default', px: 1, borderRadius: 1 }}>
          <FormControlLabel
            control={
              <Switch
                disabled={disabled}
                value={attributesGroup.explicitAttributeVerification}
                onChange={handleExplicitAttributeVerificationChange.bind(null, index)}
              />
            }
            label={t('canRequireVerification')}
          />
        </Box>
      )}
    </Box>
  )
}

type AttributesAutocompleteProps = {
  attributeKey: AttributeKey
  alreadySelectedAttributesIds: Array<string>
  onAdd: (attribute: CatalogAttribute) => void
}

function AttributesAutocomplete({
  attributeKey,
  alreadySelectedAttributesIds,
  onAdd,
}: AttributesAutocompleteProps) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.attributes.group' })
  const [selected, setSelected] = useState<CatalogAttribute | null>(null)

  function checkIsAlreadyInGroup(attribute: CatalogAttribute) {
    return !alreadySelectedAttributesIds.includes(attribute.id)
  }

  const handleAdd = () => {
    selected && onAdd(selected)
    setSelected(null)
  }

  return (
    <Stack direction="row" spacing={2} alignItems="end">
      <StyledInputControlledAsyncAutocomplete
        label={t('autocompleteInput.label')}
        sx={{ mt: 2, mb: 0, flex: 1 }}
        placeholder={t('autocompleteInput.placeholder')}
        path={{ endpoint: 'ATTRIBUTE_GET_LIST' }}
        variant="standard"
        transformKey="attributes"
        transformFn={(fetchedData) =>
          fetchedData
            .filter((a) => a.kind === attributeKey.toUpperCase())
            .filter(checkIsAlreadyInGroup)
        }
        focusOnMount
        name="selection"
        onChange={(data) => setSelected(data as CatalogAttribute)}
        getOptionLabel={(option: CatalogAttribute) => (option ? option.name : '')}
        isOptionEqualToValue={(option: CatalogAttribute, value: CatalogAttribute) =>
          option.name === value.name
        }
      />
      <StyledButton onClick={handleAdd} disabled={!selected} type="button" variant="outlined">
        {t('addBtn')}
      </StyledButton>
    </Stack>
  )
}

type AttributesListProps = {
  disabled: boolean
  attributes: Array<CatalogAttribute>
  onRemove: (attribute: CatalogAttribute) => void
}
function AttributesList({ disabled, attributes, onRemove }: AttributesListProps) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.attributes.group' })
  const { setDialog } = useContext(DialogContext)

  const openAttributeDetailsDialog = (attribute: CatalogAttribute) => {
    setDialog({
      type: 'showAttributeDetails',
      attribute,
    })
  }

  if (attributes.length === 0) return null

  return (
    <Stack sx={{ listStyle: 'none', pl: 0 }} component="ul" spacing={2}>
      {attributes.map((attribute, i) => {
        const shouldNotShowOppure = attributes.length === 1 || i === attributes.length - 1
        return (
          <li key={attribute.id}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ flex: 1 }} variant="body2">
                {attribute.name}
              </Typography>
              <Stack sx={{ flexShrink: 0 }} direction="row" spacing={1}>
                <ButtonNaked onClick={openAttributeDetailsDialog.bind(null, attribute)}>
                  <InfoRounded fontSize="small" color="primary" aria-label={t('showInfoSrLabel')} />
                </ButtonNaked>
                {!disabled && (
                  <ButtonNaked onClick={onRemove.bind(null, attribute)}>
                    <DeleteOutline fontSize="small" color="error" aria-label={t('deleteSrLabel')} />
                  </ButtonNaked>
                )}
              </Stack>
              <Typography
                component="span"
                sx={{
                  flexShrink: 0,
                  visibility: shouldNotShowOppure ? 'hidden' : 'visible',
                }}
                variant="body2"
              >
                {t('or')}
              </Typography>
            </Stack>
          </li>
        )
      })}
    </Stack>
  )
}
