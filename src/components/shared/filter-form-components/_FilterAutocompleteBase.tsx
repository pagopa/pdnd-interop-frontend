import React from 'react'
import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteValue,
  Checkbox,
  CircularProgress,
  TextField,
  TextFieldProps,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import identity from 'lodash/identity'
import isEqual from 'lodash/isEqual'
import { ControllerProps } from 'react-hook-form/dist/types/controller'
import { mapValidationErrorMessages } from '@/utils/validation.utils'
import { InputWrapper } from '../InputWrapper'

export type FilterAutocompleteInput<T> = { label: string; value: T }

export type FilterAutocompleteBaseProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
> = Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, 'div'>, 'renderInput'> & {
  name: string
  label: string
  infoLabel?: string
  focusOnMount?: boolean
  getOptionValue?: (option: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>) => unknown
  variant?: TextFieldProps['variant']
  rules?: ControllerProps['rules']
  onValueChange?: (value: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>) => void
  setInternalState: React.Dispatch<
    React.SetStateAction<AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>>
  >
}

/** Do not use.  */
export function _FilterAutocompleteBase<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined
>({
  name,
  infoLabel,
  sx,
  label,
  focusOnMount,
  options,
  placeholder,
  loading,
  defaultValue,
  rules,
  onValueChange,
  setInternalState,
  variant = 'outlined',
  getOptionValue = identity,
  ...props
}: FilterAutocompleteBaseProps<FilterAutocompleteInput<T>, Multiple, DisableClearable, FreeSolo>) {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'autocompleteMultiple',
  })
  const { t: tCommon } = useTranslation()
  const { formState, watch, setValue } = useFormContext()
  const labelId = React.useId()

  const valueRHF = watch(name)

  // Syncs the use-hook-form value with the given Autocomplete default value
  React.useEffect(() => {
    if (defaultValue && !valueRHF) {
      setValue(name, getOptionValue(defaultValue))
    }
  }, [defaultValue, valueRHF, setValue, getOptionValue, name])

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper error={error} sx={{ my: 0, ...sx }} infoLabel={infoLabel}>
      <Controller
        name={name}
        rules={mapValidationErrorMessages(rules, tCommon)}
        render={({ field: { ref, onChange: _onChange } }) => (
          <Autocomplete
            id={labelId}
            options={options}
            isOptionEqualToValue={(option, { value }) => isEqual(option.value, value)}
            loadingText={props.loadingText || t('loadingLabel')}
            noOptionsText={props.noOptionsText || t('noDataLabel')}
            loading={loading}
            defaultValue={defaultValue}
            ListboxProps={{
              style: { maxHeight: 200, ...props.ListboxProps?.style },
              ...props.ListboxProps,
            }}
            disableCloseOnSelect
            renderTags={() => null}
            {...props}
            onChange={(event, data, reason) => {
              if (
                event.type === 'keydown' &&
                (event as React.KeyboardEvent).key === 'Backspace' &&
                reason === 'removeOption'
              ) {
                return
              }
              _onChange(getOptionValue(data))
              setInternalState(data)
              if (onValueChange) onValueChange(data)
            }}
            renderInput={(params) => {
              return (
                <TextField
                  variant={variant}
                  error={!!error}
                  placeholder={placeholder ?? '...'}
                  {...params}
                  autoFocus={focusOnMount}
                  InputLabelProps={{ shrink: true, ...params.InputLabelProps }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="primary" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  label={label}
                  inputRef={ref}
                />
              )
            }}
            renderOption={(props, option, { selected, index }) => {
              const label = option.label
              if (!label) return null

              return (
                <li {...props}>
                  <Checkbox key={index} checked={selected} name={label} />
                  {label}
                </li>
              )
            }}
          />
        )}
      />
    </InputWrapper>
  )
}
