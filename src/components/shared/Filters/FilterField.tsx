import type {
  AutocompleteFilterFieldOptions,
  DatepickerFilterFieldOptions,
  NumericFilterFieldOptions,
  SelectFilterFieldOptions,
  FilterField as TFilterField,
} from '@/types/filters.types'
import { match } from 'ts-pattern'
import {
  RHFNewAutocompleteSingle,
  RHFNewAutocompleteMultiple,
  RHFNewSelect,
  RHFNewSwitch,
  RHFNewTextField,
} from '../react-hook-form-inputs'
import { RHFDatePicker } from '../react-hook-form-inputs/RHFDatePicker'

type FilterFieldProps = {
  field: TFilterField
}

export const FilterField: React.FC<FilterFieldProps> = ({ field }) => {
  return match(field.type)
    .with('freetext', () => {
      return <RHFNewTextField name={field.name} label={field.label} />
    })
    .with('numeric', () => {
      return (
        <RHFNewTextField
          name={field.name}
          label={field.label}
          type="number"
          inputProps={{
            min: (field as NumericFilterFieldOptions).min,
            max: (field as NumericFilterFieldOptions).max,
          }}
        />
      )
    })
    .with('boolean', () => {
      return (
        <RHFNewSwitch
          name={field.name}
          label={field.label}
          description={field.description}
          sx={{
            pl: '1.125rem',
            m: '0 !important',
          }}
        />
      )
    })
    .with('datepicker', () => {
      return (
        <RHFDatePicker
          name={field.name}
          label={field.label}
          minDate={(field as DatepickerFilterFieldOptions).minDate}
          maxDate={(field as DatepickerFilterFieldOptions).maxDate}
        />
      )
    })
    .with('select-single', () => {
      return (
        <RHFNewSelect
          name={field.name}
          label={field.label}
          options={(field as SelectFilterFieldOptions).options}
        />
      )
    })
    .with('select-multiple', () => {
      return (
        <RHFNewSelect
          multiple
          name={field.name}
          label={field.label}
          options={(field as SelectFilterFieldOptions).options}
        />
      )
    })
    .with('autocomplete-single', () => {
      return (
        <RHFNewAutocompleteSingle
          name={field.name}
          label={field.label}
          options={(field as AutocompleteFilterFieldOptions).options}
          showSelectionCountOnly={true}
          onInputChange={(value) =>
            (field as AutocompleteFilterFieldOptions)?.onTextInputChange?.(value)
          }
        />
      )
    })
    .with('autocomplete-multiple', () => {
      return (
        <RHFNewAutocompleteMultiple
          name={field.name}
          label={field.label}
          showSelectionCountOnly={true}
          options={(field as AutocompleteFilterFieldOptions).options}
          onInputChange={(value) => {
            ;(field as AutocompleteFilterFieldOptions).onTextInputChange?.(value)
          }}
        />
      )
    })
    .exhaustive()
}
