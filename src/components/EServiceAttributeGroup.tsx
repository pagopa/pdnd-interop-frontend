import React, { useContext, useState } from 'react'
import { Box, Divider, FormControlLabel, Stack, Switch, Typography } from '@mui/material'
import { AttributeKey, CatalogAttribute, FrontendAttribute } from '../../types'
import { StyledButton } from './Shared/StyledButton'
import { StyledInputControlledAsyncAutocomplete } from './Shared/StyledInputControlledAsyncAutocomplete'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Add, DeleteOutline, InfoRounded } from '@mui/icons-material'
import { DialogContext } from '../lib/context'
import { useTranslation } from 'react-i18next'

type EServiceAttributeGroupProps = {
  index: number
  readOnly: boolean
  attributesGroup: FrontendAttribute
  attributeKey: AttributeKey
  alreadySelectedAttributesIds: Array<string>
  handleRemoveAttributesGroup: (groupIndex: number) => void
  handleAddAttributeToGroup: (groupIndex: number, attribute: CatalogAttribute) => void
  handleRemoveAttributeFromGroup: (groupIndex: number, attribute: CatalogAttribute) => void
  handleExplicitAttributeVerificationChange: (
    groupIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
}

export function EServiceAttributeGroup({
  index,
  readOnly,
  attributesGroup,
  attributeKey,
  alreadySelectedAttributesIds,
  handleRemoveAttributesGroup,
  handleAddAttributeToGroup,
  handleRemoveAttributeFromGroup,
  handleExplicitAttributeVerificationChange,
}: EServiceAttributeGroupProps) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.attributes.group' })

  const [isAttributeAutocompleteShown, setIsAttributeAutocompleteShown] = useState(true)
  const hasExplicitAttributeVerification = attributeKey === 'verified'

  const handleHideAutocomplete = () => setIsAttributeAutocompleteShown(false)

  return (
    <Box sx={{ border: 1, borderColor: 'background.default', borderRadius: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 1.5, backgroundColor: 'background.default' }}
      >
        <Typography variant="subtitle1">{t('title', { num: index + 1 })}</Typography>
        {!readOnly && (
          <ButtonNaked>
            <DeleteOutline
              onClick={handleRemoveAttributesGroup.bind(null, index)}
              color="error"
              aria-label={t('deleteGroupSrLabel')}
            />
          </ButtonNaked>
        )}
      </Stack>

      <Box sx={{ px: 1.5 }}>
        <AttributesList
          readOnly={readOnly}
          attributes={attributesGroup.attributes}
          onRemove={handleRemoveAttributeFromGroup.bind(null, index)}
        />

        {!readOnly && (
          <>
            {attributesGroup.attributes.length > 0 && <Divider />}
            <Box sx={{ mb: 3, mt: 2.5 }}>
              {isAttributeAutocompleteShown ? (
                <AttributesAutocomplete
                  attributeKey={attributeKey}
                  alreadySelectedAttributesIds={alreadySelectedAttributesIds}
                  handleHideAutocomplete={handleHideAutocomplete}
                  onAdd={handleAddAttributeToGroup.bind(null, index)}
                />
              ) : (
                <ButtonNaked
                  startIcon={<Add />}
                  size="medium"
                  color="primary"
                  type="button"
                  readOnly={readOnly}
                  onClick={() => setIsAttributeAutocompleteShown(true)}
                >
                  {t('addBtn')}
                </ButtonNaked>
              )}
            </Box>
          </>
        )}
      </Box>
      {hasExplicitAttributeVerification && !readOnly && (
        <Box sx={{ backgroundColor: 'background.default', px: 1, py: 0.5 }}>
          <FormControlLabel
            control={
              <Switch
                readOnly={readOnly}
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
  handleHideAutocomplete: VoidFunction
  onAdd: (attribute: CatalogAttribute) => void
}

function AttributesAutocomplete({
  attributeKey,
  alreadySelectedAttributesIds,
  handleHideAutocomplete,
  onAdd,
}: AttributesAutocompleteProps) {
  const { t } = useTranslation('eservice', { keyPrefix: 'create.step1.attributes.group' })
  const [selected, setSelected] = useState<CatalogAttribute | null>(null)

  function checkIsAlreadyInGroup(attribute: CatalogAttribute) {
    return !alreadySelectedAttributesIds.includes(attribute.id)
  }

  const handleAdd = () => {
    if (selected && checkIsAlreadyInGroup(selected)) {
      onAdd(selected)
    }
    setSelected(null)
    handleHideAutocomplete()
  }

  return (
    <Box>
      <StyledInputControlledAsyncAutocomplete
        label={t('autocompleteInput.label')}
        sx={{ mb: 0, flex: 1 }}
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
      <Stack sx={{ mt: 2 }} direction="row" alignItems="center" spacing={1}>
        <StyledButton
          onClick={handleAdd}
          disabled={!selected}
          type="button"
          size="small"
          variant="outlined"
        >
          {t('addBtn')}
        </StyledButton>
        <StyledButton
          onClick={handleHideAutocomplete}
          type="button"
          size="small"
          color="error"
          variant="text"
        >
          {t('cancelBtn')}
        </StyledButton>
      </Stack>
    </Box>
  )
}

type AttributesListProps = {
  readOnly: boolean
  attributes: Array<CatalogAttribute>
  onRemove: (attribute: CatalogAttribute) => void
}
function AttributesList({ readOnly, attributes, onRemove }: AttributesListProps) {
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
    <Stack sx={{ listStyle: 'none', pl: 0, my: 3 }} component="ul" spacing={2}>
      {attributes.map((attribute, i) => {
        const shouldNotShowOppure = attributes.length === 1 || i === attributes.length - 1
        return (
          <li key={attribute.id}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography sx={{ flex: 1 }} variant="body2">
                {attribute.name}
              </Typography>
              <Stack sx={{ flexShrink: 0 }} direction="row" spacing={1}>
                <ButtonNaked
                  onClick={openAttributeDetailsDialog.bind(null, attribute)}
                  aria-label={t('showInfoSrLabel')}
                >
                  <InfoRounded fontSize="small" color="primary" />
                </ButtonNaked>
                {!readOnly && (
                  <ButtonNaked
                    onClick={onRemove.bind(null, attribute)}
                    aria-label={t('deleteSrLabel')}
                  >
                    <DeleteOutline fontSize="small" color="error" />
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
                fontStyle="italic"
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
