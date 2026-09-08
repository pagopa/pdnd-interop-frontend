import { getAriaAccessibilityInputProps, mapValidationErrorMessages } from '@/utils/form.utils'
import { Autocomplete /* type AutocompleteProps */ } from '@pagopa/mui-italia'
import identity from 'lodash/identity'
import React from 'react'
import { Controller, useFormContext, type ControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { InputWrapper } from '../../InputWrapper'
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
  labelType?: 'external' | 'shrink'
  focusOnMount?: boolean
  getOptionValue?: (option: AutocompleteValue<T, Multiple>) => unknown
  defaultValue?: AutocompleteValue<T, Multiple>
  infoLabel?: string
  onValueChange?: (value: AutocompleteValue<T, Multiple>) => void
  setInternalState: React.Dispatch<React.SetStateAction<AutocompleteValue<T, Multiple>>>
  // loadingText?: React.ReactNode
  // variant?: TextFieldProps['variant']
  rules?: ControllerProps['rules']
}

const RHFNewAutocompleteBase = <T, Multiple extends boolean | undefined>({
  name,
  label,
  labelType = 'shrink',
  options,
  placeholder,
  defaultValue,
  sx,
  focusOnMount,
  loading,
  onChange,
  helperText,
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
            loading={loading}
            noResultsText={props.noResultsText || t('noDataLabel')}
            defaultValue={defaultValue}
            // PaperComponent={({ children }) => <Paper elevation={4}>{children}</Paper>}
            // ListboxProps={{
            //   style: { maxHeight: 200, ...props.ListboxProps?.style },
            //   ...props.ListboxProps,
            // }}
            {...props}
            onChange={(data) => {
              _onChange(getOptionValue(data))
              setInternalState(data)
              if (onValueChange) onValueChange(data)
            }}
            error={Boolean(error)}
            required={Boolean(rules?.required)}
            placeholder={placeholder}
            autoFocus={focusOnMount}
            label={label}
          />
        )}
      />
    </InputWrapper>
  )
  // return <Autocomplete options={[]} />
}

export default RHFNewAutocompleteBase
