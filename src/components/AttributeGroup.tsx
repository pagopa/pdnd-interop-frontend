import React, { useContext, useState } from 'react'
import {
  Box,
  Chip,
  ChipProps,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material'
import { AttributeKey, CatalogAttribute, ConsumerAttribute, FrontendAttribute } from '../../types'
import { StyledButton } from './Shared/StyledButton'
import { StyledInputControlledAsyncAutocomplete } from './Shared/StyledInputControlledAsyncAutocomplete'
import { ButtonNaked } from '@pagopa/mui-italia'
import { Add, DeleteOutline, InfoRounded, Check, Close as CloseIcon } from '@mui/icons-material'
import { DialogContext } from '../lib/context'
import { useTranslation } from 'react-i18next'
import noop from 'lodash/noop'
import { StyledTooltip } from './Shared/StyledTooltip'

type AttributeGroupProps = {
  index: number
  readOnly: boolean
  attributesGroup: FrontendAttribute
  attributeKey: AttributeKey
  ownedAttributes?: Array<ConsumerAttribute>
  alreadySelectedAttributesIds?: Array<string>
  handleRemoveAttributesGroup?: (groupIndex: number) => void
  handleAddAttributeToGroup?: (groupIndex: number, attribute: CatalogAttribute) => void
  handleRemoveAttributeFromGroup?: (groupIndex: number, attributeId: string) => void
  handleExplicitAttributeVerificationChange?: (
    groupIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  handleConfirmDeclaredAttribute?: (attributeId: string) => void
  handleVerifyAttribute?: (attributeId: string) => void
  handleRefuseAttribute?: (attributeId: string) => void
  handleRevokeAttribute?: (attributeId: string) => void
}

export function AttributeGroup({
  index,
  readOnly,
  attributesGroup,
  attributeKey,
  ownedAttributes,
  alreadySelectedAttributesIds = [],
  handleRemoveAttributesGroup = noop,
  handleAddAttributeToGroup = noop,
  handleRemoveAttributeFromGroup = noop,
  handleExplicitAttributeVerificationChange = noop,
  handleConfirmDeclaredAttribute,
  handleVerifyAttribute,
  handleRefuseAttribute,
  handleRevokeAttribute,
}: AttributeGroupProps) {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })

  const [isAttributeAutocompleteShown, setIsAttributeAutocompleteShown] = useState(true)

  const hasExplicitAttributeVerification = attributeKey === 'verified'

  const handleHideAutocomplete = () => setIsAttributeAutocompleteShown(false)
  const isGroupFullfilled = attributesGroup.attributes.some((groupAttribute) =>
    ownedAttributes?.some(
      (ownedAttribute) =>
        ownedAttribute.id === groupAttribute.id && ownedAttribute.state === 'ACTIVE'
    )
  )

  const showConfirmDeclaredAttributeButton =
    ownedAttributes &&
    attributeKey === 'declared' &&
    !isGroupFullfilled &&
    handleConfirmDeclaredAttribute

  return (
    <Box sx={{ border: 1, borderColor: 'background.default', borderRadius: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 1.5, backgroundColor: 'background.default' }}
      >
        <Typography variant="subtitle1">{t('title', { num: index + 1 })}</Typography>
        {ownedAttributes && (
          <AttributeGroupStatusChip
            attributeKey={attributeKey}
            isGroupFullfilled={isGroupFullfilled}
          />
        )}

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
          ownedAttributes={ownedAttributes}
          onConfirmDeclaredAttribute={
            showConfirmDeclaredAttributeButton ? handleConfirmDeclaredAttribute : undefined
          }
          onRemove={handleRemoveAttributeFromGroup.bind(null, index)}
          onVerifyAttribute={handleVerifyAttribute}
          onRefuseAttribute={handleRefuseAttribute}
          onRevokeAttribute={handleRevokeAttribute}
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
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
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
  ownedAttributes?: Array<ConsumerAttribute>
  onConfirmDeclaredAttribute?: (attributeId: string) => void
  onRemove: (attributeId: string) => void
  onVerifyAttribute?: (attributeId: string) => void
  onRefuseAttribute?: (attributeId: string) => void
  onRevokeAttribute?: (attributeId: string) => void
}
function AttributesList({
  readOnly,
  attributes,
  ownedAttributes,
  onConfirmDeclaredAttribute,
  onRemove,
  onVerifyAttribute,
  onRefuseAttribute,
  onRevokeAttribute,
}: AttributesListProps) {
  const { t } = useTranslation('attribute', { keyPrefix: 'group' })
  const { setDialog } = useContext(DialogContext)

  const openAttributeDetailsDialog = (attribute: CatalogAttribute) => {
    setDialog({
      type: 'showAttributeDetails',
      attributeId: attribute.id,
      name: attribute.name,
    })
  }

  if (attributes.length === 0) return null

  function AttributeItem({
    attribute,
    shouldShowOrLabel,
  }: {
    attribute: CatalogAttribute
    shouldShowOrLabel: boolean
  }) {
    const isActive = ownedAttributes?.some(
      (ownedAttribute) => ownedAttribute.id === attribute.id && ownedAttribute.state === 'ACTIVE'
    )

    const isRevoked = ownedAttributes?.some(
      (ownedAttribute) => ownedAttribute.id === attribute.id && ownedAttribute.state === 'REVOKED'
    )

    const activeTooltipLabel = t(`statusChip.${attribute.kind.toLowerCase()}.fullfilledLabel`)
    const revokedTooltipLabel = t(`statusChip.${attribute.kind.toLowerCase()}.revokedLabel`)

    return (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography sx={{ flex: 1 }} variant="body2">
          {attribute.name}
        </Typography>
        {/* TEMP REFACTOR */}
        <Stack sx={{ flexShrink: 0 }} direction="row" spacing={2}>
          {onVerifyAttribute && onRefuseAttribute && onRevokeAttribute ? (
            <>
              <ButtonNaked onClick={onVerifyAttribute.bind(null, attribute.id)} color="primary">
                {t('actions.verifyBtn')}
              </ButtonNaked>

              {isActive ? (
                <ButtonNaked onClick={onRevokeAttribute.bind(null, attribute.id)} color="error">
                  {t('actions.revokeBtn')}
                </ButtonNaked>
              ) : (
                // This is here just for spacing purposes
                <ButtonNaked
                  sx={{ visibility: 'hidden' }}
                  disabled={true}
                  onClick={onRefuseAttribute.bind(null, attribute.id)}
                  color="error"
                >
                  {/* {t('actions.refuseBtn')} */}
                  {t('actions.revokeBtn')}
                </ButtonNaked>
              )}

              {isActive && (
                <Tooltip title={activeTooltipLabel}>
                  <Check fontSize="small" color="success" />
                </Tooltip>
              )}

              {isRevoked && (
                <Tooltip title={revokedTooltipLabel}>
                  <CloseIcon fontSize="small" color="error" />
                </Tooltip>
              )}

              {!isActive && !isRevoked && (
                <Tooltip sx={{ visibility: 'hidden' }} title={revokedTooltipLabel}>
                  <CloseIcon fontSize="small" color="error" />
                </Tooltip>
              )}

              <ButtonNaked
                onClick={openAttributeDetailsDialog.bind(null, attribute)}
                aria-label={t('showInfoSrLabel')}
              >
                <InfoRounded fontSize="small" color="primary" />
              </ButtonNaked>
            </>
          ) : (
            <>
              {isActive && (
                <StyledTooltip title={activeTooltipLabel}>
                  <Check color="success" fontSize="small" />
                </StyledTooltip>
              )}

              {isRevoked && (
                <Tooltip title={revokedTooltipLabel}>
                  <CloseIcon fontSize="small" color="error" />
                </Tooltip>
              )}

              {onConfirmDeclaredAttribute && (
                <ButtonNaked
                  onClick={onConfirmDeclaredAttribute.bind(null, attribute.id)}
                  color="primary"
                >
                  {t('confirmDeclaredAttributeBtn')}
                </ButtonNaked>
              )}
              <ButtonNaked
                onClick={openAttributeDetailsDialog.bind(null, attribute)}
                aria-label={t('showInfoSrLabel')}
              >
                <InfoRounded fontSize="small" color="primary" />
              </ButtonNaked>
              {!readOnly && (
                <ButtonNaked
                  onClick={onRemove.bind(null, attribute.id)}
                  aria-label={t('deleteSrLabel')}
                >
                  <DeleteOutline fontSize="small" color="error" />
                </ButtonNaked>
              )}
            </>
          )}
        </Stack>
        <Typography
          component="span"
          aria-hidden={!shouldShowOrLabel}
          sx={{
            flexShrink: 0,
            visibility: shouldShowOrLabel ? 'hidden' : 'visible',
          }}
          variant="body2"
          fontStyle="italic"
        >
          {t('or')}
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack sx={{ listStyle: 'none', pl: 0, my: 3 }} component="ul" spacing={2}>
      {attributes.map((attribute, i) => {
        const shouldShowOrLabel = attributes.length === 1 || i === attributes.length - 1
        return (
          <li key={attribute.id}>
            <AttributeItem attribute={attribute} shouldShowOrLabel={shouldShowOrLabel} />
          </li>
        )
      })}
    </Stack>
  )
}

type AttributeGroupStatusChipProps = {
  attributeKey: AttributeKey
  isGroupFullfilled: boolean
}

function AttributeGroupStatusChip({
  attributeKey,
  isGroupFullfilled,
}: AttributeGroupStatusChipProps) {
  const { t } = useTranslation('attribute', { keyPrefix: `group.statusChip.${attributeKey}` })

  function getChipProps(): Partial<ChipProps> {
    if (isGroupFullfilled) {
      return {
        color: 'success',
        label: t('fullfilledLabel'),
      }
    }

    return {
      color: 'warning',
      label: t('unfullfilledLabel'),
    }
  }

  return <Chip size="small" {...getChipProps()} />
}
