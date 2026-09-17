import { mapValidationErrorMessages } from '@/utils/form.utils'
import { Autocomplete } from '@pagopa/mui-italia'
import identity from 'lodash/identity'
import React from 'react'
import { Controller, useFormContext, type ControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import isEqual from 'lodash/isEqual'
import type {
  AutocompleteValue,
  AutocompleteProps,
} from '@pagopa/mui-italia/components/Autocomplete/Autocomplete.types'

export type RHFAutocompleteInput<T> = { label: string; value: T }

export type RHFNewAutocompleteBaseProps<
  T,
  Multiple extends boolean | undefined,
> = AutocompleteProps<T, Multiple> & {
  name: string
  focusOnMount?: boolean
  getOptionValue?: (option: AutocompleteValue<T, Multiple>) => unknown
  defaultValue?: AutocompleteValue<T, Multiple>
  infoLabel?: string
  onValueChange?: (value: AutocompleteValue<T, Multiple>) => void
  setInternalState: React.Dispatch<React.SetStateAction<AutocompleteValue<T, Multiple>>>
  rules?: ControllerProps['rules']
}

const RHFNewAutocompleteBase = <T, Multiple extends boolean | undefined>({
  name,
  label,
  options,
  placeholder,
  defaultValue,
  focusOnMount,
  loading,
  rules,
  getOptionValue = identity,
  infoLabel,
  onValueChange,
  setInternalState,
  ...props
}: RHFNewAutocompleteBaseProps<RHFAutocompleteInput<T>, Multiple>) => {
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

  return (
    <Controller
      name={name}
      rules={mapValidationErrorMessages(rules, tCommon)}
      render={({ field: { onChange: _onChange } }) => (
        <Autocomplete
          id={labelId}
          options={options}
          isOptionEqualToValue={(option, { value }) => isEqual(option.value, value)}
          loading={loading}
          noResultsText={props.noResultsText || t('noDataLabel')}
          defaultValue={defaultValue}
          {...props}
          onChange={(data) => {
            _onChange(getOptionValue(data))
            setInternalState(data)
            if (onValueChange) onValueChange(data)
          }}
          error={Boolean(error)}
          helperText={Boolean(error) ? error : infoLabel}
          required={Boolean(rules?.required)}
          placeholder={placeholder}
          autoFocus={focusOnMount}
          label={label}
        />
      )}
    />
  )
}

export default RHFNewAutocompleteBase
