import React, { useContext, useState } from 'react'
import { Box, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { AttributeKey, CatalogAttribute, FrontendAttribute } from '../../types'
import { StyledButton } from './Shared/StyledButton'
import { StyledInputControlledAsyncAutocomplete } from './Shared/StyledInputControlledAsyncAutocomplete'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Add, Delete, InfoRounded } from '@mui/icons-material'
import { DialogContext } from '../lib/context'

type EServiceAttributeGroupProps = {
  index: number
  attributesGroup: FrontendAttribute
  attributeKey: AttributeKey
  handleAddAttributeToGroup: (groupIndex: number, attribute: CatalogAttribute) => void
  handleRemoveAttributeFromGroup: (groupIndex: number, attribute: CatalogAttribute) => void
  handleExplicitAttributeVerificationChange: (
    groupIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
}

export function EServiceAttributeGroup({
  index,
  attributesGroup,
  attributeKey,
  handleAddAttributeToGroup,
  handleRemoveAttributeFromGroup,
  handleExplicitAttributeVerificationChange,
}: EServiceAttributeGroupProps) {
  const [addButtonPressed, setAddButtonPressed] = useState(false)
  const hasExplicitAttributeVerification = attributeKey !== 'certified'

  const isAttributeAutocompleteShown = addButtonPressed || attributesGroup.attributes.length === 0

  const handleAddToAttributeGroupWrapper = () => {
    return (attribute: CatalogAttribute) => {
      setAddButtonPressed(false)
      handleAddAttributeToGroup(index, attribute)
    }
  }

  return (
    <Box sx={{ p: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      <Typography variant="subtitle1">attributo {index + 1}:</Typography>

      <Box sx={{ mb: 4, ml: 2 }}>
        <AttributesList
          attributes={attributesGroup.attributes}
          onRemove={handleRemoveAttributeFromGroup.bind(null, index)}
        />

        {isAttributeAutocompleteShown ? (
          <AttributesAutocomplete
            attributeKey={attributeKey}
            attributesGroup={attributesGroup.attributes}
            onAdd={handleAddToAttributeGroupWrapper()}
          />
        ) : (
          <ButtonNaked
            startIcon={<Add />}
            size="medium"
            color="primary"
            type="button"
            onClick={() => setAddButtonPressed(true)}
          >
            Aggiungi
          </ButtonNaked>
        )}
      </Box>

      {hasExplicitAttributeVerification && (
        <Box sx={{ backgroundColor: 'background.default', px: 1, borderRadius: 1 }}>
          <FormControlLabel
            control={
              <Switch
                value={attributesGroup.explicitAttributeVerification}
                onChange={handleExplicitAttributeVerificationChange.bind(null, index)}
              />
            }
            label="Per questo attributo sfrutta le verifiche effettuate da altri erogatori"
          />
        </Box>
      )}
    </Box>
  )
}

type AttributesAutocompleteProps = {
  attributeKey: AttributeKey
  attributesGroup: Array<CatalogAttribute>
  onAdd: (attribute: CatalogAttribute) => void
}

function AttributesAutocomplete({
  attributeKey,
  attributesGroup,
  onAdd,
}: AttributesAutocompleteProps) {
  const [selected, setSelected] = useState<CatalogAttribute | null>(null)

  function checkIsAlreadyInGroup(attribute: CatalogAttribute) {
    return !attributesGroup.some((attSome) => attSome.id === attribute.id)
  }

  const handleAdd = () => {
    selected && onAdd(selected)
    setSelected(null)
  }

  return (
    <Stack direction="row" spacing={2} alignItems="end">
      <StyledInputControlledAsyncAutocomplete
        label={'test'}
        sx={{ mt: 2, mb: 0, flex: 1 }}
        placeholder="choose"
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
        Aggiungi
      </StyledButton>
    </Stack>
  )
}

type AttributesListProps = {
  attributes: Array<CatalogAttribute>
  onRemove: (attribute: CatalogAttribute) => void
}
function AttributesList({ attributes, onRemove }: AttributesListProps) {
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
            <Stack direction="row" alignItems="center">
              <Typography sx={{ flex: 1 }} variant="body2">
                {attribute.name}
              </Typography>
              <Stack sx={{ flexShrink: 0 }} direction="row" spacing={1}>
                <ButtonNaked onClick={onRemove.bind(null, attribute)} size="small">
                  <Delete fontSize="small" color="error" />
                </ButtonNaked>
                <ButtonNaked
                  onClick={openAttributeDetailsDialog.bind(null, attribute)}
                  size="small"
                >
                  <InfoRounded fontSize="small" color="primary" />
                </ButtonNaked>
              </Stack>
              <Typography
                component="span"
                sx={{
                  flexShrink: 0,
                  ml: 2,
                  visibility: shouldNotShowOppure ? 'hidden' : 'visible',
                }}
                variant="body2"
              >
                oppure
              </Typography>
            </Stack>
          </li>
        )
      })}
    </Stack>
  )
}
