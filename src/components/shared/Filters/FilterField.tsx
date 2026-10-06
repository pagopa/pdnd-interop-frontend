import type {
  AutocompleteFilterFieldOptions,
  SelectFilterFieldOptions,
  FilterField as TFilterField,
} from '@/types/filters.types'
import { match } from 'ts-pattern'
import {
  RHFAutocompleteSingle,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from '../react-hook-form-inputs'

type FilterFieldProps = {
  field: TFilterField
}

export const FilterField: React.FC<FilterFieldProps> = ({ field }) => {
  return match(field.type)
    .with('freetext', () => {
      return <RHFTextField name={field.name} label={field.label} />
    })
    .with('numeric', () => {
      return <RHFTextField name={field.name} label={field.label} type="number" />
    })
    .with('boolean', () => {
      return <RHFSwitch name={field.name} label={field.label} infoLabel={field.description} />
    })
    .with('datepicker', () => {
      return <div>Datepicker component placeholder</div>
    })
    .with('select-single', () => {
      return (
        <RHFSelect
          name={field.name}
          label={field.label}
          options={(field as SelectFilterFieldOptions).options}
        />
      )
    })
    .with('select-multiple', () => {
      return <div>Select multiple component placeholder</div>
    })
    .with('autocomplete-single', () => {
      return (
        <RHFAutocompleteSingle
          name={field.name}
          label={field.label}
          options={(field as AutocompleteFilterFieldOptions).options}
        />
      )
    })
    .with('autocomplete-multiple', () => {
      return <div>Autocomplete multiple component placeholder</div>
    })
    .exhaustive()
}
