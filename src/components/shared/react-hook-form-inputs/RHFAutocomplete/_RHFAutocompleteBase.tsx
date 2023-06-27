import React from 'react'
import {
  Autocomplete,
  type AutocompleteProps,
  type AutocompleteValue,
  CircularProgress,
  Paper,
  TextField,
  type TextFieldProps,
  Typography,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { InputWrapper } from '../../InputWrapper'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { useTranslation } from 'react-i18next'
import identity from 'lodash/identity'
import isEqual from 'lodash/isEqual'
import type { ControllerProps } from 'react-hook-form/dist/types/controller'
import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'

export type RHFAutocompleteInput<T> = { label: string; value: T }

export type RHFAutocompleteBaseProps<
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
export function _RHFAutocompleteBase<
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
}: RHFAutocompleteBaseProps<RHFAutocompleteInput<T>, Multiple, DisableClearable, FreeSolo>) {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'autocompleteMultiple',
  })
  const { t: tCommon } = useTranslation()
  const { formState, watch, setValue } = useFormContext()
  const labelId = React.useId()

  const value = watch(name)

  // Syncs the use-hook-form value with the given Autocomplete default value
  React.useEffect(() => {
    if (defaultValue && !value) {
      setValue(name, getOptionValue(defaultValue))
    }
  }, [defaultValue, value, setValue, getOptionValue, name])

  const error = formState.errors[name]?.message as string | undefined

  const { accessibilityProps, ids } = getAriaAccessibilityInputProps(name, {
    error,
    infoLabel,
  })

  return (
    <InputWrapper error={error} sx={{ my: 0, ...sx }} infoLabel={infoLabel} {...ids}>
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
            PaperComponent={({ children }) => <Paper elevation={4}>{children}</Paper>}
            ListboxProps={{
              style: { maxHeight: 200, ...props.ListboxProps?.style },
              ...props.ListboxProps,
            }}
            {...props}
            onChange={(_, data) => {
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
                    ...accessibilityProps,
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
            renderOption={(props, value, { inputValue }) => {
              const label = value.label
              if (!label) return null

              const matches = match(label, inputValue, { insideWords: true })
              const parts = parse(label, matches)

              return (
                <li {...props}>
                  <div>
                    {parts.map((part, i) => (
                      <Typography
                        component="span"
                        key={i}
                        sx={{ fontWeight: part.highlight ? 700 : 400 }}
                      >
                        {part.text}
                      </Typography>
                    ))}
                  </div>
                </li>
              )
            }}
          />
        )}
      />
    </InputWrapper>
  )
}
