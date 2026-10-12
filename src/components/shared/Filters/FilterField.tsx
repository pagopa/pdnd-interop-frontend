import type {
  AutocompleteFilterFieldOptions,
  SelectFilterFieldOptions,
  FilterField as TFilterField,
} from '@/types/filters.types'
import { match } from 'ts-pattern'
import {
  RHFNewAutocompleteSingle,
  RHFNewAutocompleteMultiple,
  RHFNewSelect,
  RHFSwitch,
  RHFNewTextField,
} from '../react-hook-form-inputs'

type FilterFieldProps = {
  field: TFilterField
}

export const FilterField: React.FC<FilterFieldProps> = ({ field }) => {
  return match(field.type)
    .with('freetext', () => {
      return <RHFNewTextField name={field.name} label={field.label} />
    })
    .with('numeric', () => {
      return <RHFNewTextField name={field.name} label={field.label} type="number" />
    })
    .with('boolean', () => {
      return <RHFSwitch name={field.name} label={field.label} infoLabel={field.description} />
    })
    .with('datepicker', () => {
      return <div>Datepicker component placeholder</div>
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
