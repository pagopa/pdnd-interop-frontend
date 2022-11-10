import React from 'react'
import {
  Autocomplete,
  AutocompleteProps,
  AutocompleteValue,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import { InputWrapper } from '../../InputWrapper'
import parse from 'autosuggest-highlight/parse'
import match from 'autosuggest-highlight/match'
import { useTranslation } from 'react-i18next'
import identity from 'lodash/identity'

export type AutocompleteBaseProps<
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
}

/** Do not use.  */
export function _AutocompleteBase<
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
  getOptionLabel = identity,
  getOptionValue = identity,
  ...props
}: AutocompleteBaseProps<T, Multiple, DisableClearable, FreeSolo>) {
  const { t } = useTranslation('shared-components', {
    keyPrefix: 'autocompleteMultiple',
  })
  const { formState, control, watch, setValue } = useFormContext()
  const labelId = React.useId()

  const value = watch(name)

  // Syncs the use-hook-form value with the given Autocomplete default value
  React.useEffect(() => {
    if (defaultValue && !value) {
      setValue(name, getOptionValue(defaultValue))
    }
  }, [defaultValue, value, setValue, getOptionValue, name])

  const error = formState.errors[name]?.message as string | undefined

  return (
    <InputWrapper name={name} error={error} sx={{ my: 0, ...sx }} infoLabel={infoLabel}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange } }) => (
          <Autocomplete
            id={labelId}
            options={options}
            loadingText={props.loadingText || t('loadingLabel')}
            noOptionsText={props.noOptionsText || t('noDataLabel')}
            loading={loading}
            defaultValue={defaultValue}
            ListboxProps={{
              style: { maxHeight: 200, ...props.ListboxProps?.style },
              ...props.ListboxProps,
            }}
            {...props}
            onChange={(_, data) => {
              const newValue = getOptionValue(data)
              onChange(newValue)
              return newValue
            }}
            renderInput={(params) => {
              return (
                <TextField
                  variant="outlined"
                  error={!!error}
                  placeholder={placeholder || '...'}
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
                />
              )
            }}
            renderOption={(props, value, { inputValue }) => {
              const label = getOptionLabel(value)
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
            renderTags={(value, getTagProps) => (
              <React.Fragment>
                {value.map((option, index: number) => (
                  <Chip // eslint-disable-line react/jsx-key
                    variant="outlined"
                    label={getOptionLabel(option)}
                    {...getTagProps({ index })}
                  />
                ))}
              </React.Fragment>
            )}
          />
        )}
      />
    </InputWrapper>
  )
}
