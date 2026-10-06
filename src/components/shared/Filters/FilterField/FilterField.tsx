import type { FilterField as TFilterField } from '@/types/filters.types'
import { FreetextFilterField } from './FreetextFilterField'
import { NumericFilterField } from './NumericFilterField'
import { BooleanFilterField } from './BooleanFilterField'
import { SingleSelectFilterField } from './SingleSelectFilterField'
import { MultipleSelectFilterField } from './MultipleSelectFilterField'
import { SingleAutocompleteFilterField } from './SingleAutocompleteFilterField'
import { MultipleAutocompleteFilterField } from './MultipleAutocompleteFilterField'

type FilterFieldProps = {
  field: TFilterField
}

export const FilterField: React.FC<FilterFieldProps> = ({ field }) => {
  switch (field.type) {
    case 'freetext':
      return <FreetextFilterField field={field} />
    case 'numeric':
      return <NumericFilterField field={field} />
    case 'boolean':
      return <BooleanFilterField field={field} />
    case 'select-single':
      return <SingleSelectFilterField field={field} />
    case 'select-multiple':
      return <MultipleSelectFilterField />
    case 'autocomplete-single':
      return <SingleAutocompleteFilterField />
    case 'autocomplete-multiple':
      return <MultipleAutocompleteFilterField />
    default:
      return null
  }
}
