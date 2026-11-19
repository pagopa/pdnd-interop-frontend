import React, { useId } from 'react'
import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material'
import { MISelect, type MISelectProps } from '@pagopa/mui-italia'
import { Controller, useFormContext } from 'react-hook-form'
import type { InputOption } from '@/types/common.types'
import type { ControllerProps } from 'react-hook-form/dist/types'
import { useTranslation } from 'react-i18next'
import { mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFNewSelectProps = Omit<MISelectProps, 'onChange' | 'label' | 'value'> & {
  name: string
  options: Array<InputOption & { disabled?: boolean }>
  label?: string
  rules?: ControllerProps['rules']
  onValueChange?: (value: string | number) => void
  emptyLabel?: string
  infoLabel?: string
  selectAllLabel?: string
}

export const RHFNewSelect: React.FC<RHFNewSelectProps> = ({
  name,
  options,
  label,
  rules,
  onValueChange,
  emptyLabel,
  disabled,
  infoLabel,
  selectAllLabel,
  ...props
}) => {
  const { formState } = useFormContext()
  const { t } = useTranslation()
  const labelId = useId()
  const errorId = useId()
  const infoId = useId()
  const error = formState.errors[name]?.message as string | undefined
  let selectAllValue = '__select_all__'
  while (options.some((option) => option.value === selectAllValue)) selectAllValue += '_'

  const describedBy = [infoLabel && infoId, error && errorId].filter(Boolean).join(' ') || undefined

  const conditionalRules = mapValidationErrorMessages(rules, t)

  return (
    <Controller
      name={name}
      rules={conditionalRules}
      render={({ field: { ref, onChange, value, ...fieldProps } }) => {
        const enabledOptions = options.filter((option) => !option.disabled)
        const allSelected =
          enabledOptions.length > 0 &&
          enabledOptions.every((option) => Array.isArray(value) && value.includes(option.value))

        return (
          <FormControl
            fullWidth
            error={!!error}
            disabled={disabled}
            required={Boolean(rules?.required)}
          >
            <InputLabel id={labelId}>{label}</InputLabel>
            <MISelect
              {...props}
              {...fieldProps}
              value={
                props.multiple && selectAllLabel && allSelected
                  ? [...value, selectAllValue]
                  : (value ?? '')
              }
              labelId={labelId}
              ref={ref}
              id={name}
              inputRef={ref}
              label={label}
              onChange={(e: SelectChangeEvent<unknown>) => {
                if (props.multiple && selectAllLabel && Array.isArray(e.target.value)) {
                  const selected = e.target.value as Array<string | number>
                  if (selected.includes(selectAllValue) !== allSelected) {
                    const retained = (Array.isArray(value) ? value : []).filter(
                      (item) => !enabledOptions.some((option) => option.value === item)
                    )
                    onChange(
                      allSelected ? retained : [...retained, ...enabledOptions.map((o) => o.value)]
                    )
                  } else {
                    onChange(selected.filter((item) => item !== selectAllValue))
                  }
                  return
                }
                const nextValue = e.target.value as string | number
                onChange(nextValue)
                if (onValueChange) onValueChange(nextValue)
              }}
              disabled={disabled}
              aria-describedby={describedBy}
              aria-invalid={!!error}
              renderValue={
                props.multiple && selectAllLabel
                  ? (selected) =>
                      options
                        .filter((option) =>
                          (selected as Array<string | number>).includes(option.value)
                        )
                        .map((option, index) => (
                          <React.Fragment key={option.value}>
                            {index > 0 && ', '}
                            {option.label}
                          </React.Fragment>
                        ))
                  : props.renderValue
              }
            >
              {props.multiple && selectAllLabel && (
                <MenuItem value={selectAllValue} sx={{ color: 'primary.main', gap: 1 }}>
                  <Checkbox
                    checked={allSelected}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-hidden': true }}
                    sx={{ p: 0, pointerEvents: 'none' }}
                  />
                  {selectAllLabel}
                </MenuItem>
              )}
              {options.length > 0 ? (
                options.map((option, index) => (
                  <MenuItem
                    key={`${name}-${option.value}-${index}`}
                    value={option.value}
                    disabled={option.disabled}
                    sx={
                      props.multiple && selectAllLabel
                        ? {
                            justifyContent: 'space-between',
                            borderBottom: 1,
                            borderColor: 'divider',
                            '&.Mui-selected': {
                              color: 'text.primary',
                              backgroundColor: 'background.paper',
                            },
                            '&.Mui-selected:hover': { backgroundColor: 'action.hover' },
                          }
                        : undefined
                    }
                  >
                    {option.label}
                    {props.multiple && selectAllLabel && (
                      <Checkbox
                        checked={((value ?? []) as Array<string | number>).includes(option.value)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-hidden': true }}
                        sx={{ p: 0, ml: 2, pointerEvents: 'none' }}
                      />
                    )}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">{emptyLabel ?? ''}</MenuItem>
              )}
            </MISelect>
            {infoLabel && (
              <FormHelperText id={infoId} component="span" error={false} sx={{ fontWeight: 400 }}>
                {infoLabel}
              </FormHelperText>
            )}
            {error && (
              <FormHelperText id={errorId} role="alert">
                {error}
              </FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}
